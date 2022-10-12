/*
 * Planet Generator and Functions
 */

window.planetGenerator = (function () {
    var localChance = new Chance(new Date());

    // Pull settings from PlanetGenerator
    var settings = planetFunctions.settings;

    var tableParameters = { };

    var table = null;
    var tablePromise = null;

    var redZoneTable = [];
    var yellowZoneTable = [];
    var greenZoneTable = [];
    var blueZoneTable = [];
    var blackZoneTable = [];

    // Generate Table
    function generateTable() {
        if(table == null) {
            tablePromise = tableHelper.getTable("./data/planets.json", tableParameters);

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
            redZoneTable = getRedZoneTable();
            yellowZoneTable = getYellowZoneTable();
            greenZoneTable = getGreenZoneTable();
            blueZoneTable = getBlueZoneTable();
            blackZoneTable = getBlackZoneTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            planetGenerator.table = data;
        });

        return planetGenerator.table;
    }

    function getRedZoneTable() {
        tablePromise.done(function(data){
            data.forEach(function(element) {
                if(element["red_zone"] > 0) {
                    for(var i=0; i<element["red_zone"]; i++) {
                        planetGenerator.redZoneTable.push(element);
                    }
                }
            });
        });

        return planetGenerator.redZoneTable;
    }

    function getYellowZoneTable() {
        tablePromise.done(function(data){
            data.forEach(function(element) {
                if(element["yellow_zone"] > 0) {
                    for(var i=0; i<element["yellow_zone"]; i++) {
                        planetGenerator.yellowZoneTable.push(element);
                    }
                }
            });
        });

        return planetGenerator.yellowZoneTable;
    }

    function getGreenZoneTable() {
        tablePromise.done(function(data){
            data.forEach(function(element) {
                if(element["green_zone"] > 0) {
                    for(var i=0; i<element["green_zone"]; i++) {
                        planetGenerator.greenZoneTable.push(element);
                    }
                }
            });
        });

        return planetGenerator.greenZoneTable;
    }

    function getBlueZoneTable() {
        tablePromise.done(function(data){
            data.forEach(function(element) {
                if(element["blue_zone"] > 0) {
                    for(var i=0; i<element["blue_zone"]; i++) {
                        planetGenerator.blueZoneTable.push(element);
                    }
                }
            });
        });

        return planetGenerator.blueZoneTable;
    }

    function getBlackZoneTable() {
        tablePromise.done(function(data){
            data.forEach(function(element) {
                if(element["black_zone"] > 0) {
                    for(var i=0; i<element["black_zone"]; i++) {
                        planetGenerator.blackZoneTable.push(element);
                    }
                }
            });
        });

        return planetGenerator.blackZoneTable;
    }

    function roll(zone) {
        var planet = null;

        if(typeof zone == "undefined" || zone == "") { return null; }

        if(zone == "red") {
            planet = rollHelper.rollArray(planetGenerator.redZoneTable);
        }
        else if(zone == "yellow") {
            planet = rollHelper.rollArray(planetGenerator.yellowZoneTable);
        }
        else if(zone == "green") {
            planet = rollHelper.rollArray(planetGenerator.greenZoneTable);
        }
        else if(zone == "blue") {
            planet = rollHelper.rollArray(planetGenerator.blueZoneTable);
        }
        else if(zone == "black") {
            planet = rollHelper.rollArray(planetGenerator.blackZoneTable);
        }
        else {
            return null;
        }

        return initializePlanet(planet, zone);
    }

    function initializePlanet(planet, zone) {
        var orbitRollModifier = 0;
        if(zone == "black") {
            orbitRollModifier++;
        }

        // Parent
        planet.result.parent = "star";

        // Orbit
        planet.roll.orbit = rollHelper.roll(settings.orbitRoll);
        planet.roll.orbit.modifier = orbitRollModifier;
        planet.roll.orbit.total = planet.roll.orbit.total + orbitRollModifier
        planet.result.orbit = planetFunctions.getOrbit(planet.roll.orbit);

        // Inclination
        planet.roll.inclination = rollHelper.roll(settings.inclinationRoll);
        planet.result.inclination = planetFunctions.getInclination(planet.roll.inclination);

        // Roll Details
        planet.result.zone = zone;
        planet.result.age = localChance.natural({min: planet.result.age_min, max: planet.result.age_max});
        planet.result.density = planetFunctions.getDensity(planet.result.code, zone);
        planet.result.mass = planetFunctions.getMass(planet, planet.result.code);
        planet.result.planetaryRadius = stellarCalculator.calculateDiameter(planet.result.mass, planet.result.density.value);
        planet.result.radius = stellarCalculator.calculateRadius(planet.result.planetaryRadius);
        planet.result.diameter = planet.result.radius * 2;
        planet.result.gravity = planet.result.planetaryRadius * planet.result.density.value;
        planet.result.dayLength = getDayLength(planet.result);
        planet.result.atmosphere = planetFunctions.getAtmosphere(planet.result);
        planet.result.atmosphericComposition = planetFunctions.getAtmosphericComposition(planet.result);
        planet.result.hydrosphere = planetFunctions.getHydrosphere(planet.result);
        planet.result.temperature = planetFunctions.getTemperature(planet.result, zone);
        planet.result.axialTilt = (planet.result.dayLength == 0) ? { name: "N/A", value: 0} : getAxialTilt();
        planet.result.weather = planetFunctions.getWeatherPaterns(planet.result);
        planet.result.tectonicActivity = planetFunctions.getTectonicActivity(planet.result);
        planet.result.life = planetFunctions.getLife(planet.result);

        // DetermingRetrograde
        if(planet.result.axialTilt.value > 90) {planet.result.axialTilt.value -= 90; planet.result.axialTilt.name = "Retrograde"; }

        // Moon(s)
        planet.result.satellites = moonGenerator.rollMoon(planet.result, zone);

        // Cleanup
        delete planet.result.age_max;
        delete planet.result.age_min;
        delete planet.result.atmosphere_desc;
        delete planet.result.black_zone;
        delete planet.result.blue_zone;
        delete planet.result.green_zone;
        delete planet.result.yellow_zone;
        delete planet.result.red_zone;
        delete planet.result.density_max;
        delete planet.result.density_min;
        delete planet.result.diameter_max;
        delete planet.result.diameter_min;
        delete planet.result.evolution;
        delete planet.result.examples;
        delete planet.result.id;
        delete planet.result.order;
        delete planet.result.surface;

        return planet;
    }

    function getAsteroidBelt(zone) {
        var planet = {
            result: resultHelper.clone(planetGenerator.getTable().find(element => element.code == "planet.asteroidBelt")),
            roll: {
                inclination: {
                    total: 10
                }
            }
        };

        return initializePlanet(planet, zone);
    }

    function getDayLength(planet) {
        var mass = planet.mass;
        var dayLength = {};

        if(mass < 0.1) { dayLength.total = 0; }
        else if (mass < 0.5) {
            dayLength = rollHelper.roll({ rollFunction: localChance.d20, iterations: 4 });
            if(dayLength > 52) { dayLength.total = 0; }
        }
        else if (mass < 5) {
            dayLength = rollHelper.roll({ rollFunction: localChance.d12, iterations: 4 });
            if(dayLength > 38) { dayLength.total = 0; }
        }
        else if (mass < 50) { dayLength = rollHelper.roll({ rollFunction: localChance.d10, iterations: 4 }); }
        else { dayLength = rollHelper.roll({ rollFunction: localChance.d8, iterations: 4 }); }

        return dayLength.total;
    }

    function getAxialTilt() {
        var tilt = {};
        var roll = localChance.d6();

        if(roll <= 2) { tilt.name = "Minimal"; tilt.code = "tilt.minimal"; tilt.value = localChance.d10(); }
        else if(roll <= 4) { tilt.name = "Moderate"; tilt.code = "tilt.moderate"; tilt.value = rollHelper.roll({ rollFunction: localChance.d10, iterations: 2, modifier: 9 }).total; }
        else if(roll <= 5) { tilt.name = "High"; tilt.code = "tilt.high"; tilt.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 19 }).total; }
        else if(roll <= 6) { tilt.name = "Extreme"; tilt.code = "tilt.extreme"; tilt.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, multiplier: 10 }).total + localChance.integer({min: -10, max: 10}); }

        return tilt;
    }

    // Return Methods and Values
    return {
        settings: settings,
        generateTable: generateTable,
        getTable: getTable,
        getAsteroidBelt: getAsteroidBelt,
        table: table,
        redZoneTable: redZoneTable,
        yellowZoneTable: yellowZoneTable,
        greenZoneTable: greenZoneTable,
        blueZoneTable: blueZoneTable,
        blackZoneTable: blackZoneTable,
        roll: roll
    };
})();
