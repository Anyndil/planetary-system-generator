/*
 * Template Table and Functions
 */

window.planetarySystemGenerator = (function () {
    var localChance = new Chance(new Date());

    var settings = {
        oortCloudRoll: {
            rollFunction: localChance.d6,
            iterations: 2,
            minRoll: 2,
            maxRoll: 12
        }
    };

    var result = {
        rolls: {
            stellarClassification: [],
            stellarOrbitalSeparation: [],
            stellarType: [],
            stellarClass: []
        },
        stellarClassification: [],
        stellarOrbitalSeparation: [],
        stellarType: [],
        stellarClass: []
    };

    var planetarySystem = {
        name: null,
        type: null,
        stars: [],
        starGroup: [],
        settings: {
            minPlanetaryDistanceMultiplier: 1.1,
            maxPlanetaryDistanceMultiplier: 0.9,
            curPlanetMultiplier: 0.75
        }
    };

    var imagePath = {
        "planet.class.a": "./image/planets/class-a/",
        "planet.class.b": "./image/planets/class-b/",
        "planet.class.c": "./image/planets/class-c/",
        "planet.class.d": "./image/planets/class-d/",
        "planet.class.e": "./image/planets/class-e/",
        "planet.class.f": "./image/planets/class-f/",
        "planet.class.g": "./image/planets/class-g/",
        "planet.class.h": "./image/planets/class-h/",
        "planet.class.i": "./image/planets/class-i/",
        "planet.class.j": "./image/planets/class-j/",
        "planet.class.k": "./image/planets/class-k/",
        "planet.class.l": "./image/planets/class-l/",
        "planet.class.m": "./image/planets/class-m/",
        "planet.class.n": "./image/planets/class-n/",
        "planet.class.o": "./image/planets/class-o/",
        "planet.class.p": "./image/planets/class-p/",
        "planet.class.q": "./image/planets/class-q/",
        "planet.class.r": "./image/planets/class-r/",
        "planet.class.s": "./image/planets/class-s/",
        "planet.class.t": "./image/planets/class-t/",
        "planet.class.u": "./image/planets/class-u/",
        "planet.class.x": "./image/planets/class-x/",
        "planet.class.y": "./image/planets/class-y/"
    };

    var images = {
        "planet.class.a": ["ClassA_Io.png", "ClassA_PlanetRender.png", "ClassA3.png", "ClassA4.png", "ClassAPlanet_Io.png", "RClassA1.png", "RClassA2.png", "RClassA3.png"],
        "planet.class.b": ["ClassB17.png", "ClassB17d.png", "ClassB17e.png", "RClassB1.png"],
        "planet.class.c": ["ClassC8.png", "ClassC9.png", "ClassC10.png", "ClassC17.png", "ClassC17a.png", "ClassC17b.png", "ClassC17c.png", "ClassC17d.png", "RClassC1.png", "RClassC2.png", "RClassC4.png"],
        "planet.class.d": ["ClassD_02.png", "ClassD_03.png", "ClassD_Pluto.png", "RClassD1.png", "RClassD2.png", "RClassD3.png", "RClassD4.png", "RClassD5.png"],
        "planet.class.e": ["ClassE_01.png", "E_Class02.png", "E_Class03.png", "RClassE1.png"],
        "planet.class.f": ["ClassF_01.png", "ClassF_02.png", "ClassF_02b.png", "ClassF_03.png", "RClassF1.png"],
        "planet.class.g": ["ClassG_01.png", "ClassG_02.png", "ClassG_03.png", "ClassG_04.png", "RClassG1.png"],
        "planet.class.h": ["ClassH_01.png", "ClassH_02.png", "ClassH_03.png", "ClassH_04.png", "ClassH_05.png", "ClassH_06.png", "RClassH1.png", "RClassH2.png", "RClassH3.png"],
        "planet.class.i": ["ClassI_01.png", "ClassI_02.png", "ClassI_03.png", "ClassI_04.png", "ClassI_05.png", "ClassI_06.png", "RClassI1.png"],
        "planet.class.j": ["ClassJ_01.png", "ClassJ_02.png", "ClassJ_03.png", "ClassJ_04.png", "ClassJ_05.png", "RClassJ1.png", "RClassJ2.png"],
        "planet.class.k": ["ClassK_01.png", "ClassK_02.png", "ClassK_03.png", "ClassK_04.png", "ClassK_05.png", "ClassK_06.png", "RClassK1.png", "RClassK2.png"],
        "planet.class.l": ["ClassL_01.png", "ClassL_02.png", "ClassL_03.png", "ClassL_04.png", "ClassL_05.png", "ClassL_06.png", "ClassL_07.png", "ClassL_08.png", "ClassL_09.png", "ClassL_10.png", "RClassL1.png", "RClassL2.png"],
        "planet.class.m": ["ClassM_01.png", "ClassM_02.png", "ClassM_03.png", "ClassM_04_Romulus.png", "ClassM_05.png", "ClassM_06.png", "ClassM_07.png", "ClassM_08.png", "ClassM_09_Cardassia.png", "RClassM1.png", "RClassM2.png", "RClassM3.png", "RClassM5.png", "RClassM6.png"],
        "planet.class.n": ["ClassN_02.png", "ClassN_03.png", "ClassN_04.png", "ClassN_Titan.png", "RClassN1.png", "RClassN2.png"],
        "planet.class.o": ["ClassO_01.png", "ClassO_02.png", "ClassO_03.png", "ClassO_04.png", "ClassO_05.png", "RClassO1.png", "RClassO2.png"],
        "planet.class.p": ["ClassP_01.png", "ClassP_02.png", "ClassP_03.png", "ClassP_04.png", "ClassP_05.png", "ClassP_06.png", "ClassP_07.png", "ClassP_08.png", "RClassP1.png", "RClassP2.png"],
        "planet.class.q": ["ClassQ_02.png", "ClassQ_03.png", "ClassQ_04.png", "ClassQ_05.png", "ClassQ_06.png", "RClassQ1.png"],
        "planet.class.r": ["ClassR_01.png", "ClassR_02.png", "ClassR_03.png", "ClassR_04.png", "ClassR_05.png", "RClassR1.png"],
        "planet.class.s": ["ClassS_01.png", "ClassS_03.png", "ClassS_04.png", "ClassS_05.png", "RClassS1.png"],
        "planet.class.t": [],
        "planet.class.u": ["ClassU_01.png", "ClassU_02.png", "ClassU_03.png", "ClassU_04.png", "ClassU_05.png"],
        "planet.class.x": ["ClassX_01.png", "ClassX_02.png", "ClassX_03.png", "ClassX_04.png", "RClassX1.png", "RClassX2.png"],
        "planet.class.y": ["ClassY_01.png", "ClassY_02.png", "ClassY_03.png", "ClassY_04.png", "RClassY1.png"]
    };

    function loadResources() {
        // System Name
        systemName.generatePrefixTable();
        systemName.generateSuffixTable();

        // Star System Type
        starSystem.generateTable();

        // Orbital Separation
        stellarOrbitalSeparation.generateTable();

        // Stellar Classification
        stellarClassification.generateTable();
        spectralClass.generateTable();
        stellarGiantType.generateTable();

        // Planet Generation
        planetGenerator.generateTable();

        // Planetary Atmosphere
        planetaryAtmosphereLow.generateTable();
        planetaryAtmosphereStandard.generateTable();
        planetaryAtmosphereHigh.generateTable();

        // Planetary Hydrosphere
        planetaryHydrosphere.generateTable();

        // Planetary Temperature
        planetaryTemperature.generateTable();

        // Spectral Class Info
        loadStarInfo();
        loadStarTypeInfo("a");
        loadStarTypeInfo("b");
        loadStarTypeInfo("d");
        loadStarTypeInfo("f");
        loadStarTypeInfo("g");
        loadStarTypeInfo("k");
        loadStarTypeInfo("m");
        loadStarTypeInfo("o");
    }

    function loadStarTypeInfo(classCode) {
        jQuery.ajax({
            url: "./data/star-classes/star-classes-" + classCode + ".json",
            type: "GET",
            dataType: "json",
            success: function(data, textStatus, jqXHR){
                starTypeInfo[classCode] = data;
            }
        });
    }

    function loadStarInfo() {
        jQuery.ajax({
            url: "./data/stars.json",
            type: "GET",
            dataType: "json",
            success: function(data, textStatus, jqXHR){
                starInfo = data;
            }
        });
    }

    function generateSystem(event) {
        generateSystemName();

        // generateSystemAffiliation();
        generateSystemType();

        generateStars();

        generatePlanetarySystems();

        generateAsteroidBelts();
        generatePlanetNames();

        planetarySystem.stats = planetarySystemStats.getStats(planetarySystem);

        return planetarySystem;
    }

    function generateSystemName() {
        var tempResult = systemName.roll();

        result.systemName = tempResult.systemName;
        result.rolls.systemNamePrefix = tempResult.rolls.systemNamePrefix;
        result.rolls.systemNameSuffix = tempResult.rolls.systemNameSuffix;

        planetarySystem.name = tempResult.systemName.name;

        // jQuery("li.system-name div.result").empty().append(result.systemName.name);
    }

    function generateSystemAffiliation() {
        var tempResult = systemName.roll();



        // jQuery("li.system-name div.result").empty().append(result.systemName.name);
    }

    function generateSystemType() {
        var tempResult = starSystem.roll();

        // Pupulate Result
        result.starSystem = tempResult.starSystem;
        result.rolls.starSystem = tempResult.rolls.starSystem;

        // Populate System Object
        planetarySystem.type = tempResult.starSystem;
        planetarySystem.stars = [];
        planetarySystem.starGroup = [];

        // Build Star List
        for(var i = 0; i < planetarySystem.type.value; i++) {
            var tempStar = { id: i };

            tempStar.name = planetarySystem.name;

            planetarySystem.stars.push(tempStar);
        }

        // Add UI Elements
        // jQuery("li.system-type div.result").empty().append(result.starSystem.name);
        // jQuery("li.system-type div.details").empty().append(result.starSystem.details);
    }

    function generateStars() {
        planetarySystem.stars.forEach(function(star) {
            generateStarType(star.id);
            generateStarClass(star.id);
        });

        // Sort by Size
        planetarySystem.stars.sort((a, b) => (a.mass > b.mass) ? -1 : 1);

        // Generate Orbital Seperation
        generateOrbitalSeparation();

        // Sort by Orbital Seperation
        planetarySystem.stars.sort((a, b) => (a.orbitalSeparation.distance > b.orbitalSeparation.distance) ? 1 : -1);
        groupStars();

        // Designate Name
        generateStarNames();
    }

    function generateStarType(id) {
        var tempResult = stellarClassification.roll();

        // Pupulate Result
        result.stellarType[id] = tempResult.stellarClassification;
        result.rolls.stellarType[id] = tempResult.rolls.stellarClassification;

        // Populate System Object
        planetarySystem.stars[id].type = tempResult.stellarClassification;

        // generateStarClass(id);
    }

    function generateStarClass(id) {
        var tempResult = { rolls: {} };

        if(planetarySystem.stars[id].type.code == "table.stellarClassification.revised.vii") {
            tempResult.rolls.spectralClass = { total: 0 };
            tempResult.spectralClass = resultHelper.get(spectralClass.table, tempResult.rolls.spectralClass);
        }
        else {
            tempResult = spectralClass.roll()
        }

        // Pupulate Result
        result.stellarClass[id] = tempResult.spectralClass;
        result.rolls.stellarClass[id] = tempResult.rolls.spectralClass;

        // Populate System Object
        planetarySystem.stars[id].class = tempResult.spectralClass;

        // Get Extra Information
        if(planetarySystem.stars[id].type.code != "table.stellarClassification.revised.Anomaly") {
            planetarySystem.stars[id].info = starInfo.find(element => element.name == planetarySystem.stars[id].class.name);
            planetarySystem.stars[id].typeInfo = starTypeInfo[planetarySystem.stars[id].class.code.replace("table.spectralClass.","")]
                        .find(element => element.lc_class == planetarySystem.stars[id].type.name);

            planetarySystem.stars[id].color = planetarySystem.stars[id].info.color;
            planetarySystem.stars[id].surfaceTemperature = localChance.natural({ min: planetarySystem.stars[id].info.surface_temp_min, max: planetarySystem.stars[id].info.surface_temp_max });
            planetarySystem.stars[id].luminosity = localChance.floating({ min: planetarySystem.stars[id].typeInfo.luminosity_min, max: planetarySystem.stars[id].typeInfo.luminosity_max });
            planetarySystem.stars[id].mass = localChance.floating({ min: planetarySystem.stars[id].typeInfo.mass_min, max: planetarySystem.stars[id].typeInfo.mass_max });
            planetarySystem.stars[id].radius = localChance.floating({ min: planetarySystem.stars[id].typeInfo.radius_min, max: planetarySystem.stars[id].typeInfo.radius_max });
            planetarySystem.stars[id].composition = planetarySystem.stars[id].info.composition;
            planetarySystem.stars[id].rotate = localChance.natural({ min: 0, max: 360 });
        }
    }

    function generateOrbitalSeparation(id) {
        planetarySystem.stars.forEach(function(element) {
            var tempResult = {
                stellarOrbitalSeparation: {
                    distance: 0,
                    name: "Origin"
                },
                rolls: {
                    stellarOrbitalSeparation: {
                        total: 0
                    }
                }
            };

            if(element.id > 0) { tempResult = stellarOrbitalSeparation.roll(); }

            // Pupulate Result
            result.stellarOrbitalSeparation[element.id] = tempResult.stellarOrbitalSeparation;
            result.rolls.stellarOrbitalSeparation[element.id] = tempResult.rolls.stellarOrbitalSeparation;

            // Populate System Object
            planetarySystem.stars[element.id].orbitalSeparation = tempResult.stellarOrbitalSeparation;
        });
    }

    function groupStars() {
        var groupNumber = 0;
        var minOrbitalSeparation = 1000000;

        planetarySystem.starGroup.push({
            name: "Group " + (groupNumber + 1),
            stars: [planetarySystem.stars[0]],
            luminosity: planetarySystem.stars[0].luminosity,
            mass: planetarySystem.stars[0].mass,
            orbitalSeparation: planetarySystem.stars[0].orbitalSeparation.distance,
            stellarSeparation: 0
        });

        for(var i = 1; i < planetarySystem.stars.length; i++) {
            var star = planetarySystem.stars[i];

            if(star.orbitalSeparation.code == "table.orbitalSeparation.close") {
                planetarySystem.starGroup[groupNumber].stars.push(star);
                planetarySystem.starGroup[groupNumber].luminosity += star.luminosity;
                planetarySystem.starGroup[groupNumber].mass += star.mass,
                planetarySystem.starGroup[groupNumber].stellarSeparation += star.orbitalSeparation.distance;
            }
            else {
                var newGroup = {
                    name: "Group " + (groupNumber + 2),
                    stars: [star],
                    luminosity: star.luminosity,
                    mass: star.mass,
                    orbitalSeparation: star.orbitalSeparation.distance,
                    stellarSeparation: 0
                };

                if(star.orbitalSeparation.distance < minOrbitalSeparation) { minOrbitalSeparation = star.orbitalSeparation.distance }

                planetarySystem.starGroup.push(newGroup);
                groupNumber++;
            }
        }

        // Calculate min/max PlanetaryDistance
        planetarySystem.starGroup.forEach(function(groupElement) {
            groupElement.minPlanetaryDistance = groupElement.stellarSeparation * planetarySystem.settings.minPlanetaryDistanceMultiplier;
            groupElement.maxPlanetaryDistance = stellarCalculator.calculateMaxPlanetaryDistance(minOrbitalSeparation, planetarySystem.settings.maxPlanetaryDistanceMultiplier);

            groupElement.stars.forEach(function(starElement) {
                starElement.minPlanetaryDistance = 0;

                if(groupElement.stellarSeparation == 0) { starElement.maxPlanetaryDistance = 10000000; }
                else {
                    starElement.maxPlanetaryDistance = (groupElement.stellarSeparation / 2) * planetarySystem.settings.maxPlanetaryDistanceMultiplier;
                }
            });
        });

        // planetarySystem.maxPlanetaryDistance = minOrbitalSeparation * planetarySystem.settings.maxPlanetaryDistanceMultiplier;
    }

    function generatePlanetarySystems() {
        planetarySystem.planetCount = 0;

        planetarySystem.starGroup.forEach(function(group, gIndex) {
            group.orbits = orbitalDistanceGenerator.calculate(group.luminosity);
            group.planets = [];
            group.name = planetarySystem.name + " ";

            if(group.stars.length > 1) {
                group.stars.forEach(function(star, sIndex) {
                    var i = 1;
                    star.maxPlanetaryDistance = stellarCalculator.calculateMaxPlanetaryDistance(group.stellarSeparation, planetarySystem.settings.maxPlanetaryDistanceMultiplier);
                    star.orbits = orbitalDistanceGenerator.calculateMultiStar(star, group.stars);
                    star.planets = [];

                    group.name += star.name.replace(planetarySystem.name + " ", "");

                    star.orbits.series.forEach(function(orbit) {
                        if(orbit.zone == "N/A" || star.class.code == "table.spectralClass.d" || star.minPlanetaryDistance > orbit.distance || orbit.distance > star.maxPlanetaryDistance) { delete orbit; }
                        else {
                            star.planets.push(generatePlanet(orbit, star, i, "star", sIndex));
                            planetarySystem.planetCount++;

                            i++;
                        }
                    });
                });

                var i = 1;

                group.orbits = orbitalDistanceGenerator.calculate(group.luminosity);
                group.planets = [];

                group.orbits.series.forEach(function(orbit) {
                    if(orbit.zone == "N/A"|| group.minPlanetaryDistance > orbit.distance || orbit.distance > group.maxPlanetaryDistance) { delete orbit; }
                    else {
                        group.planets.push(generatePlanet(orbit, group, i, "group", gIndex));
                        planetarySystem.planetCount++;

                        i++;
                    }
                });
            }
            else {
                var star = group.stars[0];
                var i = 1;

                group.name = star.name;

                star.planets = [];
                star.orbits = group.orbits;

                // Single Star Groups
                group.orbits.series.forEach(function(orbit) {
                    if(orbit.zone == "N/A" || star.class.code == "table.spectralClass.d" || group.minPlanetaryDistance > orbit.distance || orbit.distance > group.maxPlanetaryDistance) { delete orbit; }
                    else {
                        star.planets.push(generatePlanet(orbit, star, i, "star", 0));
                        planetarySystem.planetCount++;

                        i++;
                    }
                });
            }
        });

        // Oort cloud
        var oortCloudRoll = rollHelper.roll(settings.oortCloudRoll);

        if(oortCloudRoll.total >= 11) {
            planetarySystem.oortCloud = {
                type: "Extra Thick",
                code: "oortCloud.thick"
            };
        }
        else if(oortCloudRoll.total <= 3) {
            planetarySystem.oortCloud = {
                type: "Exceptionally Scanty",
                code: "oortCloud.scanty"
            };
        }
        else {
            planetarySystem.oortCloud = {
                type: "Standard",
                code: "oortCloud.standard"
            };
        }
    }

    function generatePlanet(orbit, parent, i, parentType, parentId) {
        do { orbit.planet = planetGenerator.roll(orbit.zone); }
        while((orbit.distance < 0.6 && orbit.planet.result.code == "planet.class.i")
            || (orbit.distance < 1 && orbit.planet.result.code == "planet.class.j")
            || (orbit.distance < 2 && orbit.planet.result.code == "planet.class.s")
            || (orbit.distance < 4 && orbit.planet.result.code == "planet.class.u"));

        orbit.planet.result.parentType = parentType;
        orbit.planet.result.parentId = parentId;
        orbit.planet.result.distance = orbit.distance;
        orbit.planet.result.zone = orbit.zone;
        orbit.planet.result.orbitalPeriod = stellarCalculator.calculateOrbitalPeriod(parent.mass, orbit.planet.result.distance);

        if(orbit.planet.result.code != "planet.asteroidBelt") {
            orbit.planet.result.className = orbit.planet.result.name;
            orbit.planet.result.name = parent.name + " " + resultHelper.romanize(i);
            orbit.planet.result.orbit.value = i;

            orbit.planet.result.image = getPlanetImage(orbit.planet.result.code);

            if(orbit.planet.result.distance < 0.5) { orbit.planet.result.dayLength *= localChance.d6(); }
            else if(orbit.planet.result.distance < 0.4) { orbit.planet.result.dayLength *= 10; }
            else if(orbit.planet.result.distance < 0.3) { orbit.planet.result.dayLength = 0; }
        }
        else {
            orbit.planet.result.name = orbit.planet.result.classification;
            orbit.planet.result.className = null;
            orbit.planet.result.atmosphere = { name: "None", code: "atmosphere.none", density: 0 };
            i--;
        }

        if(typeof orbit.planet.result.satelliteCount == "undefined") { orbit.planet.result.satelliteCount = 0; }

        return orbit.planet.result;
    }

    function getPlanetImage(className) {
        return imagePath[className] + images[className][localChance.natural({ min: 0, max: (images[className].length - 1) })];
    }

    function generateStarNames() {
        if(planetarySystem.stars.length > 1) {
            var starDesignation = "A";
            var i = 0;

            planetarySystem.stars.forEach(function(element) {
                element.id = i;
                element.name = element.name + " " + starDesignation;

                starDesignation = resultHelper.nextChar(starDesignation);
                i++;
            });
        }
    }

    function generateAsteroidBelts(){
        planetarySystem.starGroup.forEach(function(group) {
            generateAsteroidBeltsFn(group.planets, "group");
        });

        planetarySystem.stars.forEach(function(star) {
            generateAsteroidBeltsFn(star.planets, "star");
        });
    }

    function generateAsteroidBeltsFn(planets, baseType) {
        for(var i = (planets.length - 1); i > 0; i--) {
            var prevPlanet = planets[i-1];
            var curPlanet = planets[i];

            if((curPlanet.code == "planet.class.j" || curPlanet.code == "planet.class.s" || curPlanet.code == "planet.class.u")
                    && (prevPlanet.code != "planet.class.j" && prevPlanet.code != "planet.class.s" && prevPlanet.code != "planet.class.u")) {
                planets[i-1] = planetGenerator.getAsteroidBelt().result;
                planets[i-1].baseType = baseType;
                planets[i-1].parentType = baseType;
                planets[i-1].orbitalPeriod = 0;
                planets[i-1].zone = prevPlanet.zone;
                planets[i-1].distance = prevPlanet.distance;
            }
        }
    }

    function generatePlanetNames() {
        planetarySystem.starGroup.forEach(function(group, index) {
            generatePlanetNamesFn(group.planets, group.name, index, "group");
        });

        planetarySystem.stars.forEach(function(star, index) {
            generatePlanetNamesFn(star.planets, star.name, index, "star");
        });
    }

    function generatePlanetNamesFn(planets, parentName, index, type) {
        var planetNumber = 1;

        for(var i = 0; i < planets.length; i++) {
            var planet = planets[i];

            planet.orbit.value = i + 1;

            if(planet.code != "planet.asteroidBelt") {
                planet.name = parentName + " " + resultHelper.romanize(planetNumber);

                generateSatelliteNamesFn(planet, type, index, i);

                planetNumber++;
            }
            else {
                planet.baseType = type;
                planet.baseId = index;
                planet.parentId = i;
            }
        }
    }

    function generateSatelliteNamesFn(planet, baseType, baseId, parentId) {
        var moonDesignation = "a";

        planet.satelliteCount = planet.satellites.length;

        planet.satellites.forEach(function(moon) {
            moon.baseType = baseType;
            moon.baseId = baseId;
            moon.parentId = parentId;

            if(moon.code != "planet.rings") {
                if(typeof moon.className == "undefined") { moon.className = moon.name; }
                moon.name = planet.name + moonDesignation;
                moonDesignation = resultHelper.nextChar(moonDesignation);
                moon.image = getPlanetImage(moon.code);
            }
        });
    }

    // Return Methods and Values
    return {
        loadResources: loadResources,
        generateSystem: generateSystem,
        generateSystemName: generateSystemName,
        generateSystemAffiliation: generateSystemAffiliation,
        generateSystemType: generateSystemType,
        generateStars: generateStars,
        groupStars: groupStars,
        generatePlanetarySystems: generatePlanetarySystems,
        generateStarNames: generateStarNames,
        generateStarType: generateStarType,
        generateStarClass: generateStarClass,
        generateOrbitalSeparation: generateOrbitalSeparation,
        generateAsteroidBelts: generateAsteroidBelts,
        generatePlanetNames: generatePlanetNames,
        // getStats: getStats,
        data: {
            planetarySystem: planetarySystem
        }
    };
})();
