/*
 * Orbital Distance Generator and Functions
 */

window.orbitalDistanceGenerator = (function () {
    var localChance = new Chance(new Date());

    var settings = {
        seedRoll: {
            rollFunction: localChance.d6,
            iterations: 1,
            maxRoll: 6,
            minRoll: 1
        },
        constantRoll: {
            rollFunction: localChance.d6,
            iterations: 1,
            maxRoll: 6,
            minRoll: 1
        },
        zoneDivisors: {
            red: 16,
            yellow: 2, // 1.64
            green: 0.4, // 0.59
            blue: 0.04, // 0.0025
            black: 0.0004 //0.000625
        },
        seriesMax: 100,
        multiplier: 2,
        divisor: 10
    };

    // Orbital Distance Calculation
    // Steps:
    // 1. Get Seed
    // 2. Start with 0, then seed, then double remaining entires in series
    // 3. Get Constant
    // 4. Add constant to series
    // 5. Divide series by 10
    // Result is Orbital Distance progression in au
    function calculate(lum) {
        var luminosity = (typeof lum == "undefined" || jQuery.trim(lum) == "") ? 1 : lum;
        var naPos = settings.seriesMax;
        var redPos = 0;
        var orbitalDistance = {
            roll: {},
            series: [],
            zones: {
                red: getRedZone(luminosity, 0),
                yellow: getYellowZone(luminosity, 0),
                green: getGreenZone(luminosity, 0),
                blue: getBlueZone(luminosity, 0),
                black: getBlackZone(luminosity, 0)
            }
        };

        orbitalDistance.roll.constant = rollHelper.roll(settings.constantRoll);
        orbitalDistance.roll.seed = rollHelper.roll(settings.seedRoll);

        orbitalDistance.series[0] = { position: 1, distance: 0 };
        orbitalDistance.series[1] = { position: 2, distance: orbitalDistance.roll.seed.total };

        for(var i = 2; i < settings.seriesMax; i++) {
            orbitalDistance.series[i] = { position: i + 1, distance: (orbitalDistance.series[i - 1].distance * settings.multiplier) };
        }

        orbitalDistance.series.forEach(function(element) {
            element.distance = (element.distance + orbitalDistance.roll.constant.total) / settings.divisor;
            element.zone = getZone(orbitalDistance.zones, element.distance);

            if(element.position < naPos && element.zone == "N/A") { naPos = element.position; }
            if(element.zone == "red") { redPos = element.position - 1; }
        });

        orbitalDistance.series = orbitalDistance.series.splice(0, naPos);
        orbitalDistance.series = orbitalDistance.series.splice(redPos, settings.seriesMax);

        return orbitalDistance;
    }

    function calculateMultiStar(star, stars) {
        var luminosity = star.luminosity;
        var naPos = settings.seriesMax;
        var redPos = 0;
        var zoneDivisorModifier = 0;

        // Adjust for other stars
        stars.forEach(function(otherStar) {
            if(star.id != otherStar.id) {
                zoneDivisorModifier = zoneDivisorModifier + (otherStar.luminosity / (otherStar.orbitalSeparation.distance ^ 2));
            }
        });

        var orbitalDistance = {
            roll: {},
            series: [],
            zoneDivisorModifier: zoneDivisorModifier,
            zoneDivisors: settings.zoneDivisors,
            zones: {
                red: getRedZone(luminosity, zoneDivisorModifier),
                yellow: getYellowZone(luminosity, zoneDivisorModifier),
                green: getGreenZone(luminosity, zoneDivisorModifier),
                blue: getBlueZone(luminosity, zoneDivisorModifier),
                black: getBlackZone(luminosity, zoneDivisorModifier)
            }
        };

        orbitalDistance.roll.constant = rollHelper.roll(settings.constantRoll);
        orbitalDistance.roll.seed = rollHelper.roll(settings.seedRoll);

        orbitalDistance.series[0] = { position: 1, distance: 0 };
        orbitalDistance.series[1] = { position: 2, distance: orbitalDistance.roll.seed.total };

        for(var i = 2; i < settings.seriesMax; i++) {
            orbitalDistance.series[i] = { position: i + 1, distance: (orbitalDistance.series[i - 1].distance * settings.multiplier) };
        }

        orbitalDistance.series.forEach(function(element) {
            element.distance = (element.distance + orbitalDistance.roll.constant.total) / settings.divisor;
            element.zone = getZone(orbitalDistance.zones, element.distance);

            if(element.position < naPos && element.zone == "N/A") { naPos = element.position; }
            if(element.zone == "red") { redPos = element.position - 1; }
        });

        orbitalDistance.series = orbitalDistance.series.splice(0, naPos);
        orbitalDistance.series = orbitalDistance.series.splice(redPos, settings.seriesMax);

        return orbitalDistance;
    }

    function getZone(zones, au) {
        if(zones.red.min < au && au < zones.red.max) { return "red"; }
        else if(zones.yellow.min < au && au < zones.yellow.max) { return "yellow"; }
        else if(zones.green.min < au && au < zones.green.max) { return "green"; }
        else if(zones.blue.min < au && au < zones.blue.max) { return "blue"; }
        else if(zones.black.min < au && au < zones.black.max) { return "black"; }
        else { return "N/A"; }
    }

    function getRedZone(luminosity, zoneDivisorModifier) {
        return {
            min: 0,
            max: Math.sqrt(luminosity / (settings.zoneDivisors.red + zoneDivisorModifier))
        };
    }

    function getYellowZone(luminosity, zoneDivisorModifier) {
        return {
            min: Math.sqrt(luminosity / (settings.zoneDivisors.red + zoneDivisorModifier)),
            max: Math.sqrt(luminosity / (settings.zoneDivisors.yellow + zoneDivisorModifier))
        };
    }

    function getGreenZone(luminosity, zoneDivisorModifier) {
        return {
            min: Math.sqrt(luminosity / (settings.zoneDivisors.yellow + zoneDivisorModifier)),
            max: Math.sqrt(luminosity / (settings.zoneDivisors.green + zoneDivisorModifier))
        };
    }

    function getBlueZone(luminosity, zoneDivisorModifier) {
        return {
            min: Math.sqrt(luminosity / (settings.zoneDivisors.green + zoneDivisorModifier)),
            max: Math.sqrt(luminosity / (settings.zoneDivisors.blue + zoneDivisorModifier))
        };
    }

    function getBlackZone(luminosity, zoneDivisorModifier) {
        return {
            min: Math.sqrt(luminosity / (settings.zoneDivisors.blue + zoneDivisorModifier)),
            max: Math.sqrt(luminosity / (settings.zoneDivisors.black + zoneDivisorModifier))
        };
    }

    // Return Methods and Values
    return {
        calculate: calculate,
        calculateMultiStar: calculateMultiStar,
        settings: settings
    };
})();
