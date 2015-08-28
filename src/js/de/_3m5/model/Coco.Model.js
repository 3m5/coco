var Coco = Coco || {};
Coco.ServiceProvider = Coco.ServiceProvider || require("../service/Coco.ServiceProvider.js");
Coco.Utils = Coco.Utils || require("../lib/Coco.Utils.js");
Coco.Collection = Coco.Collection || require("./Coco.Collection.js");
Coco.Event = require("../event/Coco.Event.js");
Coco.ModelEvent = require("../event/Coco.ModelEvent.js");

/**
 * Class: Coco.Model
 *
 * extends: <Coco.ServiceProvider>
 *
 * Description:
 * This class stores data and function to manipulate this data.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 *
 *     Events:
 *     <Coco.Event.ADD>:  callback(key, value, thisModel)             -        Triggered when and attribute has been added to the model
 *
 *     <Coco.Event.CHANGE>:  callback(newAttributes, thisModel, oldAttributes) -  Triggered when one attributes value has changed.
 *
 *     <Coco.Event.CHANGE_KEY>:  callback(newValue, thisModel, oldValue)   -   Triggered when a specific attributes value has changed.
 *
 *     <Coco.Event.INVALID>:  callback(returnOf_validate, thisModel)      -        Triggered when the models validation failed.
 *
 *     <Coco.Event.VALID>:  callback(thisModel)                         -        Triggered when the models validation passed.
 *
 *     <Coco.Event.DESTROY>:  callback(thisModel)                    -             Triggered before the model gets destroyed.
 */
