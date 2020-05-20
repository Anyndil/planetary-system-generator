/*
 * Table 10.7i: Atmosphere (Low Gravity) Table and Functions
 */

window.planetaryAtmosphereLow = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 1,
            maxRoll: 6,
            minRoll: 1
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
            tablePromise = tableHelper.getTable("./data/atmosphere/atmosphere-low-gravity.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/atmosphere/atmosphere-low-gravity-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            planetaryAtmosphereLow.table = data;
        });

        modifiersPromise.done(function(data){
            planetaryAtmosphereLow.modifiers = data;
        });

        return planetaryAtmosphereLow.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), planetaryAtmosphereLow.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            planetaryAtmosphereLow: resultHelper.clone(result),
            rolls: {
                planetaryAtmosphereLow: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { planetaryAtmosphereLow: output.planetaryAtmosphereLow };
            output.planetaryAtmosphereLow = resultHelper.clone(subResult);
            output.rolls.planetaryAtmosphereLowSubRoll = subroll
        }

        // Cleanup
        delete output.planetaryAtmosphereLow.roll;

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
