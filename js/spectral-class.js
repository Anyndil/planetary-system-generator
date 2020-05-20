/*
 * Template Table and Functions
 */

window.spectralClass = (function () {
    var localChance = new Chance(new Date());

    var tableParameters = { };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 3,
            maxRoll: 18,
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
            tablePromise = tableHelper.getTable("./data/spectral-class/spectral-class.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/spectral-class/spectral-class-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            spectralClass.table = data;
        });

        modifiersPromise.done(function(data){
            spectralClass.modifiers = data;
        });

        return spectralClass.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), spectralClass.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            spectralClass: resultHelper.clone(result),
            rolls: {
                spectralClass: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);
            var subResult = resultHelper.get(result.subroll.data, subroll);

            output.archive = { spectralClass: output.spectralClass };
            output.spectralClass = resultHelper.clone(subResult);
            output.rolls.spectralClassSubRoll = subroll
        }

        // Cleanup
        delete output.spectralClass.roll;

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
