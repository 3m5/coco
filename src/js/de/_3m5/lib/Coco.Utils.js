var Coco = Coco || {};

/**
 * Class: Coco.Utils
 *
 * Description:
 * This class holds several helping function, like a caster or a .hbs parser.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
    $name: "Utils",

    /**
     * Constants:
     * These constants are used to cast or type test variables.
     *
     * @public
     */
    $constants: {
        /**
         * Constant: BOOLEAN
         *
         * for boolean casting
         *
         */
        BOOLEAN: 0,
        /**
         * Constant: INTEGER
         *
         * for integer casting
         */
        INTEGER: 1,

        /**
         * Constant: FLOAT
         *
         * for float casting
         */
        FLOAT: 2,

        /**
         * Constant: STRING
         *
         * for string casting
         */
        STRING: 3,

        /**
         * Constant: OBJECT
         *
         * for object casting
         */
        OBJECT: 4,

        /**
         * Constant: ARRAY
         *
         * for array casting
         */
        ARRAY: 5,

        /**
         * Constant: NULL
         *
         * for null casting
         */
        NULL: 6,

        /**
         * Constant: UNDEFINED
         *
         * for undefined casting
         */
        UNDEFINED: 99
    },

    $statics: {
        __id: 0
    },

    $finals: {
        $statics: {
            /**
             * Function: uniqueId
             *
             * Description:
             * {final static} Generates a unique id with an optional prefix. Be careful: It's only unique if all generated ids use the
             * same function and it's only unique while lifetime of application.
             *
             * Parameter:
             * @param {string}  $prefix     -   {optional} optional prefix for unique id. Is not allowed to contain a number.
             *
             * Return:
             * @returns {string|number} - created unique id
             */
            uniqueId: function ($prefix) {
                if(/[0-9]$/.test($prefix)) {
                    throw new Error("$prefix is not allowed to end with a number in Coco.Utils.uniqueId().");
                }

                var id = ++this.$static.__id + '';

                return $prefix ? "" + $prefix + id : id;
            },

            /**
             * Function: randomId
             *
             * Description:
             * {final static} Generates a random id with an optional prefix.
             *
             * Parameter:
             * @param {string}  $prefix     -   {optional} optional prefix for random id.
             *
             * Return:
             * @returns {string|number} - created random id
             */
            randomId: function ($prefix) {
                var rand = window.btoa(Math.floor(Math.random() * 5000000) + '' + new Date().getTime() + '' + (++this.__id));

                return $prefix ? "" + $prefix + rand.substr(0, 32) : rand.substr(0, 32);
            },

            /**
             * Function: isMobile : {Android, BlackBerry, iOS, Opera, Windows, any}
             *
             * {final static} object for mobile detection
             */
            isMobile : {
                /**
                 * Function: isMobile.Android
                 *
                 * returns matched navigator String if Android device detected, otherwise null
                 */
                Android: function() {
                    return navigator && navigator.userAgent && navigator.userAgent.match(/Android/i);
                },
                /**
                 * Function: isMobile.BlackBerry
                 *
                 * returns matched navigator String if BlackBerry device detected, otherwise null
                 */
                BlackBerry: function() {
                    return navigator && navigator.userAgent && navigator.userAgent.match(/BlackBerry/i);
                },
                /**
                 * Function: isMobile.BlackBerry
                 *
                 * returns matched navigator String if BlackBerry device detected, otherwise null
                 */
                iOS: function() {
                    return navigator && navigator.userAgent && navigator.userAgent.match(/iPhone|iPad|iPod/i);
                },
                /**
                 * Function: isMobile.Opera
                 *
                 * returns matched navigator String if Opera Mini device detected, otherwise null
                 */
                Opera: function() {
                    return navigator && navigator.userAgent && navigator.userAgent.match(/Opera Mini/i);
                },
                /**
                 * Function: isMobile.Windows
                 *
                 * returns matched navigator String if IEMobile device detected, otherwise null
                 */
                Windows: function() {
                    return navigator && navigator.userAgent && navigator.userAgent.match(/IEMobile/i);
                },
                /**
                 * Function: isMobile.any
                 *
                 * returns matched navigator String if any mobile device detected, otherwise null
                 */
                any: function() {
                    return (Coco.Utils.isMobile.Android() || Coco.Utils.isMobile.BlackBerry() || Coco.Utils.isMobile.iOS() || Coco.Utils.isMobile.Opera() || Coco.Utils.isMobile.Windows());
                }
            },

            /**
             * Function: cast
             *
             * Description:
             * {final static} Cast value to a specific type.
             *
             * Parameter:
             * @param {*} value   -  The value to cast
             *
             * @param {Number} type  - The type to cast the value to. Should refer to <Coco.Utils.Constants>
             *
             * @param {string|Number}   $key - optional $key is needed if type is Coco.Util.OBJECT
             */
            cast: function (value, type, $key) {
                switch (type) {
                    case Coco.Utils.INTEGER:
                        return parseInt(value, 10);

                    case Coco.Utils.BOOLEAN:
                        return parseInt(value, 10) === 1 || value === "true" || value === "1";

                    case Coco.Utils.FLOAT:
                        return parseFloat(value);

                    case Coco.Utils.STRING:
                        return (value).toString();

                    case Coco.Utils.ARRAY:
                        return (value instanceof Array) ? value : [value];

                    case Coco.Utils.OBJECT:
                        if (typeof value === 'object') {
                            return value;
                        }

                        if (typeof $key !== 'undefined') {
                            var o = {};
                            o[$key] = value;

                            return o;
                        }

                        throw new Error('Cannot cast value ' + value + ' to object because no $key is given in Coco.Utils.cast().');
                        break;

                    case Coco.Utils.NULL:
                        return null;

                    default:
                        return value;
                }
            }
        }
    }
});