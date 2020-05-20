/*
 * Template Table and Functions
 */

window.stellarGiantType = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 3,
            maxRoll: 19,
            minRoll: 3
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
            tablePromise = tableHelper.getTable("./data/stellar-giant/stellar-giant.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/stellar-giant/stellar-giant-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            stellarGiantType.table = data;
        });

        modifiersPromise.done(function(data){
            stellarGiantType.modifiers = data;
        });

        return stellarGiantType.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), stellarGiantType.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            stellarGiantType: resultHelper.clone(result),
            rolls: {
                stellarGiantType: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { stellarGiantType: output.stellarGiantType };
            output.stellarGiantType = resultHelper.clone(subResult);
            output.rolls.stellarGiantTypeSubRoll = subroll
        }

        // Cleanup
        delete output.stellarGiantType.roll;

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
