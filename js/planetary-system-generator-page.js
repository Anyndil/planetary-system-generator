/*
 * Page JavaScript
 *
 * @author:     jim
 */
var planetarySystem = {};

var starInfo = {};
var starTypeInfo = {};

var templates = {
    systemSummary: {
        source: "./template/system-summary.hbs",
        template: null
    },
    starInfo: {
        source: "./template/star-info.hbs",
        template: null,
    },
    planetInfo: {
        source: "./template/planet-info.hbs",
        template: null,
    },
    moonInfo: {
        source: "./template/moon-info.hbs",
        template: null,
    }
};

/*
 * Page initialization method.
 */
function init() {
    // Load Tables
    planetarySystemGenerator.loadResources();

    // Load templates
    handlebarHelper.init();
    handlebarHelper.getTemplates(templates);

    // Functionality
    jQuery("div.header a.dropdown-trigger").dropdown({ coverTrigger: false });

    jQuery("a.load-dialog-button").click(openLoadDataPopup);
    jQuery("a.save-dialog-button").click(openSaveDataPopup);

    jQuery("a.roll-button,a.roll-icon").click(handleRoll);
    jQuery("a.load-button").click(loadData);

    jQuery("a#visRefreshButton").click(function(){ planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem); });

    // INIT Modals
    jQuery(".modal").modal();
}

/*
 * Method Responsible for Handling Roll
 */
function handleRoll(event) {
    planetarySystem = planetarySystemGenerator.generateSystem();

    renderAll();
}

/*
 * Method Responsible for loading Data
 */
function loadData() {
    planetarySystem = JSON.parse(jQuery("textarea#data").val());

    // Close Section
    jQuery("textarea#data").val(" ");

    renderAll();
}

function renderAll() {
    renderSummary();

    // renderSystemName();
    // renderSystemType();
    // renderStarTable();
    // renderStarGroups();
    // renderPlanets();
    // renderLifeTable();
    // renderResourceTable();

    planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem);

    jQuery("#visRefreshButton,div.visualization-container").removeClass("hidden");

    //outputData();

    // Hide Instructions
    jQuery("div.container.instructions").addClass("hidden");
}

function renderSummary() {
    jQuery("div#selectedObjectInfo").empty()
        .append(templates.systemSummary.template(planetarySystem))
        .find("div.tooltipped").tooltip();
}

function renderStarInfo(star) {
    jQuery("div#selectedObjectInfo").empty().append(templates.starInfo.template(star));
    // jQuery("div#starModal").modal('open');
}

function renderPlanetInfo(planet) {
    jQuery("div#selectedObjectInfo").empty().append(templates.planetInfo.template(planet));
    // jQuery("div#planetModal div.satellites table td").click(moonPopup);
    // jQuery("div#planetModal").modal('open');
}

function renderMoonInfo(satellite) {
    jQuery("div#selectedObjectInfo").empty().append(templates.moonInfo.template(satellite));

    // var row = jQuery(this).closest("tr");
    // var id = row.find("input[name=planetId],input[name=moonId]").val();
    // var parentId = row.find("input[name=parentId]").val();
    // var parentType = row.find("input[name=parentType]").val();
    // var baseType = row.find("input[name=baseType]").val();
    // var baseId = row.find("input[name=baseId]").val();
    //
    // if(baseType == "star") {
    //     jQuery("div#moonModal > div.modal-content").empty()
    //         .append(templates.moonInfo.template(
    //             planetarySystemGenerator.data.planetarySystem.stars[baseId].planets[parentId].satellites[id]));
    // }
    // else if(baseType == "group") {
    //     jQuery("div#moonModal > div.modal-content").empty()
    //         .append(templates.moonInfo.template(
    //             planetarySystemGenerator.data.planetarySystem.starGroup[baseId].planets[parentId].satellites[id]));
    // }
    //
    // jQuery("div#moonModal").modal('open');
}

/*
 * Method Responsible for Opening Load Data Dialog
 */
function openLoadDataPopup() {
    jQuery("div#loadModal").modal("open");
}

/*
 * Method Responsible for Opening Save Data Dialog
 */
function openSaveDataPopup() {
    jQuery("div#saveModal").modal("open");
    jQuery("div#saveModal div.data-div textarea").text(JSON.stringify(planetarySystem));

    jQuery("div#saveModal a.modal-close").click(function(){
        jQuery("div#saveModal div.data-div textarea").remove();
        jQuery("div#saveModal div.data-div").append("<textarea></textarea>");
    });
}

// On Page Ready call Init Method
jQuery(document).ready(init);
