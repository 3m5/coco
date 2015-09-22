/**
 * Class: Coco.StringUtils
 *
 * Description:
 *
 * {static} Class
 *
 * (c) 2013 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
    $name: "Coco.StringUtils",

    initialize: function () {
        console.error("Do not instantiate static class: " + this.$name);
    },

    $finals: {
        $statics: {
            /**
             * Function: {final static}  isEmpty
             *
             * Description:
             *
             * checks if given string is null or empty
             *
             * returns:
             *
             * boolean
             */
            isEmpty: function (string) {
                return string == null || string === "" || string.length === 0;
            }
        }
    }
});