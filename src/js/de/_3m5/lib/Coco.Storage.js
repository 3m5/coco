/**
 * Class: Coco.Storage
 * This class abstracts the very simple LocalStorage API.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
    $name: 'Storage',

    $statics: {
        /**
         * holds a boolean, that checks if the localStorage is available.
         */
        isAvailable: (window.localStorage != null),

        /**
         * Function: has(key)
         *
         * Description:
         * Checks if the key is in the localStorage.
         *
         * Parameter:
         * @param {string} key
         *
         * Return:
         * @returns {boolean}
         */
        has: function (key) {
            if (this.isAvailable) {
                return window.localStorage.hasOwnProperty(key);
            }
        },

        /**
         * Function: get(key)
         *
         * Description:
         * Returns the value of the key.
         * If value is an object, the method will try to parse it and then return the parsed object.
         *
         * Parameter:
         * @param {string}  key
         *
         * Return:
         * @returns {*}
         */
        get: function (key) {
            if (this.isAvailable) {
                var value = window.localStorage.getItem(key);

                try {
                    value = JSON.parse(value);
                } catch (e) {
                }

                return value;
            }

            return null;
        },

        /**
         * Function: set(key, value)
         *
         * Description:
         * Saves a key and it's value to the localStorage.
         * If the value is an object, the function will stringify it.
         *
         * Parameter:
         * @param {string}  key
         * @param {*}       value
         */
        set: function (key, value) {
            if (this.isAvailable) {
                if (typeof value === 'object') {
                    value = JSON.stringify(value);
                }

                window.localStorage.setItem(key, value);
            }
        },

        /**
         * Function: copy(sourceKey, targetKey, $deleteSource)
         *
         * Description:
         * Copies a value to another destination.
         *
         * @param {string}  sourceKey       -   Where lives the value that should be copied
         * @param {string}  targetKey       -   The destination
         * @param {boolean} $deleteSource   -   {optional}  If set to true the sourceKey will be deleted.
         */
        copy: function (sourceKey, targetKey, $deleteSource) {
            if (this.isAvailable) {
                if (window.localStorage.hasOwnProperty(sourceKey)) {
                    window.localStorage.setItem(targetKey, window.localStorage.getItem(sourceKey));
                }

                if ($deleteSource) {
                    window.localStorage.removeItem(sourceKey);
                }
            }
        },

        /**
         * Function: remove(key)
         *
         * Description:
         * Removes a key and it's value from the localStorage.
         *
         * Parameter:
         * @param {string} key
         */
        remove: function (key) {
            if (this.isAvailable) {
                window.localStorage.removeItem(key);
            }
        },

        /**
         * Function: clear()
         *
         * Description:
         * Clears the locationStorage.
         */
        clear: function () {
            if (this.isAvailable) {
                window.localStorage.clear();
            }
        },

        /**
         * Function: getUsedSpace()
         *
         * Description:
         * Returns the number of kilobyte of memory the localStorage has taken.
         *
         * Return:
         * @returns {null|Number}
         */
        getUsedSpace: function ($key) {
            if (this.isAvailable) {
                var values = '';

                if($key) {
                    values = window.localStorage.hasOwnProperty($key) ? window.localStorage.getItem($key) : '';
                }
                else {
                    for (var key in window.localStorage) {
                        if (window.localStorage.hasOwnProperty(key)) {
                            values += window.localStorage[key];
                        }
                    }
                }

                return values ? 3 + ((values.length * 16) / (8 * 1024)) : 0;
            }

            return null;
        }
    }
});