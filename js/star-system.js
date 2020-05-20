/*
 * Table 10.5: Star System Table and Functions
 */

window.starSystem = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 2,
            maxRoll: 12,
            minRoll: 2
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
            tablePromise = tableHelper.getTable("./data/star-system/star-system.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/star-system/star-system-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            starSystem.table = data;
        });

        modifiersPromise.done(function(data){
            starSystem.modifiers = data;
        });

        return starSystem.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), starSystem.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            starSystem: resultHelper.clone(result),
            rolls: {
                starSystem: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { starSystem: output.starSystem };
            output.starSystem = resultHelper.clone(subResult);
            output.rolls.starSystemSubRoll = subroll
        }

        // Cleanup
        delete output.starSystem.roll;

        return output;
    }

    // Return Methods and Values
    return {
        settings: settings,
        modifiers: modifiers,
        table: table,
        generateTable: generateTable,
        getTable: getTable,
        roll: roll
    };
})();
