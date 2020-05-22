// handlebar Helper
window.handlebarHelper = (function () {
    // INIT
    function init() {
        HandlebarsIntl.registerWith(Handlebars);
        Handlebars.registerHelper('replace', replaceHelper);
    }

    function replaceHelper(string, replace, replacement) {
        return (string || '').replace(replace, replacement);
    }

    function getTemplates(templates) {
        jQuery.each(templates, function(i, instance) {
            jQuery.get(instance.source, function (data) {
                instance.template = Handlebars.compile(data);
            }, 'html')
        });
    }

    return {
        init: init,
        getTemplates: getTemplates
    };
})();
