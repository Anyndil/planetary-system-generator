/*
 * Table 10.7B: Temperature Table and Functions
 */

window.planetaryTemperature = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 2,
            maxRoll: 14,
            minRoll: 0
        }
    };

    var modifiers = null;
    var table = null;

    var modifiersPromise = null;
    var tablePromise = null;

    // Objects
    // function generateObject(index) {
    //     return  {
    //         roll: index,
    //         name: "Object",
    //         code: "object.object",
    //         description: "Object"
    //     };
    // }

    // Generate Table
    function generateTable() {
        if(table == null) {
            tablePromise = tableHelper.getTable("./data/temperature/temperature.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/temperature/temperature-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            planetaryTemperature.table = data;
        });

        modifiersPromise.done(function(data){
            planetaryTemperature.modifiers = data;
        });

        return planetaryTemperature.table;
    }

    // Roll on Table 3d6
    function roll(dice) {
        return rollFn(getTable(), (typeof dice == "undefined") ? settings.dice : dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            planetaryTemperature: resultHelper.clone(result),
            rolls: {
                planetaryTemperature: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { planetaryTemperature: output.planetaryTemperature };
            output.planetaryTemperature = resultHelper.clone(subResult);
            output.rolls.planetaryTemperatureSubRoll = subroll
        }

        // Cleanup
        delete output.planetaryTemperature.roll;

        return output;
    }

    // Return Methods and Values
    return {
        settings: settings,
        modifiers: modifiers,
        table: table,
        generateTable: generateTable,
        roll: roll
    };
})();
