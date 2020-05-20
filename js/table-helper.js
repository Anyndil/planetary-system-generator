// Table Helper
window.tableHelper = (function () {
    function getTable(url, parameters) {
        var context = {
            url: url,
            parameters: parameters,
            data: jQuery.Deferred()
        };

        return jQuery.get({
                url: context.url,
                data: context.parameters,
                dataType: "json"
            })
            .then(function(data) {
                context.data = data;
                checkForSubrolls(context);

                return context.data;
            });
    }

    function checkForSubrolls(context) {
        for (var key in context.data) {
            var obj = context.data[key];

            if(obj.subroll != null) {
                obj.subroll = getSubroll(context, obj);
            }
            else {
                delete obj.subroll;
            }
        }
    }

    function getSubroll(context, object) {
        var subroll = {};

        getRollTable(context, object, subroll);
        getSubTable(context, object, subroll);

        return subroll;
    }

    function getRollTable(context, object, subroll) {
        var url = "";

        if(object.subroll == "roll.type.1d6") { url = "./data/roll-type/1d6.json"; }
        else if(object.subroll == "roll.type.2d6*10") { url = "./data/roll-type/2d6x10.json"; }
        else if(object.subroll == "roll.type.2d6*100") { url = "./data/roll-type/2d6x100.json"; }

        jQuery.get({
            url: url,
            dataType: "json"
        })
        .then(function(data) {
            processSubrollData(context, subroll, data);
        });
    }

    function processSubrollData(context, subroll, data) {
        subroll.dice = data[0];

        subroll.dice.rollFunction = getFunctionByName(subroll.dice.rollFunction);
    }

    function getSubTable(context, object, subroll) {
        jQuery.get({
            url: context.url,
            data: {
                subtable: 1,
                parentCode: object.code
            },
            dataType: "json"
        })
        .then(function(data) {
            processSubtableData(context, subroll, data);
        });
    }

    function processSubtableData(context, subroll, data) {
        subroll.data = data;
    }

    function getModifiers(url) {
        var context = {
            url: url,
            data: jQuery.Deferred()
        };

        return jQuery.get({
                url: context.url,
                data: context.parameters,
                dataType: "json"
            })
            .then(function(data) {
                context.data = data;

                return context.data;
            });
    }

    function getFunctionByName(functionName) {
        var context = window;
        var namespaces = functionName.split(".");
        var func = namespaces.pop();

        for(var i = 0; i < namespaces.length; i++) {
            context = context[namespaces[i]];
        }
        return context[func];
    }

    function getByCode(array, code) {
        return array.find(element => element.code == code);
    }

    function getByValue(array, value) {
        return array.find(element => element.value == value);
    }

    return {
        getModifiers: getModifiers,
        getTable: getTable,
        getRollTable: getRollTable,
        getSubroll: getSubroll,
        getFunctionByName: getFunctionByName,
        getByCode: getByCode,
        getByValue: getByValue
    };
})();
