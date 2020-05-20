/*
 * Table 10.7ii: Atmosphere (Standard Gravity) Table and Functions
 */

window.planetaryAtmosphereStandard = (function () {
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
            tablePromise = tableHelper.getTable("./data/atmosphere/atmosphere-standard-gravity.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/atmosphere/atmosphere-standard-gravity-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            planetaryAtmosphereStandard.table = data;
        });

        modifiersPromise.done(function(data){
            planetaryAtmosphereStandard.modifiers = data;
        });

        return planetaryAtmosphereStandard.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), planetaryAtmosphereStandard.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            planetaryAtmosphereStandard: resultHelper.clone(result),
            rolls: {
                planetaryAtmosphereStandard: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { planetaryAtmosphereStandard: output.planetaryAtmosphereStandard };
            output.planetaryAtmosphereStandard = resultHelper.clone(subResult);
            output.rolls.planetaryAtmosphereStandardSubRoll = subroll
        }

        // Cleanup
        delete output.planetaryAtmosphereStandard.roll;

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
