/*
 * Planetary System visualization
 */

window.planetarySystemVisualization = (function () {
    var localChance = new Chance(new Date());

    var config = {
        maxDim: 340,
        maxPlanetDim: 200,
        maxSatelliteDim: 50,
        minDim: 20
    };

    var ringImage = ["./image/planets/rings/ring01.png", "./image/planets/rings/ring02.png", "./image/planets/rings/ring03.png"]

    function init() {

    }

    /*
     * Render list of Objects, could be stars planets esc
     */
    function renderStellarGroups(target, data, context) {
        var vis = jQuery(target);
        var breadcrumbContainer = vis.siblings("nav").find("div.nav-wrapper > div.col");
        var breadcrumbEntry = breadcrumbContainer.find("a[data=\"System: " + data.name + "\"]");

        renderSummary();

        // Cleanup
        jQuery("div.material-tooltip").remove();

        // Set Defaults
        if(typeof context === "undefined") {
            var context = {
                solarRadiusMax: getLargestRadius(data.stars)
            };

            // System View Label
            vis.empty();

            if(breadcrumbEntry.length == 0) {
                breadcrumbContainer.empty()
                    .append(jQuery("<a/>")
                    .attr("href", "#!")
                    .attr("class", "breadcrumb")
                    .attr("data", "System: " + data.name)
                    .text("[System] " + data.name)
                    .click(function(){ renderStellarGroups(target, data); }));
            }
            else {
                breadcrumbEntry.nextAll().remove();
            }
        }

        data.starGroup.forEach((group, i) => {
            context.i = i;

            renderStellarGroup(target, group, context);
        });
    }

    /*
     * Render single stellar group
     */
    function renderStellarGroup(target, group, context) {
        var vis = jQuery(target);
        var breadcrumbContainer = vis.siblings("nav").find("div.nav-wrapper > div.col");
        var breadcrumbEntry = breadcrumbContainer.find("a[data=\"Group: " + group.name + "\"]");

        renderSummary();

        // Set Defaults
        if(typeof context === "undefined") {
            var context = {
                solarRadiusMax: getLargestRadius(group.stars),
                i: 0
            };

            // Cleanup
            jQuery("div.material-tooltip").remove();

            vis.empty();

            if(breadcrumbEntry.length == 0) {
                breadcrumbContainer.append(jQuery("<a/>")
                    .attr("href", "#!")
                    .attr("class", "breadcrumb")
                    .attr("data", "Group: " + group.name)
                    .text("[Group] " + group.name)
                    .click(function(){
                        vis.empty();
                        breadcrumbContainer.find("a[data=\"Group: " + group.name + "\"]").nextAll().remove();
                        renderStellarGroup(target, group, context); }));
            }
            else {
                breadcrumbEntry.nextAll().remove();
            }
        }

        // Group Visualization Here
        var groupElement = jQuery("<div/>")
                .attr("id", "stellarGroup" + context.i)
                .attr("class", "stellar-group");

        // var groupPlanetsElement = jQuery("<div/>")
        //         .attr("id", "stellarGroupPlanets" + context.i)
        //         .attr("class", "stellar-group-planets right-align");

        var groupLabel = jQuery("<h5/>")
                .attr("class", "group-label cursor")
                .attr("data-name", group.name)
                .text(group.name)
                .click(function() {
                    var groupName = jQuery(this).attr("data-name");
                    var group = planetarySystem.starGroup.filter(function(gr) { return gr.name == groupName; })

                    planetarySystemVisualization.renderStellarGroup(target, group[0]);
                });

        var smallStarDim;

        group.stars.forEach((star, j) => {
            // Calculate rendered scale based on relative size to largest.
            var dim = (star.radius / context.solarRadiusMax) * config.maxDim;

            // Enforce a minimum render size so we don't get elements too small to see.
            if(dim < config.minDim) { dim = config.minDim; }
            if(dim > config.maxDim) { dim = config.maxDim; }

            if(typeof smallStarDim === "undefined" || smallStarDim > dim) { smallStarDim = dim; }

            // (Star Diameter / 2) - (Planet Diameter / 2)
            var bottomOffset = (config.maxDim / 2) - (dim / 2);

            var starElement = jQuery("<img />")
                    .attr("class", "tooltipped star cursor")
                    .attr("src", "./" + star.info.image)
                    .attr("data-name", star.name)
                    .attr("data-position", "bottom")
                    .attr("data-tooltip", star.name)
                    .css("transform", "rotate(" + Math.floor(Math.random() * 360) + "deg)")
                    .css("margin-bottom", bottomOffset)
                    .height(dim)
                    .width(dim)
                    .click(function() {
                        var starName = jQuery(this).attr("data-name");
                        var star = planetarySystem.stars.filter(function(st) { return st.name == starName; })

                        planetarySystemVisualization.renderPlanetarySystem(target, star[0]);
                    });

            groupElement.append(starElement);
        });

        if(group.planets.length > 0) {
            var planetRadiusMax = getSmallestRadius(group.stars) * 60;
            var planetarySystemScale = 1;

            // Quick Scale Modal
            if(planetRadiusMax <= 3) { planetarySystemScale = 0.25; }

            groupElement.append("<img src=\"./image/system-border.png\" />");

            group.planets.forEach((planet, k) => { renderPlanet(groupElement, planetRadiusMax, planetarySystemScale, planet, k); });
        }

        vis.append(groupLabel)
           .append(groupElement)
           .find(".tooltipped").tooltip();
    }

    /*
     * Render list of Objects, could be stars planets esc
     */
    function renderPlanetarySystem(target, star) {
        var vis = jQuery(target);
        var breadcrumbContainer = vis.siblings("nav").find("div.nav-wrapper > div.col");
        var breadcrumbEntry = breadcrumbContainer.find("a[data=\"Star: " + star.name + "\"]");

        var planetRadiusMax = getLargestPlanetRadius(star.planets);
        var planetarySystemScale = 1;

        renderSummary();

        // Quick Scale Modal
        if(planetRadiusMax <= 3) { planetarySystemScale = 0.25; }

        // Cleanup
        jQuery("div.material-tooltip").remove();

        vis.empty();

        if(breadcrumbEntry.length == 0) {
            breadcrumbContainer.append(jQuery("<a/>")
                .attr("href", "#!")
                .attr("class", "breadcrumb")
                .attr("data", "Star: " + star.name)
                .text("[Star] " + star.name)
                .click(function(){ renderPlanetarySystem(target, star); }));
        }
        else {
            breadcrumbEntry.nextAll().remove();
        }

        var starLabel = jQuery("<h5/>")
                .attr("class", "star-label cursor")
                .attr("data-name", star.name)
                .text(star.name);

        var starElement = jQuery("<img />")
                .attr("class", "tooltipped star cursor")
                .attr("src", "./" + star.info.image)
                .attr("data-position", "bottom")
                .attr("data-tooltip", star.name)
                .css("transform", "rotate(" + Math.floor(Math.random() * 360) + "deg)")
                .height(config.maxDim)
                .width(config.maxDim)
                .click(function(){
                    renderStarInfo(star);
                });

        vis.append(starLabel)
           .append(starElement);

       star.planets.forEach((planet, j) => { renderPlanet(vis, planetRadiusMax, planetarySystemScale, planet, j); });

       vis.find(".tooltipped").tooltip();
    }

    /*
     * Render Lunar System
     */
    function renderLunarSystem(target, planet) {
        var vis = jQuery(target);
        var breadcrumbContainer = vis.siblings("nav").find("div.nav-wrapper > div.col");
        var breadcrumbEntry = breadcrumbContainer.find("a[data=\"Planet: " + planet.name + "\"]");

        renderSummary();

        var satelliteRadiusMax = getLargestPlanetRadius(planet.satellites);
        // var lunarSystemScale = 1;

        // Quick Scale Modal
        // if(planetRadiusMax <= 3) { planetarySystemScale = 0.25; }

        // Cleanup
        jQuery("div.material-tooltip").remove();

        vis.empty();

        if(breadcrumbEntry.length == 0) {
            breadcrumbContainer.append(jQuery("<a/>")
                .attr("href", "#!")
                .attr("class", "breadcrumb")
                .attr("data", "Planet: " + planet.name)
                .text("[Planet] " + planet.name)
                .click(function(){ renderLunarSystem(target, planet); }));
        }
        else {
            breadcrumbEntry.nextAll().remove();
        }

        var planetLabel = jQuery("<h5/>")
                .attr("class", "planet-label cursor")
                .attr("data-name", planet.name)
                .text(planet.name);

        var planetElement = jQuery("<img />")
                .attr("class", "tooltipped planet cursor")
                .attr("src", "./" + planet.image)
                .attr("data-position", "bottom")
                .attr("data-tooltip", planet.name)
                .css("transform", "rotate(" + ((typeof planet.axialTilt === "undefined") ? 0 : planet.axialTilt.value) + "deg)")
                .height(config.maxDim)
                .width(config.maxDim)
                .click(function(){
                    renderPlanetInfo(planet);
                });

        vis.append(planetLabel)
           .append(planetElement);

        // Check for and Render Rings
        if(hasRings(planet)) {
           var satelliteElement = jQuery("<img />")
                   .attr("class", "planet-ring")
                   .attr("src", "./" + ringImage[localChance.natural({ min: 0, max: (ringImage.length - 1) })])
                   .attr("data-position", "bottom")
                   .css("transform", "rotate(20deg)");

           target.append(satelliteElement);
        }

       // Render Moons
       planet.satellites.forEach((satellite, k) => { renderSatellite(vis, satelliteRadiusMax, satellite, k); });

       vis.find(".tooltipped").tooltip();
    }

    /*
     * Render planet
     */
    function renderPlanet(target, planetRadiusMax, planetarySystemScale, planet, j) {
        // Calculate rendered scale based on relative size to largest.
        var dim = (planet.planetaryRadius / planetRadiusMax) * config.maxPlanetDim;

        // Enforce a minimum render size so we don't get elements too small to see.
        if(dim < config.minDim) { dim = config.minDim; }
        if(dim > config.maxPlanetDim) { dim = config.maxPlanetDim; }

        // Apply Scale
        dim = dim * planetarySystemScale;

        // (Star Diameter / 2) - (Planet Diameter / 2)
        var bottomOffset = (config.maxDim / 2) - (dim / 2);

        var planetElement = jQuery("<img />")
                .attr("class", "tooltipped planet cursor")
                .attr("src", "./" + planet.image)
                .attr("data-position", "bottom")
                .attr("data-tooltip", planet.name + ((!planet.className) ? "" : " (" + planet.className + ")"))
                .css("transform", "rotate(" + ((typeof planet.axialTilt === "undefined") ? 0 : planet.axialTilt.value) + "deg)")
                .css("margin-bottom", bottomOffset)
                .css("pointer", "")
                .height(dim)
                .width(dim)
                .click(function(){
                    if(planet.satelliteCount > 0) { renderLunarSystem(target, planet); }
                    else { renderPlanetInfo(planet); }
                });

        target.append(planetElement);
    }

    /*
     * Render planet
     */
    function renderSatellite(target, satelliteRadiusMax, satellite, k) {
        // Escape if Rings
        if(satellite.code == "planet.rings") { return; }

        // Calculate rendered scale based on relative size to largest.
        var dim = (satellite.planetaryRadius / satelliteRadiusMax) * config.maxSatelliteDim;

        // Enforce a minimum render size so we don't get elements too small to see.
        if(dim < config.minDim) { dim = config.minDim; }
        if(dim > config.maxSatelliteDim) { dim = config.maxSatelliteDim; }

        // Apply Scale
        // dim = dim * planetarySystemScale;

        // (Star Diameter / 2) - (Planet Diameter / 2)
        var bottomOffset = (config.maxDim / 2) - (dim / 2);

        var satelliteElement = jQuery("<img />")
                .attr("class", "tooltipped planet cursor")
                .attr("src", "./" + satellite.image)
                .attr("data-position", "bottom")
                .attr("data-tooltip", satellite.name + ((!satellite.className) ? "" : " (" + satellite.className + ")"))
                .css("transform", "rotate(" + ((typeof satellite.axialTilt === "undefined") ? 0 : satellite.axialTilt.value) + "deg)")
                .css("margin-bottom", bottomOffset)
                .height(dim)
                .width(dim)
                .click(function(){ renderMoonInfo(satellite); });

        target.append(satelliteElement);
    }

    /*
     * Accepts a list of json objects (stars) and returns the largest radius.
     */
    function getLargestRadius(data) {
        var largestRadius = -1;

        data.forEach((body, i) => {
            if(body.radius > largestRadius) { largestRadius = body.radius; }
        });

        return largestRadius;
    }

    /*
     * Accepts a list of json objects (stars) and returns the smallest radius.
     */
    function getSmallestRadius(data) {
        var smallestRadius = 10000000000;

        data.forEach((body, i) => {
            if(body.radius < smallestRadius) { smallestRadius = body.radius; }
        });

        return smallestRadius;
    }

    /*
     * Accepts a list of json objects (planets) and returns the largest radius.
     */
    function getLargestPlanetRadius(data) {
        var largestRadius = -1;

        data.forEach((body, i) => {
            if(body.planetaryRadius > largestRadius) { largestRadius = body.planetaryRadius; }
        });

        return largestRadius;
    }

    /*
     * Returns whether the planet has rings.
     */
    function hasRings(planet) {
        if(!planet.satellites) { return false; }

        return planet.satellites.filter(satellite => satellite.code === "planet.rings").length > 0;
    }

    // Return Methods and Values
    return {
        init: init,
        renderStellarGroups: renderStellarGroups,
        renderStellarGroup: renderStellarGroup,
        renderPlanetarySystem: renderPlanetarySystem
    };
})();
