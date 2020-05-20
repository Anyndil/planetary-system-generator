/*
 * Template Table and Functions
 */

window.planetarySystemStats = (function () {
    function getStats(planetarySystem) {
        var stats = {
            starCount: planetarySystem.stars.length,
            planetCount: 0,
            moonCount: 0,
            life: [],
            lifeCount: 0,
            sentientCount: 0,
            resourceRich: [],
            resourceRichCount: 0,
            starGroups: planetarySystem.starGroup.length,
            planets: [],
            moons: []
        }

        // Get Details
        planetarySystem.stars.forEach(function(star) {
            star.planets.forEach(function(planet) {
                getStatsPlanetFn(stats, planet);
            });
        });

        planetarySystem.starGroup.forEach(function(group) {
            group.planets.forEach(function(planet) {
                getStatsPlanetFn(stats, planet);
            });
        });

        // Get Planet Count
        stats.planetCount = 0;

        stats.planets.forEach(function(planetClass) {
            stats.planetCount += planetClass.total;
        });

        // Get Moon Count
        stats.moonCount = 0;

        stats.moons.forEach(function(moonClass) {
            stats.moonCount += moonClass.total;
        });

        // Sort
        stats.planets.sort((a, b) => (a.name > b.name) ? 1 : -1);
        stats.moons.sort((a, b) => (a.name > b.name) ? 1 : -1);

        // UI Class
        getStatsUiClass(stats);

        return stats;
    }

    function getStatsPlanetFn(stats, planet) {
        var planetStat = stats.planets.find(element => element.code == planet.code);

        if(typeof planetStat == "undefined") {
            stats.planets.push({
                name: (typeof planet.className == "undefined" || planet.className == null) ? planet.classification : planet.className,
                desc: planet.classification,
                code: planet.code,
                total: 1
            });
        }
        else { planetStat.total++; }

        // Check for life
        getLifeStats(stats, planet);
        getRichResourceStats(stats, planet);

        // Iterate over Moons
        if(typeof planet.satellites != "undefined") {
            planet.satellites.forEach(function(moon) {
                getStatsMoonFn(stats, moon);
            });
        }
    }

    function getStatsMoonFn(stats, moon) {
        var moonStat = stats.moons.find(element => element.code == moon.code);

        if(typeof moonStat == "undefined") {
            stats.moons.push({
                name: (typeof moon.className == "undefined") ? moon.classification : moon.className,
                desc: moon.classification,
                code: moon.code,
                total: 1
            });
        }
        else { moonStat.total++; }

        // Check for life
        getLifeStats(stats, moon);
        getRichResourceStats(stats, moon);
    }

    function getStatsUiClass(stats) {
        stats.planets.forEach(function(stat) { getStatsUiClassFn(stat); });
        stats.moons.forEach(function(stat) { getStatsUiClassFn(stat); });
    }

    function getStatsUiClassFn(stat) {
        if (stat.code == "planet.class.h") { stat.class = "yellow"; }
        else if (stat.code == "planet.class.l") { stat.class = "yellow"; }
        else if (stat.code == "planet.class.m") { stat.class = "green"; }
        else if (stat.code == "planet.class.o") { stat.class = "green"; }
        else if (stat.code == "planet.class.p") { stat.class = "yellow"; }
        else if (stat.code == "planet.class.q") { stat.class = "yellow"; }
    }

    function getLifeStats(stats, object) {
        if(object.life.code == "life.sentient") { stats.life.push(object); stats.sentientCount++; }
        else if(object.life.code != "life.none") { stats.life.push(object); stats.lifeCount++; }
    }

    function getRichResourceStats(stats, object) {
        if(object.density.code == "density.metalRich") { stats.resourceRich.push(object); stats.resourceRichCount++; }
    }

    // Return Methods and Values
    return {
        getStats: getStats
    };
})();
