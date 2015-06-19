/**
 * Class: Coco.Math
 *
 * Math Helper Class
 *
 * (c) Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
    $name: "Math",

    $finals: {
        $statics: {
            /**
             * Function: {final static}  isNumber(x)
             *
             * Description:
             * checks if a given variable is a number
             *
             * returns:
             *
             * boolean
             */
            isNumber: function (x) {
                return (!isNaN(parseFloat(x)));
            },

            /**
             * Function: {final static} round(value, precision)
             *
             * Description:
             * rounds a float to a given precision.
             *
             * Parameter:
             * @param {Number} value        -   The value to round.
             * @param {Number} $precision   -   {optional} The number of decimals. If omitted, the function will round to an Integer
             *
             * Return:
             * @returns {number}
             */
            round: function (value, $precision) {
                $precision = ($precision != null) ? $precision : 0;

                return Math.round((value + 0.0000001) * Math.pow(10, $precision)) / Math.pow(10, $precision);
            },

            /**
             * Function: {final static} random(noOfDigits)
             *
             * Description:
             */
            random: function(noOfDigits) {
                var charset = '123456789';
                var ret = '';

                for(var i = 0; i < noOfDigits; i++) {
                    ret += charset.substr(Math.floor(Math.random() * 9), 1);
                }

                return parseInt(ret);
            }
        }
    }
});