/*
 * Template Table and Functions
 */

window.systemName = (function () {
    var localChance = new Chance(new Date());

    var prefixTableParameters = {
        code: "generator.starName.type.prefix"
    };

    var suffixTableParameters = {
        code: "generator.starName.type.suffix"
    };

    var settings = {
        dice: {
            rollFunction: localChance.d6,
            iterations: 3,
            maxRoll: 19,
            minRoll: 3
        }
    };

    var prefixTable = null;
    var suffixTable = null;

    var prefixTablePromise = null;
    var suffixTablePromise = null;

    // Generate Table
    function generatePrefixTable() {
        if(prefixTable == null) {
            prefixTablePromise = tableHelper.getTable("./data/system-name/system-name-prefix.json", {});
            modifiersPromise = tableHelper.getModifiers("./data/system-name/system-name-prefix-modifiers.json");

            prefixTable = prefixTablePromise.then(function (data) {
                return data;
            });

            prefixTable = getPrefixTable();
        }

        return prefixTablePromise;
    }

    function generateSuffixTable() {
        if(suffixTable == null) {
            suffixTablePromise = tableHelper.getTable("./data/system-name/system-name-suffix.json", {});
            modifiersPromise = tableHelper.getModifiers("./data/system-name/system-name-suffix-modifiers.json");

            suffixTable = suffixTablePromise.then(function (data) {
                return data;
            });

            suffixTable = getSuffixTable();
        }

        return suffixTablePromise;
    }

    function getPrefixTable() {
        prefixTablePromise.done(function(data){
            systemName.prefixTable = data;
        });

        return systemName.prefixTable;
    }

    function getSuffixTable() {
        suffixTablePromise.done(function(data){
            systemName.suffixTable = data;
        });

        return systemName.suffixTable;
    }

    // Roll on Table 3d6
    function roll() {
        return rollFn(getPrefixTable(), getSuffixTable());
    }

    function rollFn(prefixSource, suffixSource) {
        var prefixRoll = rollHelper.rollTable(prefixSource);
        var suffixRoll = rollHelper.rollTable(suffixSource);

        var prefixResult = resultHelper.getFromTable(prefixSource, prefixRoll);
        var suffixResult = resultHelper.getFromTable(suffixSource, suffixRoll);

        // Format Output
        var output = {
            systemName: {
                name: prefixResult.name + suffixResult.name,
                prefix: resultHelper.clone(prefixResult),
                suffix: resultHelper.clone(suffixResult),
            },
            rolls: {
                systemNamePrefix: prefixRoll,
                systemNameSuffix: suffixRoll
            }
        };

        // Cleanup
        // delete output.systemName.roll;

        return output;
    }

    // Return Methods and Values
    return {
        settings: settings,
        prefixTable: prefixTable,
        suffixTable: suffixTable,
        generatePrefixTable: generatePrefixTable,
        generateSuffixTable: generateSuffixTable,
        getPrefixTable: getPrefixTable,
        getSuffixTable: getSuffixTable,
        roll: roll
    };
})();
