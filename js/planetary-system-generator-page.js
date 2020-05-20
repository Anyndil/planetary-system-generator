/*
 * Page JavaScript
 *
 * @author:     jim
 */
var planetarySystem = {};

var starInfo = {};
var starTypeInfo = {};

/*
 * Page initialization method.
 */
function init() {
    // Load Tables
    planetarySystemGenerator.loadResources();

    // Functionality
    jQuery("div.header a.dropdown-trigger").dropdown({ coverTrigger: false });

    jQuery("a.load-dialog-button").click(openLoadDataPopup);
    jQuery("a.save-dialog-button").click(openSaveDataPopup);

    jQuery("a.roll-button,a.roll-icon").click(handleRoll);
    jQuery("a.load-button").click(loadData);

    jQuery("a#visRefreshButton").click(function(){ planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem); });
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
    // renderSystemName();
    // renderSystemType();
    // renderStarTable();
    // renderStarGroups();
    // renderPlanets();
    // renderLifeTable();
    // renderResourceTable();
    // renderSummary();

    planetarySystemVisualization.renderStellarGroups("#systemVis", planetarySystem);

    jQuery("#visRefreshButton").removeClass("hidden");

    outputData();
}

/*
 * Method Responsible for Opening Load Data Dialog
 */
function openLoadDataPopup() {
    jQuery("div#loadModal").modal('open');
}

/*
 * Method Responsible for Opening Save Data Dialog
 */
function openSaveDataPopup() {
    jQuery("div#saveModal").modal('open');
    jQuery("div#saveModal div.data-div textarea").text(JSON.stringify(planetarySystemGenerator.data));

    jQuery("div#saveModal a.modal-close").click(function(){
        jQuery("div#saveModal div.data-div textarea").remove();
        jQuery("div#saveModal div.data-div").append("<textarea></textarea>");
    });
}

// On Page Ready call Init Method
jQuery(document).ready(init);
