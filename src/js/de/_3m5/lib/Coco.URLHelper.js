/**
 * Class: Coco.URLHelper
 *
 * Description:
 * Helper Class for URL activities like parsing etc.
 *
 * (c) 2013 3m5. Media GmbH
 */
'use strict';
module.exports = dejavu.Class.declare({
    $name: "Coco.URLHelper",

    initialize: function () {
        console.error("Do not instantiate static class: " + this.$name);
    },

    $finals: {
        $statics: {
            /**
             * Function: getUrlVars (static)
             *
             * Description:
             * {final static} parses current url for GET parameter
             *
             * Return:
             * @returns <Coco.HashMap> of given URL GET-Parameters
             */
            getUrlVars: function () {
                var vars = new Map();

                window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
                    vars.set(key, value);
                });

                return vars;
            }
        }
    }
});