module.exports = Coco.Model = dejavu.Class.declare({
    $name: 'Model',

    $extends: Coco.ServiceProvider,

    /**
     * The internal model id.
     */
    __id: 0,

    /**
     * A private class identifier, copied from `this.$name`
     */
    __$name: "Model",

    /**
     * The current attributes of the model.
     *
     * @type {Object}
     */
    __attributes: {},

    /**
     * The status of the attributes on instantiation. Used to check if the model has changed since it was created.
     *
     * @type {Object}
     */
    __initialAttributes: null,

    /**
     * Hold probable validation error. You can retrieve this with `this.getValidationError()`. It's set internally by
     * the `this.isValid()` method.
     *
     * @type {Object}
     */
    __validationError: null,

    /**
     * Array of observers registered by the $observe flag on computed functions.
     */
    __observers: [],

    /**
     * Variable: _defaults
     *
     * Description:
     * The default attributes that are assigned to each new instance of the model.
     * Default values can be overwritten on instantiation.
     *
     * @type {Object}
     */
    _defaults: {},

    /**
     * Variable: _etherKeys
     *
     * Description:
     * The ether keys, that can be demanded by all Coco.View instances.
     *
     * @type {Array}
     */
    _etherKeys: [],

    /**
     * Constructor.
     * It should not be necessary to overwrite this method in your subclass.
     *
     * Parameter:
     * @param {Object} $attributes  -   {optional}  The attributes that are set to the models attributes on creation.
     */
    initialize: function ($attributes) {
        this.__$name = this.$name;
        this.__id = Coco.Utils.uniqueId("m");

        if($attributes != null) {
            for(var i in this._defaults) {

                // Check if the value of the attributes key is a function and if so, delete it (because we don't want to overwrite the computed properties)
                if(this._defaults.hasOwnProperty(i) && typeof this._defaults[i] === 'function' && $attributes.hasOwnProperty(i)) {
                    delete $attributes[i];
                }
            }
        }

        this.__attributes = $.extend({}, this._defaults, ($attributes != null) ? $attributes : {});
        this.__attributes = this.__setObservers(this.__attributes);
        this.__initialAttributes = $.extend({}, this.__attributes);
        this._setCollections();
        this._onInitialize();
    },

    /**
     * Function: _onInitialize
     *
     * Description:
     * Is called at the end of the initialize method and acts like the hook in <Coco.View>
     *
     * @protected
     */
    _onInitialize: function () {
    },

    /**
     * Function: _setCollections
     *
     * Description:
     * Overwrite this function in your model if you have collections inside the model. You need to set the default
     *
     * parameters with `new <Coco.Collection> ()` to ensure that a new collection is created.
     *
     * @protected
     */
    _setCollections: function () {
    },

    /**
     * Sets the observers and assigns the correct context to the computed properties functions.
     *
     * @param attributes
     * @returns {*}
     * @private
     */
    __setObservers: function (attributes) {
        for (var i in attributes) {
            if (attributes.hasOwnProperty(i) && typeof attributes[i] === 'function' && attributes[i].hasObservers) {
                attributes[i] = attributes[i].call(this, i, this.__observers);
            }
        }

        return attributes;
    },

    /**
     * We trigger the target attribute keys, when an observed attribute changed.
     *
     * @param attribute
     * @private
     */
    __triggerObservers: function (attribute) {
        for (var i in this.__observers) {
            if (this.__observers.hasOwnProperty(i) && this.__observers[i].attribute === attribute) {
                var newValue = this.get(this.__observers[i].target);

                if (newValue !== this.__observers[i].old) {
                    //this.trigger(Coco.Event.CHANGE_KEY + this.__observers[i].target, newValue, this.__observers[i].old);
                    this._dispatchEvent(new Coco.ModelEvent(Coco.Event.CHANGE_KEY + this.__observers[i].target, this, this.__observers[i].target));
                    this.__observers[i].old = newValue;
                }
            }
        }
    },

    /**
     * Function: add
     * Adds a new key value pair(s) to the attributes. If key already exists, <Coco.Model.set> will be called instead.
     *
     * Parameter:
     * @param {string}  attribute   - The new attribute to add
     *
     * @param {*}       value       - The attributes value.
     *
     * Return:
     * @returns {Coco.Model}        - The <Coco.Model> instance.
     *
     * Event:
     * Triggers <Coco.Event.ADD> event if attribute did not exist before.
     */
    add: function (attribute, value) {
        var object = {};

        (typeof attribute === 'string') ? object[attribute] = value : object = attribute;

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                // Check for existing key in attributes
                if (!this.__attributes.hasOwnProperty(key)) {
                    // Key does not exist, so add it
                    this.__attributes[key] = object[key];

                    //this.trigger(Coco.Event.ADD, key, object[key], this);
                    this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, this));
                }
                else {
                    // Key exists, set new value
                    this.set(key, object[key]);
                }
            }
        }

        return this;
    },

    /**
     * Function: set
     * Sets one or more attributes.
     *
     * Parameter:
     * @param {string|object}   attribute   - If a string is given, Coco will use this value as key, if object is given, Coco will overwrite all matched attributes of the object.
     *
     * @param {*}               $value      - {optional} The attributes value, if attribute is a string.
     *
     * Return:
     * @returns {Coco.Model}        - The <Coco.Model> instance.
     *
     * Event:
     * Triggers <Coco.Event.CHANGE> event.
     *
     * Triggers <Coco.Event.CHANGE_KEY> value on each changes attribute.
     */
    set: function (attribute, $value) {
        var object = {};
        var oldObject = $.extend(true, {}, this.__attributes);
        var changed = false;

        (typeof attribute === 'string') ? object[attribute] = $value : object = attribute;

        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                this.__attributes[key] = object[key];

                // TODO: deep check for objects.
                if (object[key] !== oldObject[key]) {
                    changed = true;

                    // Throw special key changed event
                    //this.trigger(Coco.Event.CHANGE_KEY + key, object[key], this, oldObject[key]);
                    this._dispatchEvent(new Coco.ModelEvent(Coco.Event.CHANGE_KEY + key, this, key));

                    // Trigger all dependent computed attributes when an observed attribute changed.
                    this.__triggerObservers(key);
                }
            }
        }

        if (changed) {
            // Throw default changed event
            //this.trigger(Coco.Event.CHANGE, object, this, oldObject);
            this._dispatchEvent(new Coco.ModelEvent(Coco.Event.CHANGE, this));
        }


        return this;
    },

    /**
     * Function: get
     * Gets a value by key. If no key is passed the whole object is returned. This can be also achieved by calling `this.getAll`.
     *
     * Parameter:
     * @param {string}      $attribute  - {optional} The key to return the value of
     *
     * @param {integer}     $castTo     - {optional} Parse the value to given type. Should refer to a constant from `Coco.Util`
     *
     * @param {boolean}     $fix        - {optional} If set to `true` the casted value will be saved to the attributes.
     *
     * Return:
     * @returns {*} - The value of the key.
     *
     * Event:
     * Triggers <Coco.Event.CHANGE> and <Coco.Event.Event_CHANGE_KEY> events, if $fix is set to true.
     */
    get: function ($attribute, $castTo, $fix) {
        if ($attribute == null) {
            // Return all attributes of this model
            var ret = {};

            for(var i in this.__attributes) {
                if(this.__attributes.hasOwnProperty(i)) {
                    ret[i] = (typeof this.__attributes[i] === 'function' && this.__attributes[i].hasObservers) ? this.__attributes[i]() : this.__attributes[i];
                }
            }

            return ret;
        }

        if ($castTo == null) {
            // Return value of given key
            if (this.__attributes.hasOwnProperty($attribute)) {
                // If value is a function, call it
                if (typeof this.__attributes[$attribute] === 'function') {
                    return this.__attributes[$attribute].call(this);
                }

                return this.__attributes[$attribute];
            }
            else {
                throw new Error("Tried to get '" + $attribute + "' in model '" + this.$name + "'. The key does not exist. Maybe you have a typo.");
            }
        }

        if ($fix == null) {
            console.log("Coco.Utils.cast ... ???");
            return (this.__attributes.hasOwnProperty($attribute)) ? Coco.Utils.cast(this.__attributes[$attribute], $castTo, $attribute) : null;
        }

        if (this.__attributes.hasOwnProperty($attribute)) {
            // Save casted value into this attributes
            this.cast($attribute, $castTo);

            return this.__attributes[$attribute];
        }

        throw new Error("Tried to get '" + $attribute + "' in model '" + this.$name + "'. The key does not exist. Maybe you have a typo.");
    },

    /**
     * Function: boundGet
     * A bound variant of <Coco.Model.get>
     *
     * Parameter:
     * @param {string}      $key      - {optional} The key to return the value of
     * @param {integer}     $castTo   - {optional} Parse the value to given type. Should refer to a constant from `Coco.Util`
     * @param {boolean}     $fix      - {optional} If set to `true` the casted value will be saved to the attributes.
     *
     * Return:
     * @returns {*} - The value of the key
     */
    boundGet: function ($key, $castTo, $fix) {
        return this.get($key, $castTo, $fix);
    }.$bound(),

    /**
     * Function: getAttributes
     * Returns the attributes object.
     *
     * Return:
     * @returns {Object} - All attributes of the model instance.
     */
    getAttributes: function () {
        var attributes = {};
        var keys = this.getKeys();

        for(var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = this.get(key);

            if(value instanceof Coco.Model) {
                //resolve all Coco.Models
                value = value.getAttributes();
            }

            if(value instanceof Coco.Collection) {
                //resolve all Coco.Collections
                value = value.getAllAttributes();
            }

            if(value instanceof Array) {
                //search for Coco.Models within an array
                var val = [];

                for(var j = 0; j < value.length; j++) {
                    var innerValue = value[j];

                    if(innerValue instanceof Coco.Model) {
                        innerValue = innerValue.getAttributes();
                    }

                    if(innerValue instanceof Coco.Collection) {
                        innerValue = innerValue.getAllAttributes();
                    }

                    val.push(innerValue);
                }

                value = val;
            }

            attributes[key] = value;
        }

        return attributes;
    },

    /**
     * Function: getKeys
     * Returns all attribute keys as an array.
     *
     * Return:
     * @return {Array} - All attribute keys of the model instance as an Array.
     */
    getKeys: function () {
        // Check for ECMA5
        if (typeof Object.keys === "function") {
            return Object.keys(this.__attributes);
        }

        var keys = [];

        for (var k in this.__attributes) {
            if (this.__attributes.hasOwnProperty(k)) {
                keys.push(k);
            }
        }

        return keys;
    },

    /**
     * Function: has
     * Returns `true` if the value is defined, otherwise `false`.
     *
     * Parameter:
     * @param {string}      key       - The attribute to check for it's existence.
     *
     * @param {boolean}     $strict   - {optional} If set to true, also attributes with the value null will return false
     *
     * Return:
     * @return {boolean} - True if the key exists, otherwise false.
     */
    has: function (key, $strict) {
        if ($strict) {
            // Check also for defined value
            return (this.__attributes.hasOwnProperty(key) && this.__attributes[key] != null && this.__attributes[key].length !== 0);
        }

        // Check only for key
        return (this.__attributes.hasOwnProperty(key));
    },

    /**
     * Function: is
     * Checks if `key` is type of the parameter `type`.
     *
     * Parameter:
     * @param {string}       attribute - The models attribute to check
     * @param {integer}      type      - The type to check for. Should refer to a constant from `Coco.Util`
     *
     * Return:
     * @return {boolean}    True if the typed is matched, otherwise false.
     */
    is: function (attribute, type) {
        console.log("Coco.Utils. type");
        if (!this.__attributes.hasOwnProperty(attribute)) {
            return type === Coco.Utils.UNDEFINED;
        }

        var value = this.__attributes[attribute];

        switch (type) {
            case Coco.Utils.INTEGER:
                return (typeof value === 'number' && value % 1 == 0);

            case Coco.Utils.FLOAT:
                // Returns false, if we have an integer value or sth like this: 1.0
                return (typeof value === 'number' && value % 1 != 0);

            case Coco.Utils.STRING:
                return (typeof value === 'string');

            case Coco.Utils.ARRAY:
                return (value instanceof Array);

            case Coco.Utils.OBJECT:
                return (typeof value === 'object' && !(value instanceof Array));

            case Coco.Utils.NULL:
                return (value === null);

            default:
                return false;
        }
    },

    /**
     * Function: remove($key)
     * Removes a key from the model.
     *
     * Parameter:
     * @param {string}  key    -    The key to remove.
     */
    remove: function (key) {
        if(this.has(key)) {
            delete this.__attributes[key];
        }
    },

    /**
     * Function reset
     * Resets the attributes of a model to its defaults.
     *
     * Parameter:
     * @param {boolean} $toDefaults - {optional} if set to true the model will be reset with the `this._defaults` object.
     *
     * Event:
     * Triggers <Coco.Event.RESET> event.
     */
    reset: function ($toDefaults) {
        var collections = {};

        for (var i in this.__attributes) {
            if (this.__attributes.hasOwnProperty(i) && this.__attributes[i] instanceof Coco.Event) {
                collections[i] = this.__attributes[i].reset();
            }
        }

        if ($toDefaults) {
            this.__attributes = $.extend({}, this._defaults, collections);
            this.__initialAttributes = $.extend({}, this.__attributes);
        }
        else {
            this.__attributes = $.extend({}, this.__initialAttributes, collections);
        }

        //this.trigger(Coco.Event.RESET);
        this._dispatchEvent(new Coco.ModelEvent(Coco.Event.RESET, this));
    },

    /**
     * Function: cast
     * Casts a attributes value to given `type` and stores it to the attributes.
     *
     * Parameter:
     * @param {string}   attribute  - The attribute key
     * @param {integer}  type       - The type to cast to. Should refer to a constant from `Coco.Utils`
     *
     * Return:
     * @return {*} - The casted value of the attribute.
     *
     * Event:
     * See <Coco.Model.set> for information what events are triggered.
     */
    cast: function (attribute, type) {
        this.set(attribute, Coco.Utils.cast(this.get(attribute), type, attribute));

        return this.get(attribute);
    },

    /**
     * Function: isValid
     * Checks if model is valid by calling user specified `this._validate` function.
     *
     * Return:
     * @return {boolean}
     *
     * Event:
     * @event Triggers `invalid` if model validation failed, otherwise `valid`
     */
    isValid: function () {
        this.__validationError = null;
        result = this._validate(this.getAttributes());

        if (result !== true) {
            this.__validationError = result;

            //this.trigger(Coco.Event.INVALID, result, this);
            this._dispatchEvent(new Coco.ModelEvent(Coco.Event.INVALID, this));

            return false;
        }
        else {
            //this.trigger(Coco.Event.VALID, this);
            this._dispatchEvent(new Coco.ModelEvent(Coco.Event.VALID, this));
        }

        return true;
    },

    /**
     * Function: _validate
     * Is called by `this.isValid` from within the model. Return anything but `true` to indicate that the validation failed.
     *
     * Parameter:
     * @param {object}  attrs   - The attributes of the model
     *
     * Return:
     * @return {*}
     *
     * @protected
     */
    _validate: function (attrs) {
        return true;
    },

    /**
     * Function: getValidationError
     * Returns the validation errors.
     *
     * Return:
     * @return {null|Object}
     */
    getValidationError: function () {
        return this.__validationError;
    },

    /**
     * Function: getEtherKeys
     * Returns the ether keys.
     *
     * Return:
     * @return {Array}
     */
    getEtherKeys: function () {
        return this._etherKeys;
    },

    /**
     * Function: getId
     * Returns the internal id. Useful for comparison between different objects. If two object have the same id,
     * they are identical.
     *
     * Return:
     * @return {string}
     */
    getId: function () {
        return this.__id;
    },

    /**
     * Function: isEqual
     * Checks if two models are the same
     *
     * Parameter:
     * @param {Coco.Model} model - The <Coco.Model> instance
     *
     * Return:
     * @return {boolean} - True if both are equal.
     */
    isEqual: function (model) {
        return this.__id === model.getId();
    },

    /**
     * Function: destroy
     * Destroy the model
     */
    destroy: function () {
        //this.trigger(Coco.Event.DESTROY, this);
        this._dispatchEvent(new Coco.ModelEvent(Coco.Event.DESTROY, this));
        this.stopListening();
    }
});