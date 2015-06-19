var Coco = Coco || {};
/**
 * Class: Coco.HashMap
 * v1.0
 *
 * Description:
 * HashMap is a key-value array
 *
 */
module.exports = dejavu.Class.declare({
    $name: "HashMap",

    __hashmap: null,

    __keys: null,

    initialize: function () {
        this.__hashmap = {};
        this.__keys = [];
    },

    /**
     * Function: getValue
     * returns stored object for given key
     *
     * Parameter:
     * (String)key to identify object
     *
     * Returns:
     * object value
     */
    getValue: function (key) {
        return this.__hashmap[key];
    },

    /**
     * Function: getKeys
     *
     * @returns array of keys
     */
    getKeys: function () {
        return this.__keys;
    },

    /**
     * Function: put
     * Puts a value with the given key to the map.
     *
     * Parameter:
     * @param {Number} key
     * @param {Object} value
     */
    put: function (key, value) {
        if (value === undefined || key == null) {
            //cannot set property of undefined
            return;
        }

        this.__hashmap[key] = value;

        if (this.__keys.indexOf(key) < 0) {
            this.__keys.push(key);
        }
    },

    /**
     * Function: remove
     * Removes value by given key.
     *
     * Parameter:
     * @param {Number} key
     * @param {Object} value
     */
    remove: function(key) {
        if (key == null) {
            //cannot set property of undefined
            return;
        }
        delete this.__hashmap[key];
        var index = this.__keys.indexOf(key);
        if(index > -1) {
            this.__keys = this.__keys.splice(index, 1);
        }
    },

    /**
     * Function length
     * @returns (int) length of current object}
     */
    length: function () {
        return this.__keys.length;
    }
});