/*
 * Template Table and Functions
 */

window.stellarOrbitalSeparation = (function () {
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
            tablePromise = tableHelper.getTable("./data/orbital-separation/orbital-separation.json", tableParameters);
            modifiersPromise = tableHelper.getModifiers("./data/orbital-separation/orbital-separation-modifiers.json");

            table = tablePromise.then(function (data) {
                return data;
            });

            table = getTable();
        }

        return tablePromise;
    }

    function getTable() {
        tablePromise.done(function(data){
            stellarOrbitalSeparation.table = data;
        });

        modifiersPromise.done(function(data){
            stellarOrbitalSeparation.modifiers = data;
        });

        return stellarOrbitalSeparation.table;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getTable(), stellarOrbitalSeparation.settings.dice);
    }

    function rollFn(source, rollDef) {
        var roll = rollHelper.roll(rollDef);
        var result = resultHelper.get(source, roll);

        // Format Output
        var output = {
            stellarOrbitalSeparation: resultHelper.clone(result),
            rolls: {
                stellarOrbitalSeparation: roll
            }
        };

        // Subroll
        if(typeof result.subroll != "undefined") {
            var subroll = rollHelper.roll(result.subroll.dice);

            output.stellarOrbitalSeparation.distance = subroll.total + localChance.integer({ min: (subroll.multiplier * -1), max: subroll.multiplier });
            output.rolls.stellarOrbitalSeparationSubRoll = subroll;
        }

        // Cleanup
        delete output.stellarOrbitalSeparation.roll;

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
