/*
 * Template Table and Functions
 */

window.stellarClassification = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 5,
            maxRoll: 30,
            minRoll: 5
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
            tablePromise = tableHelper.getTable("./data/stellar-classification/stellar-classification.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/stellar-classification/stellar-classification-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            stellarClassification.table = data;
        });

        modifiersPromise.done(function(data){
            stellarClassification.modifiers = data;
        });

        return stellarClassification.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), stellarClassification.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            stellarClassification: resultHelper.clone(result),
            rolls: {
                stellarClassification: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { stellarClassification: output.stellarClassification };
            output.stellarClassification = resultHelper.clone(subResult);
            output.rolls.stellarClassificationSubRoll = subroll
        }

        // Cleanup
        delete output.stellarClassification.roll;

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
