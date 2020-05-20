// Table Helper
window.stellarCalculator = (function () {
    var localChance = new Chance(new Date());

    // Constants
    var constants = {
        auRadius: 149600000000,                   // Orbital Radius of 1au
        smGav: 1.32712440018 * Math.pow(10,20),   // Gravitational Parameter for 1 solar mass
        emGrav: 3.986004418 * Math.pow(10,14),    // Gravitational Parameter for 1 planetart (earth) mass
        eRadius: 6378,                            // Radius of Earth km
        smDivisor: 60 * 60 * 24 * 365,
        emDivisor: 0.401668092520118
    };

    // Return Orbial Period in Years
    function calculateOrbitalPeriod(solarMass, auRadius) {
        var r = auRadius * constants.auRadius;
        var gm = solarMass * constants.smGav;

        var r3 = Math.pow(r, 3);
        var op = Math.sqrt(4 * (Math.pow((Math.PI), 2) * r3 ) / gm);
        var nw = op / constants.smDivisor;

        return nw;
    }

    // Return Orbial Period in Days
    function calculateLunarOrbitalPeriod(planetMass, orbitalRadius) {
        var r = orbitalRadius; // km
        var gm = planetMass * constants.emGrav;

        var r3 = Math.pow(r, 3);
        var op = Math.sqrt(4 * (Math.pow((Math.PI), 2) * r3 ) / gm);
        var nw = op * constants.emDivisor;

        return nw;
    }

    function calculateRadius(radius) {
        return radius * constants.eRadius;
    }

    function calculatePlanetaryRadius(radiusKm) {
        return radiusKm / constants.eRadius;
    }

    function calculateDiameter(mass, density) {
        return Math.cbrt(mass / density);
    }

    function calculateMaxPlanetaryDistance(separation, multiplier) {
        return (separation / 2) * multiplier;
    }

    function addVariability(num) {
        if(Math.abs(num) < 10) { return num; }
        else if(Math.abs(num) < 100) { return num + localChance.integer({ min: -10, max: 10 }); }
        else if(Math.abs(num) < 1000) { return num + localChance.integer({ min: -100, max: 100 }); }
        else if(Math.abs(num) < 10000) { return num + localChance.integer({ min: -1000, max: 1000 }); }
        else if(Math.abs(num) < 100000) { return num + localChance.integer({ min: -10000, max: 10000 }); }
        else if(Math.abs(num) < 1000000) { return num + localChance.integer({ min: -100000, max: 100000 }); }
        else if(Math.abs(num) < 10000000) { return num + localChance.integer({ min: -1000000, max: 1000000 }); }
    }

    function cToK(value) { return (value + 273.15) < 0 ? 0 : (value + 273.15); }
    function kToC(value) { return value - 273.15; }
    function kToF(value) { return ((value - 273.15) * (9/5)) + 32; }
    function fToK(value) { return (((value - 32) * (5/9)) + 273.15) < 0 ? 0 : ((value - 32) * (5/9)) + 273.15; }
    function fToC(value) { return (value - 32) * (5/9); }

    // stellarCalculator.
    return {
        calculateOrbitalPeriod: calculateOrbitalPeriod,
        calculateLunarOrbitalPeriod: calculateLunarOrbitalPeriod,
        calculateRadius: calculateRadius,
        calculatePlanetaryRadius: calculatePlanetaryRadius,
        calculateDiameter: calculateDiameter,
        calculateMaxPlanetaryDistance: calculateMaxPlanetaryDistance,
        addVariability: addVariability,
        cToK: cToK,
        fToK: fToK,
        fToC: fToC,
        kToC: kToC,
        kToF: kToF
    };
})();
