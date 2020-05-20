/*
 * Planetary System visualization
 */

window.planetarySystemVisualization = (function () {
    var config = {
        maxDim: 340,
        maxPlanetDim: 200,
        minDim: 20
    };

    function init() {

    }

    /*
     * Render list of Objects, could be stars planets esc
     */
    function renderStellarGroups(target, data, context) {
        var vis = jQuery(target);

        // Cleanup
        jQuery("div.material-tooltip").remove();

        // Set Defaults
        if(typeof context === "undefined") {
            var context = {
                solarRadiusMax: getLargestRadius(data.stars)
            };

            // System View Label
            vis.empty()
                .append(jQuery("<div/>")
                .attr("class", "view-title")
                .text("System View"));
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

        // Set Defaults
        if(typeof context === "undefined") {
            var context = {
                solarRadiusMax: getLargestRadius(group.stars),
                i: 0
            };

            // Cleanup
            jQuery("div.material-tooltip").remove();

            vis.empty()
                .append(jQuery("<div/>")
                .attr("class", "view-title")
                .text("Stellar Group View"));
        }

        // Group Visualization Here
        var groupElement = jQuery("<div/>")
                .attr("id", "stellarGroup" + context.i)
                .attr("class", "stellar-group");

        // var groupPlanetsElement = jQuery("<div/>")
        //         .attr("id", "stellarGroupPlanets" + context.i)
        //         .attr("class", "stellar-group-planets right-align");

        var groupLabel = jQuery("<div/>")
                .attr("class", "group-label cursor")
                .attr("data-name", group.name)
                .text(group.name)
                .click(function() {
                    var groupName = jQuery(this).attr("data-name");
                    var group = planetarySystemGenerator.data.planetarySystem.starGroup.filter(function(gr) { return gr.name == groupName; })

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
                        var star = planetarySystemGenerator.data.planetarySystem.stars.filter(function(st) { return st.name == starName; })

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
        var planetRadiusMax = getLargestPlanetRadius(star.planets);
        var planetarySystemScale = 1;

        // Quick Scale Modal
        if(planetRadiusMax <= 3) { planetarySystemScale = 0.25; }

        // Cleanup
        jQuery("div.material-tooltip").remove();

        vis.empty()
            .append(jQuery("<div/>")
            .attr("class", "view-title")
            .text("Planetary System View"));

        var starLabel = jQuery("<div/>")
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
                    starPopup(star);
                });

        vis.append(starLabel)
           .append(starElement);

       star.planets.forEach((planet, j) => { renderPlanet(vis, planetRadiusMax, planetarySystemScale, planet, j); });

       vis.find(".tooltipped").tooltip();
    }

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
                .attr("data-tooltip", planet.name + " (" + planet.className + ")")
                .css("transform", "rotate(" + ((typeof planet.axialTilt === "undefined") ? 0 : planet.axialTilt.value) + "deg)")
                .css("margin-bottom", bottomOffset)
                .height(dim)
                .width(dim)
                .click(function(){
                    planetPopup(planet);
                });

        target.append(planetElement);
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

    // Return Methods and Values
    return {
        init: init,
        renderStellarGroups: renderStellarGroups,
        renderStellarGroup: renderStellarGroup,
        renderPlanetarySystem: renderPlanetarySystem
    };
})();
