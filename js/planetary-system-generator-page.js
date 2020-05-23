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
    starGroups: {
        source: "./template/star-groups.hbs",
        template: null,
    },
    starTable: {
        source: "./template/star-table.hbs",
        template: null,
    },
    planetTable: {
        source: "./template/planet-table.hbs",
        template: null,
    },
    lifeTable: {
        source: "./template/life-table.hbs",
        template: null
    },
    resourceTable: {
        source: "./template/resource-table.hbs",
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

// JSON Viewer
var jsonViewer = new JSONViewer();

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
    jQuery("a.data-viewer-button").click(openDataViewerPopup);


    jQuery("a.roll-button,a.roll-icon").click(handleRoll);
    jQuery("a.load-button").click(loadData);

    jQuery("a#visRefreshButton").click(function(){ planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem); });

    // JSON Viewer
    jQuery("div#dataModal div.modal-content").append(jsonViewer.getContainer());

    // Init Tabs
    jQuery(".tabs").tabs();

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

/*
 * Render all Elements
 */
function renderAll() {
    renderSummary();
    renderStarGroups();
    renderStarTable();
    renderPlanets();
    renderPointsOfInterest();

    // renderSystemName();
    // renderSystemType();

    planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem);

    jQuery("#visRefreshButton,div.visualization-container").removeClass("hidden");

    //outputData();

    // Hide Instructions
    jQuery("div.container.instructions").addClass("hidden");
}

/*
 * Render System Summary
 */
function renderSummary() {
    jQuery("div#infoSummary").empty()
        .append(templates.systemSummary.template(planetarySystem))
        .find("div.tooltipped").tooltip();


    jQuery(".tabs").tabs("select", "infoSummary");
    jQuery("div.info-container").removeClass("hidden");
}

/*
 * Render Stellar Group Info
 */
function renderStarGroups() {
    jQuery("div#infoStellarGroups").empty()
        .append(templates.starGroups.template(planetarySystem));
}

/*
 * Render Star Table
 */
function renderStarTable() {
    jQuery("div#infoStars").empty()
        .append(templates.starTable.template(planetarySystem));
}

/*
 * Render Planet Table
 */
function renderPlanets() {
    jQuery("div#infoPlanets").empty()
        .append(templates.planetTable.template(planetarySystem));
}

function renderPointsOfInterest() {
    jQuery("div#infoPointsOfInterest").empty()
        .append(templates.resourceTable.template(planetarySystem.stats.resourceRich))
        .append(templates.lifeTable.template(planetarySystem.stats.life));
}

function renderStarInfo(star) {
    jQuery("div#selectedObjectInfo").empty().append(templates.starInfo.template(star));
    jQuery(".tabs").tabs("select", "selectedObjectInfo");
}

function renderPlanetInfo(planet) {
    jQuery("div#selectedObjectInfo").empty().append(templates.planetInfo.template(planet));
    jQuery(".tabs").tabs("select", "selectedObjectInfo");
}

function renderMoonInfo(satellite) {
    jQuery("div#selectedObjectInfo").empty().append(templates.moonInfo.template(satellite));
    jQuery(".tabs").tabs("select", "selectedObjectInfo");
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

/*
 * Data Viewer to Inspect JSON Data
 */
function openDataViewerPopup() {
    jsonViewer.showJSON(planetarySystem, -1, 1);
    jQuery("div#dataModal").modal("open");
}

// On Page Ready call Init Method
jQuery(document).ready(init);
