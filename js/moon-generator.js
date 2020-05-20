/*
 * Planet Generator and Functions
 */

window.moonGenerator = (function () {
    var localChance = new Chance(new Date());

    // Pull settings from PlanetGenerator
    var settings = planetFunctions.settings;

    function rollMoon(planet, zone) {
        var satellites = [];
        var rolls = {};

        if(zone == "red") { return satellites; }
        else if(planet.code == "planet.class.a" || planet.code == "planet.class.b"
                || planet.code == "planet.class.c" || planet.code == "planet.class.e"
                || planet.code == "planet.class.f" || planet.code == "planet.class.h"
                || planet.code == "planet.class.k" || planet.code == "planet.class.y") {
            rollD = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -3 });
            rollF = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            moonCountClassD = ((rollD.total < 0) ? 0 : rollD.total) + getMoonRollModifier(planet.mass);
            moonCountClassF = ((rollF.total < 0) ? 0 : rollF.total) + getMoonRollModifier(planet.mass);
            planet.satelliteCount = Math.max(0, moonCountClassD) + Math.max(0, moonCountClassF);

            rollMoonFn(planet, zone, satellites, "planet.class.d", moonCountClassD);
            rollMoonFn(planet, zone, satellites, "planet.class.f", moonCountClassF);
        }
        else if(planet.code == "planet.class.g") {
            rollD = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -3 });
            rollG = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            moonCountClassD = ((rollD.total < 0) ? 0 : rollD.total) + getMoonRollModifier(planet.mass);
            moonCountClassG = ((rollG.total < 0) ? 0 : rollG.total) + getMoonRollModifier(planet.mass);
            planet.satelliteCount = Math.max(0, moonCountClassD) + Math.max(0, moonCountClassG);

            rollMoonFn(planet, zone, satellites, "planet.class.d", moonCountClassD);
            rollMoonFn(planet, zone, satellites, "planet.class.g", moonCountClassG);
        }
        else if(planet.code == "planet.class.i" || planet.code == "planet.class.j"
                || planet.code == "planet.class.s" || planet.code == "planet.class.t"
                || planet.code == "planet.class.u") {
            rollD = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: -3 });
            rollF = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            rollG = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            rollK = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            moonCountClassD = ((rollD.total < 0) ? 0 : rollD.total) + getMoonRollModifier(planet.mass);
            moonCountClassF = ((rollF.total < 0) ? 0 : rollF.total) + getMoonRollModifier(planet.mass);
            moonCountClassG = ((rollG.total < 0) ? 0 : rollG.total) + getMoonRollModifier(planet.mass);
            moonCountClassK = ((rollK.total < 0) ? 0 : rollK.total) + getMoonRollModifier(planet.mass);
            planet.satelliteCount = Math.max(0, moonCountClassD) + Math.max(0, moonCountClassF)
                    + Math.max(0, moonCountClassG) + Math.max(0, moonCountClassK);

            rollMoonFn(planet, zone, satellites, "planet.class.d", moonCountClassD);
            rollMoonFn(planet, zone, satellites, "planet.class.f", moonCountClassF);
            rollMoonFn(planet, zone, satellites, "planet.class.g", moonCountClassG);
            rollMoonFn(planet, zone, satellites, "planet.class.k", moonCountClassK);
        }
        else if(planet.code == "planet.class.l" || planet.code == "planet.class.m"
                || planet.code == "planet.class.n" || planet.code == "planet.class.o"
                || planet.code == "planet.class.p" || planet.code == "planet.class.q") {
            rollD = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -2 });
            rollF = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            rollG = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            rollL = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -5 });
            moonCountClassD = ((rollD.total < 0) ? 0 : rollD.total) + getMoonRollModifier(planet.mass);
            moonCountClassF = ((rollF.total < 0) ? 0 : rollF.total) + getMoonRollModifier(planet.mass);
            moonCountClassG = ((rollG.total < 0) ? 0 : rollG.total) + getMoonRollModifier(planet.mass);
            moonCountClassL = ((rollL.total < 0) ? 0 : rollL.total) + getMoonRollModifier(planet.mass);
            planet.satelliteCount = Math.max(0, moonCountClassD) + Math.max(0, moonCountClassF)
                    + Math.max(0, moonCountClassG) + Math.max(0, moonCountClassL);

            rollMoonFn(planet, zone, satellites, "planet.class.d", moonCountClassD);
            rollMoonFn(planet, zone, satellites, "planet.class.f", moonCountClassF);
            rollMoonFn(planet, zone, satellites, "planet.class.g", moonCountClassG);
            rollMoonFn(planet, zone, satellites, "planet.class.l", moonCountClassL);
        }

        return satellites.sort((a, b) => (a.distance.value > b.distance.value) ? 1 : -1);;
    }

    function rollMoonFn(planet, zone, satellites, type, count) {
        var moon = null;

        for(var i = 0; i < count; i++) {
            do { moon = resultHelper.clone(rollMoonDetails(planet, type, zone)); }
            while(moon != null
                && satellites.length > 0
                && typeof satellites.find(element => element.distance.value == moon.distance.value) != "undefined");

            if(moon != null) { satellites.push(moon); }
        }
    }

    function rollMoonDetails(planet, code, zone) {
        var moon = {};

        var distance = getMoonDistance(code);
        var heat = null;

        // Jovian Planets
        if(code == "planet.class.f" || code == "planet.class.g" || code == "planet.class.k"
                && distance.value > settings.rocheLimit && zone != "red"
                && (planet.code == "planet.class.j" || planet.code == "planet.class.s"
                    || planet.code == "planet.class.u")) {
            // Zone Heat
            if(zone == "yellow") { heat = 350; }
            else if(zone == "green") { heat = 10; }
            else if(zone == "blue") { heat = -100; }
            else if(zone == "black") { heat = -200; }

            // Tidal Heating
            if(distance.value < 5) { heat += 600; }
            else if(distance.value == 6) { heat += 150; }
            else if(distance.value == 7) { heat += 50; }
            else if(distance.value == 8) { heat += 20; }
            else if(distance.value == 9) { heat += 10; }

            // IR Heating
            if(planet.code == "planet.class.j") {
                if(distance.value < 5) { heat += 100; }
                else if(distance.value == 6) { heat += 30; }
                else if(distance.value == 7) { heat += 10; }
                else if(distance.value == 8) { heat += 0; }
                else if(distance.value == 9) { heat += 0; }
            }
            else if(planet.code == "planet.class.s") {
                if(distance.value < 5) { heat += 700; }
                else if(distance.value == 6) { heat += 250; }
                else if(distance.value == 7) { heat += 80; }
                else if(distance.value == 8) { heat += 20; }
                else if(distance.value == 9) { heat += 0; }
            }
            else if(planet.code == "planet.class.u") {
                if(distance.value < 5) { heat += 600; }
                else if(distance.value == 6) { heat += 1000; }
                else if(distance.value == 7) { heat += 650; }
                else if(distance.value == 8) { heat += 70; }
                else if(distance.value == 9) { heat += 30; }
            }

            if(heat >= 750) { code = "planet.class.y"; }
            else if(heat >= 100) { code = "planet.class.k"; }
            else if(heat >= -10) {
                var roll = localChance.d6();

                if(roll == 6) {code = "planet.class.m"; }
                else if(roll == 5) {code = "planet.class.o"; }
                else if(roll == 4) {code = "planet.class.p"; }
                else if(roll == 3) {code = "planet.class.l"; }
                else if(roll == 2) {code = "planet.class.h"; }
                else {code = "planet.class.k"; }
            }
            else if(heat >= -100) {
                var roll = localChance.d6();

                if(roll >= 6) {code = "planet.class.p"; }
                else if(roll >= 4) {code = "planet.class.g"; }
                else if(roll == 3) {code = "planet.class.f"; }
                else if(roll == 2) {code = "planet.class.h"; }
                else {code = "planet.class.k"; }
            }
            else {
                var roll = localChance.d6();

                if(roll >= 4) {code = "planet.class.g"; }
                else {code = "planet.class.f"; }
            }
        }

        var density = planetFunctions.getDensity(code, zone);

        if(distance.value > settings.rocheLimit || density.code == "density.earthLike" || density.code == "density.metalRich") {
            moon = resultHelper.clone(planetGenerator.getTable().find(element => element.code == code));
        }
        else {
            // if(planet.code == "planet.class.j" || planet.code == "planet.class.s" || planet.code == "planet.class.u") {
            //     planet.name = "Class T";
            // }

            moon = resultHelper.clone(planetGenerator.getTable().find(element => element.code == "planet.rings"));
        }

        moon.parent = "planet";
        moon.orbit = planetFunctions.getOrbit(rollHelper.roll(settings.orbitRoll));
        moon.distance = distance;
        moon.distance.valueKm = distance.value * planet.radius;
        moon.orbitalPeriod = stellarCalculator.calculateLunarOrbitalPeriod(planet.mass, moon.distance.valueKm);
        moon.inclination = planetFunctions.getInclination(rollHelper.roll(settings.inclinationRoll));
        moon.zone = zone;
        moon.age = planet.age;
        moon.density = density;

        var i = 0;
        do{ moon.mass = planetFunctions.getMass(moon, code) * settings.moonMassMultiplier; i++; }
        while(moon.mass > (planet.mass * settings.moonMassMaxRatio) && i < settings.maxIterations);

        i = 0;
        do{ moon.planetaryRadius = stellarCalculator.calculateDiameter(moon.mass, moon.density.value); i++; }
        while(moon.planetaryRadius > (planet.planetaryRadius * settings.moonRadiusMultiplier) && i < settings.maxIterations);

        moon.radius = stellarCalculator.calculateRadius(moon.planetaryRadius);
        moon.diameter = moon.radius * 2;
        moon.gravity = moon.planetaryRadius * moon.density.value;
        // moon.dayLength = getDayLength(moon);
        moon.dayLength = moon.orbitalPeriod * 24;
        moon.atmosphere = planetFunctions.getAtmosphere(moon);
        moon.atmosphericComposition = planetFunctions.getAtmosphericComposition(moon);
        moon.hydrosphere = planetFunctions.getHydrosphere(moon);
        moon.temperature = planetFunctions.getTemperature(moon, zone);
        moon.axialTilt = { name: "N/A", value: 0};
        moon.weather = planetFunctions.getWeatherPaterns(moon);
        moon.tectonicActivity = planetFunctions.getTectonicActivity(moon);
        moon.life = planetFunctions.getLife(moon);

        // DetermingRetrograde
        if(moon.axialTilt.value > 90) {moon.axialTilt.value -= 90; moon.axialTilt.name = "Retrograde"; }

        // Modify Parent Days
        // if(planet.dayLength > 0 && moon.mass > (planet.mass * 0.1)) {
        //     if(moon.distance.code == "orbit.close") { planet.dayLength.value += rollHelper.roll({ rollFunction: localChance.d6, iterations: 3}); }
        //     else if(moon.distance.code == "orbit.medium") { planet.dayLength.value += rollHelper.roll({ rollFunction: localChance.d6, iterations: 2}); }
        //     else if(moon.distance.code == "orbit.distant") { planet.dayLength.value += rollHelper.roll({ rollFunction: localChance.d6, iterations: 1}); }
        // }

        // Cleanup
        delete moon.age_max;
        delete moon.age_min;
        delete moon.atmosphere_desc;
        delete moon.black_zone;
        delete moon.blue_zone;
        delete moon.green_zone;
        delete moon.yellow_zone;
        delete moon.red_zone;
        delete moon.density_max;
        delete moon.density_min;
        delete moon.diameter_max;
        delete moon.diameter_min;
        delete moon.evolution;
        delete moon.examples;
        delete moon.id;
        delete moon.order;
        delete moon.surface;

        return (i >= settings.maxIterations) ? null : moon;
    }

    function getMoonRollModifier(mass) {
        if(mass > 500) { return 5; }
        else if(mass > 100) { return 3; }
        else if(mass > 10) { return 2; }
        else if(mass > 1.5) { return 1; }
        else if(mass < 0.2) { return -1; }
        else { return 0; }
    }

    function getMoonDistance(code) {
        var firstRoll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1 });

        if(code == "planet.class.k") { firstRoll.modifier = -1; firstRoll.total--; }
        if(code == "planet.class.g") { firstRoll.modifier = 1; firstRoll.total++; }

        if(firstRoll.total <= 2) {
            return {
                name: "Close Orbit",
                code: "orbit.close",
                value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 1 }).total
            }
        }
        else if(firstRoll.total <= 4) {
            return {
                name: "Medium Orbit",
                code: "orbit.medium",
                value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 3 }).total
            }
        }
        else {
            return {
                name: "Distant Orbit",
                code: "orbit.distant",
                value: (((rollHelper.roll({ rollFunction: localChance.d6, iterations: 1 }).total) + 1) * 10) + localChance.integer({min: -9, max: 9})
            }
        }
    }

    // Return Methods and Values
    return {
        rollMoon: rollMoon
    };
})();
