/*
 * Planet Generator and Functions
 */

window.planetFunctions = (function () {
    var localChance = new Chance(new Date());

    var settings = {
        orbitRoll: {
            rollFunction: localChance.d6,
            iterations: 2
        },
        inclinationRoll: {
            rollFunction: localChance.d6,
            iterations: 3
        },
        inclinationValueRoll: {
            rollFunction: localChance.d6,
            iterations: 2,
            multiplier: 5
        },
        rocheLimit: 2.44,
        moonMassMaxRatio: 0.25,
        moonMassMultiplier: (1 / 3),
        moonRadiusMaxRatio: 0.25,
        moonRadiusMultiplier: (1 / 3),
        maxIterations: 100
    };

    function getMass(planet, code) {
        var roll = {};
        var mass = 0;

        if(code == "planet.class.a" || code == "planet.class.b" || code == "planet.class.c"
                || code == "planet.class.e") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 3 });
            mass = roll.total * 0.005;
        }
        else if(code == "planet.class.d") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 3 });
            mass = roll.total * 0.0005;
        }
        else if(code == "planet.class.f" || code == "planet.class.g" || code == "planet.class.h"
                || code == "planet.class.k" || code == "planet.class.l" || code == "planet.class.m"
                || code == "planet.class.n" || code == "planet.class.o" || code == "planet.class.p"
                || code == "planet.class.q" || code == "planet.class.r") {
             roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 });
             mass = (roll.total >= 11) ? (roll.total * 0.25) : ((roll.total + 5) * 0.1);
        }
        else if(code == "planet.class.i") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 3 });
            mass = roll.total + 10 + localChance.integer({min: -5, max: 5});
        }
        else if(code == "planet.class.j") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 3 });
            mass = (roll.total * 20) + localChance.integer({min: -10, max: 10});
        }
        else if(code == "planet.class.s") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 });
            mass = ((roll.total - 1) * 300) + localChance.integer({min: -100, max: 100});
        }
        else if(code == "planet.class.u") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 });
            mass = (roll.total >= 11) ? (roll.total * 1500) + localChance.integer({min: -100, max: 100}) : ((localChance.d6() + 2) * 3000) + localChance.integer({min: -1000, max: 1000});
        }
        else if(code == "planet.class.x") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 6 });
            mass = (roll.total >= 12) ? (roll.total * 0.25) : (roll.total * 0.1);
        }
        else if(code == "planet.class.y") {
            roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 2 });
            mass = (roll.total >= 12) ? (roll.total * 0.25) : (roll.total * 0.1);
        }

        // console.log(code + ": " + JSON.stringify(roll));

        return mass;
    }

    function getDensity(code, zone) {
        var roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 });
        var density = "";

        if((zone == "blue" || zone == "black")
                && (code == "planet.class.a" || code == "planet.class.b"
                    || code == "planet.class.c" || code == "planet.class.d"
                    || code == "planet.class.e")) {
            if(roll.total <= 7) { density = { name: "Ice", code: "density.ice", value: 0.2 }; }
            else if(roll.total <= 11) { density = { name: "Ice-Rock", code: "density.iceRock", value: 0.5 }; }
            else { density = { name: "Silica", code: "density.silica", value: 0.66 }; }
        }
        else if(code == "planet.class.a" || code == "planet.class.b" || code == "planet.class.c"
                || code == "planet.class.d" || code == "planet.class.e") {
            if(roll.total <= 7) { density = { name: "Silica", code: "density.silica", value: 0.66 }; }
            else if(roll.total <= 10) { density = { name: "Earth-Like", code: "density.earthLike", value: 1.0 }; }
            else { density = { name: "Metal-Rich", code: "density.metalRich", value: 1.5 }; }
        }
        else if((zone == "blue" || zone == "black")
                && (code == "planet.asteroidBelt" || code == "planet.class.f" || code == "planet.class.g"
                    || code == "planet.class.k" || code == "planet.class.l" || code == "planet.class.p"
                    || code == "planet.class.q" || code == "planet.class.r")) {
            if(roll.total <= 4) { density = { name: "Ice-Rock", code: "density.iceRock", value: 0.5 }; }
            else if(roll.total <= 6) { density = { name: "Silica", code: "density.silica", value: 0.66 }; }
            else if(roll.total <= 11) { density = { name: "Earth-Like", code: "density.earthLike", value: 1.0 }; }
            else { density = { name: "Metal-Rich", code: "density.metalRich", value: 1.5 }; }
        }
        else if(code == "planet.class.f" || code == "planet.class.g" || code == "planet.class.h"
                || code == "planet.class.k" || code == "planet.class.l" || code == "planet.class.m"
                || code == "planet.class.n" || code == "planet.class.o" || code == "planet.class.p"
                || code == "planet.class.q" || code == "planet.class.r" || code == "planet.asteroidBelt") {
            if(roll.total <= 3) { density = { name: "Silica", code: "density.silica", value: 0.66 }; }
            else if(roll.total <= 10) { density = { name: "Earth-Like", code: "density.earthLike", value: 1.0 }; }
            else { density = { name: "Metal-Rich", code: "density.metalRich", value: 1.5 }; }
        }
        else if(code == "planet.class.i" || code == "planet.class.j" || code == "planet.class.s"
                || code == "planet.class.u") {
            if(roll.total <= 6) { density = { name: "Hydrogen", code: "density.hydrogen", value: 0.2 }; }
            else { density = { name: "Gas", code: "density.gas", value: 0.3 }; }
        }
        else if(code == "planet.class.x") {
            density = { name: "Metal-Rich", code: "density.metalRich", value: 1.5 };
        }
        else if(code == "planet.class.y") {
            if(roll.total <= 8) { density = { name: "Earth-Like", code: "density.earthLike", value: 1.0 }; }
            else { density = { name: "Metal-Rich", code: "density.metalRich", value: 1.5 }; }
        }

        return density;
    }

    function getOrbit(roll) {
        if(roll.total >= 12) {
            return {
                type: "Eccentric, Highly-Elliptical",
                code: "orbit.Eccentric",
                multiplier: 1 + (localChance.d6() * 0.1)
            };
        }
        else {
            return {
                type: "Standard",
                code: "orbit.standard",
                multiplier: 1
            };
        }
    }

    function getInclination(roll) {
        if(roll.total >= 18) {
            var inclination = rollHelper.roll(settings.inclinationValueRoll)

            return {
                type: "Highly Inclined",
                code: "inclination.standard",
                value: inclination.total
            };
        }
        else {
            return {
                type: "Standard",
                code: "inclination.standard"
            };
        }
    }

    function getAtmosphere(planet) {
        var modifier = 0;
        var atmosphere = {
            name: "None",
            code: "atmosphere.none",
            density: 0
        };

        // Add Gravity Modifiers
        if(planet.gravity < 0.5) { modifier = -2; }
        else if(planet.gravity < 0.8) { modifier = -1; }
        else if(planet.gravity > 1.2) { modifier = 1; }

        // Zone Modifiers
        if(planet.zone == "black") { modifier += 1; }

        // Rotation Modifiers
        if(planet.dayLength == 0) { modifier += -2; }

        // Roll
        var roll = rollHelper.roll({ rollFunction: chance.d6, iterations: 1, modifier: modifier, minRoll: 1, maxRoll: 6 });

        if(planet.atmosphere == 0) {  }
        else if(planet.code == "planet.class.a" || planet.code == "planet.class.e" || planet.code == "planet.class.f"
                || planet.code == "planet.class.g" || planet.code == "planet.class.h") {
            if(roll.total <= 3) { atmosphere = getAtmosphereTrace(); }
            else if(roll.total <= 5) { atmosphere = getAtmosphereThin(); }
            else { atmosphere = getAtmosphereStandard(); }
        }
        else if(planet.code == "planet.class.k" || planet.code == "planet.class.l" || planet.code == "planet.class.m"
                || planet.code == "planet.class.n" || planet.code == "planet.class.o" || planet.code == "planet.class.p"
                || planet.code == "planet.class.r") {
            if(roll.total <= 2) { atmosphere = getAtmosphereThin(); }
            else if(roll.total <= 4) { atmosphere = getAtmosphereStandard(); }
            else { atmosphere = getAtmosphereThick(); }
        }
        else if(planet.code == "planet.class.n") {
            if(roll.total <= 3) { atmosphere = getAtmosphereThick(); }
            else { atmosphere = getAtmosphereDense(); }
        }
        else if(planet.code == "planet.class.i" || planet.code == "planet.class.j" || planet.code == "planet.class.s"
                || planet.code == "planet.class.t" || planet.code == "planet.class.u" || planet.code == "planet.class.y") {
            atmosphere = getAtmosphereSuperdense();
        }

        return atmosphere;
    }

    function getAtmosphereTrace() { return { name: "Trace", code: "atmosphere.trace", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 }).total / 100) }; }
    function getAtmosphereThin() { return { name: "Thin", code: "atmosphere.thin", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 5, modifier: 50 }).total / 100) }; }
    function getAtmosphereStandard() { return { name: "Standard", code: "atmosphere.standard", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: 6, multiplier: 10 }).total / 100) }; }
    function getAtmosphereThick() { return { name: "Thick", code: "atmosphere.thick", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 5, modifier: 120 }).total / 100) }; }
    function getAtmosphereDense() { return { name: "Dense", code: "atmosphere.dense", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 3, multiplier: 50 }).total / 100) }; }
    function getAtmosphereSuperdense() { return { name: "Superdense", code: "atmosphere.superdense", density: (rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, multiplier: 100 }).total / 100) }; }

    function getHydrosphere(planet) {
        var hydrosphere = {};

        if(planet.code == "planet.class.g" || planet.code == "planet.class.l") {
            var dice = resultHelper.clone(planetaryHydrosphere.settings.dice);
            dice.rollFunction = localChance.d6;
            dice.modifier = -5;

            var hydrosphereRoll = planetaryHydrosphere.roll(dice);
            hydrosphere = hydrosphereRoll.planetaryHydrosphere;
        }
        else if(planet.code == "planet.class.h" || planet.code == "planet.class.f") {
            hydrosphere = { name: (localChance.d20() + "%") };
        }
        else if(planet.code == "planet.class.m" || planet.code == "planet.class.p"
                || planet.code == "planet.class.q" || planet.code == "planet.class.r") {
            var dice = resultHelper.clone(planetaryHydrosphere.settings.dice);
            dice.rollFunction = localChance.d6;
            dice.maxRoll = 9;

            var hydrosphereRoll = planetaryHydrosphere.roll(dice);
            hydrosphere = hydrosphereRoll.planetaryHydrosphere;
        }
        else if(planet.code == "planet.class.o") {
            var dice = resultHelper.clone(planetaryHydrosphere.settings.dice);
            dice.rollFunction = localChance.d6;
            dice.minRoll = 10;

            var hydrosphereRoll = planetaryHydrosphere.roll(dice);
            hydrosphere = hydrosphereRoll.planetaryHydrosphere;
        }
        else if((planet.zone == "blue" || planet.zone == "black") && planet.code != "planet.class.i" && planet.code != "planet.class.j"
                && planet.code != "planet.class.s" && planet.code != "planet.class.u"
                && typeof planet.atmosphericComposition.components != "undefined" && planet.atmosphericComposition.components.length > 0
                && typeof planet.atmosphericComposition.components.find(element => element.name == "Ammonia") != "undefined"
                && typeof planet.atmosphericComposition.components.find(element => element.name == "Methane") != "undefined") {
            var ammonia = planet.atmosphericComposition.components.find(element => element.name == "Ammonia");
            var methane = planet.atmosphericComposition.components.find(element => element.name == "Methane");

            if(typeof ammonia != "undefined") {
                hydrosphere = { name: ammonia.value + "% " + ammonia.name };
            }

            if(typeof methane != "undefined") {
                if(typeof hydrosphere.name != "undefined") {
                    hydrosphere.name += ", " + methane.value + "% " + methane.name;
                }
                else {
                    hydrosphere = { name: methane.value + "% " + methane.name };
                }
            }
        }
        else {
            hydrosphere = { name: "N/A", code: "hyrdo.na" };
        }

        return hydrosphere;
    }

    function getWeatherPaterns(planet) {
        if(planet.atmosphere.code == "atmosphere.none") { return "N/A"; }
        else if(planet.axialTilt.code == "tilt.extreme" || planet.code == "planet.class.y") { return "Extreme"; }
        else if(planet.axialTilt.code == "tilt.high") { return "Turbulent"; }
        else if(planet.axialTilt.code == "tilt.moderate") { return "Mild"; }
        else { return "Arid"; }
    }

    function getTemperature(planet, zone) {
        var temperature = { value: 0 };

        if(planet.code == "planet.class.a" || planet.code == "planet.class.e") {
            temperature.value = 400;
        }
        else if(planet.code == "planet.class.n") {
            temperature.value = 500;
        }
        else if(planet.code == "planet.class.y") {
            temperature.value = 600;
        }

        if(planet.code == "planet.class.f" || planet.code == "planet.class.g"
                || planet.code == "planet.class.k" || planet.code == "planet.class.q"
                || planet.code == "planet.class.r") {
            var temperatureRoll = planetaryTemperature.roll();
            temperature = temperatureRoll.planetaryTemperature;
        }
        else if(planet.code == "planet.class.h" || planet.code == "planet.class.l"
                || planet.code == "planet.class.m" || planet.code == "planet.class.o") {
            var dice = resultHelper.clone(planetaryTemperature.settings.dice);
            dice.rollFunction = localChance.d6;
            dice.minRoll = 2;
            dice.maxRoll = 12;

            var temperatureRoll = planetaryTemperature.roll(dice);
            temperature = temperatureRoll.planetaryTemperature;
        }
        else if(planet.code == "planet.class.p") {
            var dice = resultHelper.clone(planetaryTemperature.settings.dice);
            dice.rollFunction = localChance.d6;
            dice.minRoll = 0;
            dice.maxRoll = 6;

            var temperatureRoll = planetaryTemperature.roll(dice);
            temperature = temperatureRoll.planetaryTemperature;
        }
        else {
            // Zone Heat
            if(zone == "red") { temperature.value += 623.15; }
            else if(zone == "yellow") { temperature.value += 473.15; }
            else if(zone == "green") { temperature.value += 283.15; }
            else if(zone == "blue") { temperature.value += 173.15; }
            else if(zone == "black") { temperature.value += 73.15; }

            temperature.value = stellarCalculator.addVariability(temperature.value);
        }

        temperature.kelvin = temperature.value;
        temperature.fahrenheit = stellarCalculator.kToF(temperature.value);
        temperature.celsius = stellarCalculator.kToC(temperature.value);

        return temperature;
    }

    function getAtmosphericComposition(planet) {
        var composition = {
            components: [],
            total: 0
        };

        // Check for No Atmosphere
        if(planet.atmosphere.code == "atmosphere.none" || planet.code == "planet.class.d") { return composition; }
        else if(planet.code == "planet.class.i" || planet.code == "planet.class.j"
                || planet.code == "planet.class.s" || planet.code == "planet.class.u") {
            composition.components.push({ name: "Hydrogen", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 3, modifier: 70 }).total });
            composition.components.push({ name: "Helium", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 10 }).total });
        }
        else if(planet.code == "planet.class.l") {
            composition.components.push({ name: "Argon", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 3, modifier: 65 }).total });
            composition.components.push({ name: "Oxygen", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 15 }).total });
        }
        else if(planet.code == "planet.class.h" || planet.code == "planet.class.m" || planet.code == "planet.class.o"
                || planet.code == "planet.class.p") {
            composition.components.push({ name: "Nitrogen", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 65 }).total });
            composition.components.push({ name: "Oxygen", value: rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 15 }).total });
        }
        else {
            var majorComponents = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: -2, minRoll: 1 });

            for(var i=0; i<majorComponents.total; i++) {
                var component = getAtmosphericCompositionFn(planet, composition, planet.zone);

                // Duplicate Check
                var i = 0;
                while(typeof composition.components.find(element => element.name == component.name) != "undefined" && i < settings.maxIterations) { component = getAtmosphericCompositionFn(planet, composition, planet.zone); i++; }

                if(i == 0) { component.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1, modifier: 1, multiplier: 10 }).total; }
                else if(i == 1) { component.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: 10 }).total; }
                else if(i == 2) { component.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 }).total; }
                else if(i == 3) { component.value = rollHelper.roll({ rollFunction: localChance.d6, iterations: 1 }).total; }

                composition.components.push(component);
            }
        }

        // Get total
        composition.components.forEach(function(element) { composition.total += element.value; });

        // Fill Remaining Composition
        while(composition.total < 100) {
            var component = { name: getTraceElement(), value: localChance.d6() };

            if((composition.total + component.value) > 100) { component.value = (100 - composition.total); }

            if(component.name == "Chlorine" && planet.code == "planet.class.h") { continue; }
            else if(component.name == "Chlorine" && planet.code == "planet.class.l") { continue; }
            else if(component.name == "Chlorine" && planet.code == "planet.class.m") { continue; }
            else if(component.name == "Chlorine" && planet.code == "planet.class.o") { continue; }
            else if(component.name == "Chlorine" && planet.code == "planet.class.p") { continue; }
            else if(component.name == "Fluorine" && planet.code == "planet.class.h") { continue; }
            else if(component.name == "Fluorine" && planet.code == "planet.class.l") { continue; }
            else if(component.name == "Fluorine" && planet.code == "planet.class.m") { continue; }
            else if(component.name == "Fluorine" && planet.code == "planet.class.o") { continue; }
            else if(component.name == "Fluorine" && planet.code == "planet.class.p") { continue; }
            else if(component.name == "Ammonia" && planet.zone == "yellow") { continue; }
            else if(component.name == "Ammonia" && planet.code == "planet.class.h") { continue; }
            else if(component.name == "Ammonia" && planet.code == "planet.class.l") { continue; }
            else if(component.name == "Ammonia" && planet.code == "planet.class.m") { continue; }
            else if(component.name == "Ammonia" && planet.code == "planet.class.o") { continue; }
            else if(component.name == "Ammonia" && planet.code == "planet.class.p") { continue; }
            else if(component.name == "Sulfur Dioxide" && planet.code == "planet.class.h") { continue; }
            else if(component.name == "Sulfur Dioxide" && planet.code == "planet.class.l") { continue; }
            else if(component.name == "Sulfur Dioxide" && planet.code == "planet.class.m") { continue; }
            else if(component.name == "Sulfur Dioxide" && planet.code == "planet.class.o") { continue; }
            else if(component.name == "Sulfur Dioxide" && planet.code == "planet.class.p") { continue; }
            else if(component.name == "Methane" && planet.zone == "yellow") { continue; }
            else if(component.name == "Methane" && planet.code == "planet.class.h") { continue; }
            else if(component.name == "Methane" && planet.code == "planet.class.l") { continue; }
            else if(component.name == "Methane" && planet.code == "planet.class.m") { continue; }
            else if(component.name == "Methane" && planet.code == "planet.class.o") { continue; }
            else if(component.name == "Methane" && planet.code == "planet.class.p") { continue; }
            else if(component.name == "Water Vapor" && planet.zone == "blue") { continue; }
            else if(component.name == "Water Vapor" && planet.zone == "black") { continue; }
            else {
                var existingComponent = composition.components.find(element => element.name == component.name)

                if(typeof existingComponent != "undefined") { existingComponent.value += component.value; }
                else { composition.components.push(component); }

                composition.total += component.value;
            }
        }

        if(composition.total > 100) {
            composition.components[composition.components.length - 1].value += (100 - composition.total);
            composition.total = 100;
        }

        // Sort
        composition.components.sort((a, b) => (a.value > b.value) ? -1 : 1);

        return composition;
    }

    function getAtmosphericCompositionFn(planet, composition, zone) {
        var component = {};
        var modifier = 0;

        // Modifiers
        if(planet.mass < 0.2) { modifier += -1; }
        if(planet.mass > 2) { modifier += 1; }

        // Roll
        var roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: modifier });

        // Deterine Components
        if(zone == "black" || planet.code == "planet.class.e") {
            if(roll.total <= 9) { component.name = "Hydrogen"; }
            else { component.name = "Helium"; }
        }
        else if(planet.code == "planet.class.a" || planet.code == "planet.class.f" || planet.code == "planet.class.g") {
            if(roll.total <= 4) { component.name = "Carbon Dioxide"; }
            else if(roll.total <= 5) { component.name = "Argon"; }
            else if(roll.total <= 7) { component.name = "Nitrogen"; }
            else if(roll.total <= 9) { component.name = "Methane"; }
            else { component.name = "Ammonia"; }
        }
        else if(zone == "yellow" && (planet.code == "planet.class.k" || planet.code == "planet.class.q"
                || planet.code == "planet.class.r")) {
            if(roll.total <= 3) { component.name = "Nitrogen"; }
            else if(roll.total <= 7) { component.name = "Carbon Dioxide"; }
            else if(roll.total <= 9) { component.name = "Sulfur Dioxide"; }
            else if(roll.total <= 10) { component.name = "Argon"; }
            else if(roll.total <= 11) { component.name = "Fluorine"; }
            else { component.name = "Chlorine"; }
        }
        else if(planet.code == "planet.class.k" || planet.code == "planet.class.q" || planet.code == "planet.class.r") {
            if(roll.total <= 3) { component.name = "Nitrogen"; }
            else if(roll.total <= 4) { component.name = "Argon"; }
            else if(roll.total <= 7) { component.name = "Carbon Dioxide"; }
            else if(roll.total <= 8) { component.name = "Sulfur Dioxide"; }
            else if(roll.total <= 9) { component.name = "Fluorine"; }
            else if(roll.total <= 10) { component.name = "Chlorine"; }
            else if(roll.total <= 11) { component.name = "Methane"; }
            else { component.name = "Ammonia"; }
        }
        else if(planet.code == "planet.class.n" || planet.code == "planet.class.y") {
            if(roll.total <= 4) { component.name = "Carbon Dioxide"; }
            else if(roll.total <= 5) { component.name = "Carbon Monoxide"; }
            else if(roll.total <= 7) { component.name = "Nitrogen"; }
            else if(roll.total <= 8) { component.name = "Oxygen"; }
            else if(roll.total <= 9) { component.name = "Sulfur Dioxide"; }
            else if(roll.total <= 11) { component.name = "Fluorine"; }
            else { component.name = "Chlorine"; }
        }

        return component;
    }

    function getTraceElement() {
        var roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2 });

        if(roll.total <= 3) { return "Nitrous Oxide"; }
        else if(roll.total <= 4) { return "Chlorine"; }
        else if(roll.total <= 5) { return "Fluorine"; }
        else if(roll.total <= 6) { return "Ammonia"; }
        else if(roll.total <= 7) { return "Water Vapor"; }
        else if(roll.total <= 8) { return "Carbon Dioxide"; }
        else if(roll.total <= 9) { return "Sulfur Dioxide"; }
        else if(roll.total <= 10) { return "Methane"; }
        else if(roll.total <= 11) { return "Argon"; }
        else if(roll.total <= 12) { return "Neon"; }
    }

    function getTectonicActivity(planet) {
        var modifier = 0;

        // Moon
        if(planet.parent == "moon") { modifier += 2; }

        // Age Modifiers
        if(planet.age > 6) { modifier += -1; }
        else if(planet.age < 2) { modifier += 1; }

        // Diameter Modifiers
        if(planet.diameter < 7000) { modifier += -2; }
        else if(planet.diameter > 16000) {  modifier += 1; }

        // Mass Modifiers
        if(planet.mass < 0.5) { modifier += -1; }

        // Density Modifiers
        if(planet.density.code == "density.silica" || planet.density.code == "density.iceRock" || planet.density.code == "density.ice") { modifier += -3; }
        else if(planet.density.code == "density.metalRich") { modifier += 1; }

        // Zone Modifiers
        if(planet.zone == "red") { modifier += 2; }
        else if(planet.zone == "yellow") { modifier += 1; }

        if(planet.hydrosphere.code == "hyrdo.na") { modifier += -2; }
        else if(planet.hydrosphere.value < 30) { modifier += -1; }

        var roll = rollHelper.roll({ rollFunction: localChance.d6, iterations: 2, modifier: modifier });

        if(roll.total <= 4) { return "Dead"; }
        else if(roll.total <= 5) { return "Hot Spots"; }
        else if(roll.total <= 6) { return "Plastic"; }
        else if(roll.total <= 10) { return "Active"; }
        else { return "Very Active"; }
    }

    function getLife(planet) {
        var life = { name: "None", code: "life.none", order: 0 };
        var rollDef = {
            rollFunction: localChance.d20,
            iterations: 1,
            modifier: 0,
            minRoll: 1,
            maxRoll: 20
        };

        // Disqualify Planets
        if((typeof planet.class != "undefined" && planet.class == "planet.asteroidBelt")
            || (planet.temperature.celsius < -20 || planet.temperature.celsius > 50)
            || (typeof planet.hydrosphere != "undefined" && planet.hydrosphere.code == "hyrdo.na")
            || (typeof planet.atmosphere != "undefined" && planet.atmosphere.code == "atmosphere.none")) { return life; }

        // Modifiers
        if(planet.atmosphere.code == "atmosphere.trace") { rollDef.maxRoll = 12; }
        if(planet.code == "planet.class.k" || planet.code == "planet.class.l") { rollDef.maxRoll = 17; }
        if(planet.code == "planet.class.h" || planet.code == "planet.class.p") { rollDef.modifier += 0; }
        if(planet.code == "planet.class.m" || planet.code == "planet.class.o") { rollDef.minRoll = 5; }

        // Atmospheric Considerations
        if(planet.atmosphere != "atmosphere.none") {
            var oxygen = planet.atmosphericComposition.components.find(element => element.name == "Oxygen");
            var ammonia = planet.atmosphericComposition.components.find(element => element.name == "Ammonia");
            var chlorine = planet.atmosphericComposition.components.find(element => element.name == "Chlorine");
            var fluorine = planet.atmosphericComposition.components.find(element => element.name == "Fluorine");
            var sulfurDioxide = planet.atmosphericComposition.components.find(element => element.name == "Sulfur Dioxide");
            var methane = planet.atmosphericComposition.components.find(element => element.name == "Methane");
            // var carbonDioxide = planet.atmosphericComposition.components.find(element => element.name == "Carbon Dioxide");

            if(typeof ammonia != "undefined" && ammonia.value > 5) { rollDef.maxRoll = 4; }
            else if(typeof chlorine != "undefined" && chlorine.value > 5) { rollDef.maxRoll = 4; }
            else if(typeof fluorine != "undefined" && fluorine.value > 5) { rollDef.maxRoll = 4; }
            else if(typeof methane != "undefined" && methane.value > 5) { rollDef.maxRoll = 4; }
            else if(typeof sulfurDioxide != "undefined" && sulfurDioxide.value > 5) { rollDef.maxRoll = 4; }
            else if(typeof oxygen == "undefined") { rollDef.maxRoll = 10; }
            else if(typeof oxygen != "undefined" && oxygen.value <= 5) { rollDef.maxRoll = 12; }
            else if(typeof oxygen != "undefined" && oxygen.value <= 10) { rollDef.maxRoll = 16; }
        }

        // Roll
        var roll = rollHelper.roll(rollDef);

        if(roll.total <= 4) { return life; }
        else if(roll.total <= 7) { return { name: "Prebiotic Molecules", code: "life.prebiotic", order: 10 }; }
        else if(roll.total <= 10) { return { name: "Unicellular Organisms", code: "life.unicellular", order: 20 }; }
        else if(roll.total <= 12) { return { name: "Algae", code: "life.algae", order: 30 }; }
        else if(roll.total <= 13) { return { name: "Plant Life", code: "life.plant", order: 40 }; }
        else if(roll.total <= 14) { return { name: "Plant Life, Fungi", code: "life.fungi", order: 50 }; }
        else if(roll.total <= 15) { return { name: "Plant Life, Simple Multicellular Organisms", code: "life.multicellular", order: 60 }; }
        else if(roll.total <= 16) { return { name: "Plant Life, Simple Multicellular Organisms, Insects", code: "life.insects", order: 70 }; }
        else if(roll.total <= 17) { return { name: "Plant Life, Insects, Reptiles", code: "life.reptiles", order: 80 }; }
        else if(roll.total <= 18) { return { name: "Plant Life, Insects, Reptiles, Mammals", code: "life.mammals", order: 90 }; }
        else if(roll.total <= 19) { return { name: "Plant Life, Insects, Reptiles, Mammals, Hominids", code: "life.hominids", order: 100 }; }
        else { return { name: "Triving Ecosystem, Sentient Life", code: "life.sentient", order: 200 }; }
    }

    function getResources() {
        // Bakrinium - Very Rare, Possible Hur'q arc
        // Benamite - Used in Slipstream Drive
        // Bilitrium - Power Source
        // Boronite (Rare) - Omega Molecule Synthesis
        // Chrondite (Asteroids) - Durable Metal
        // Cormaline
        // Duranite - Biobeds
        // Eisillium (Rare)
        // Feldomite - Valuable
        // Gallicite (Rare) - Warp Coils
        // Kelbonite - (Common) Transporter Inhibitor
        // Kemocite - Multiphasic isotope, Starship Construction
        // Magnesite - Interferes with Sensors and Transporters
        // Neutronium (Very Rare)
        // Nitrium (Asteroids) - Starship Construction
        // Noranium - Alloys
        // Paralithium - Power
        // Pergium - Power
        // Polyferranide - Warp Cores
        // Ryetalyn (Rare) - Medical Applications
        // Salenite - Mineable
        // Styrolite - Medical Applications
        // Talgonite
        // Topaline (Rare) - Life Support Systems
        // Trellium - Spatial Anomaly Insullation
        // Tricellite - Starship Construction
        // Tricyanate - Toxic
        // Tritanium - Starship Construction
        // Tryoxene (Asteroids)
        // Uraninite
        // Uridium - Starship Construction
        // Vendarite - Valuable

        // Latinum (Rare)
        // Dilithium (Rare)
        // Trillium
        // Duranium
        // Cortenum
        // Fistrium
        // Mizinite
        // Tellerium
        // Borite
        // Celebium
        // Corundium
        // Cyanoacrylate
        // Dentarium
        // Diamide
        // Diburnium
        // Duridium

        // Ores
        // Arcybite
        // Beresium
        // Bernicium
        // Boronite
        // Diamagnetic ore
        // Dilithium (found in both crystal and ore forms)
        // Dolamide
        // Duranium
        // Duridium
        // Golside
        // Inertium
        // Iridium
        // Kemocite
        // Lithium
        // Magnesite
        // Miszinite
        // Starithium
        // Topaline
        // Trellium
        // Trilithium
        // Tritanium
        // Uridium
        // Zeolitic ore
    }

    // Return Methods and Values
    return {
        settings: settings,
        getMass: getMass,
        getDensity: getDensity,
        getOrbit: getOrbit,
        getInclination: getInclination,
        getAtmosphere: getAtmosphere,
        getHydrosphere: getHydrosphere,
        getWeatherPaterns: getWeatherPaterns,
        getTemperature: getTemperature,
        getAtmosphericComposition: getAtmosphericComposition,
        getTectonicActivity: getTectonicActivity,
        getLife: getLife
    };
})();
