var Coco = Coco || {};
var _ = require("underscore");
Coco.Event = require("../event/Coco.Event.js");
Coco.EventDispatcher = require("../event/Coco.EventDispatcher.js");
Coco.ModelEvent = require("../event/Coco.ModelEvent.js");
Coco.Utils = require("../lib/Coco.Utils.js");
Coco.Model = require("./Coco.Model.js");
Coco.Math = require("../lib/Coco.Math.js");
/**
 * Class: Coco.Collection
 *
 * extends: <Coco.Event>
 *
 * Description:
 * This class holds an array of model instances and provides some helping functions.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
	$name: 'Collection',

	$extends: Coco.EventDispatcher,

	/**
	 * The internal collection id.
	 */
	__id: null,

	/**
	 * A private class identifier, copied from `this.$name`
	 */
	__$name: "Collection",

	/**
	 * Variable: _models
	 * {protected} Array of Coco.Model objects.
	 */
	_models: [],

	/**
	 * Variable: __handles
	 * {private} Map of EventListener-handles for models from _models-Array
	 */
	__handles: null,

	/**
	 * Variable: _modelClass
	 * The class of the models. Calling <Coco.Collection.createOne> and <Coco.Collection.add> will always add models
	 * with the class referred here.
	 * {protected}
	 */
	_modelClass: null,

	/**
	 * Function: Constructor
	 *
	 * Parameter:
	 * @param {Array}   $models -   The models to add initial.
	 */
	initialize: function ($models) {
		if (this._modelClass == null || !this._modelClass.prototype || (this._modelClass.prototype.__$name !== 'Model' && this._modelClass.$parent && this._modelClass.$parent.prototype.__$name !== 'Model' )) {
			throw new Error("Cannot create Collection '" + this.$name + "' with '_modelClass' being null or not extending from Coco.Model.");
		}

		this.__$name = this.$name;
		this.__id = Coco.Utils.uniqueId("c");

		this.__handles = new Map();

		this._onInitialize($models);

		if ($models != null) {
			this.add($models);
		}
	},

	/**
	 * Function: _onInitialize
	 * Function is called after class is initialized, but BEFORE models are added.
	 *
	 * Parameter:
	 * @param {Array}   $models -   The models to add initial. You can change those by altering the this parameter.
	 */
	_onInitialize: function ($models) {
	},

	/**
	 * Function: add
	 * Adds an array of models to the collection. This can be either an instance of Coco.Model or attributes or an Array
	 * containing one of both.
	 *
	 * Parameter:
	 * @param {Coco.Model|Object|Array} attributes  - Array of models to add.
	 *
	 * Event:
	 * Triggers <Coco.Event.ADD> event with each model that has been added.
	 */
	add: function (attributes) {
		if (attributes == null) {
			return;
		}

		if (!(attributes instanceof Array)) {
			attributes = [attributes];
		}

		var model = null;

		for (var i = 0; i < attributes.length; i++) {
			if (attributes[i] == null) {
				continue;
			}

			// If attribute is a model store it, otherwise create a new model and set it's attributes.
			model = (!(attributes[i] instanceof this._modelClass)) ? new this._modelClass(attributes[i]) : attributes[i];

			var handle = model.addEventListener(Coco.Event.DESTROY, (event) => {
				this.__onModelDestroy(event);
			}, true);
			this._models.push(model);
			this._addModelHandle(handle, model);

			this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, model));
		}

	},

	/**
	 * Function: _addModelHandle
	 *
	 * stores all handles for one model, to delete eventlistener, after rmoving model from collection
	 *
	 * Parameter:
	 * @param {Coco.Model} model - model to add handle for
	 *
	 * @param {Symbol} handle - handle to add
	 *
	 * @protected
	 */
		_addModelHandle(handle, model) {
		var mh = this.__handles.get(model.getId());
		if (mh == null) {
			mh = [];
		}
		mh.push(handle);
		this.__handles.set(model.getId(), mh);
	},

	/**
	 * Function: _removeModelHandles
	 *
	 * removes all handles for given model
	 *
	 * Parameter:
	 * @param {Coco.Model} model - model to remove EventListener from
	 * @protected
	 */
		_removeModelHandles(model) {
		var mh = this.__handles.get(model.getId());
		if (mh != null && mh.length > 0) {
			for (var i = 0; i < mh.length; i++) {
				model.removeEventListener(mh[i]);
			}
		}
		this.__handles.delete(model.getId());
	},

	/**
	 * Function: insertAt
	 * Add a model a the specified index to the collection
	 *
	 * Parameter:
	 * @param {integer}  index      - The index position.
	 *
	 * @param {Coco.Model}  model   - The <Coco.Model> instance to add.
	 *
	 * Event:
	 * Triggers <Coco.Event.ADD> event
	 */
	insertAt: function (index, model) {
		if (model instanceof this._modelClass) {
			if (index >= 0 && index <= this._models.length) {
				this._models.splice(index, 0, model);
				this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, model));
			} else {
				throw new Error("index out of bound error");
			}
		}
	},

	/**
	 * Function: createOne
	 * Creates a new model based on given attributes.
	 *
	 * Parameter:
	 * @param {Object} $attributes  - {optional} The attributes the new model should have.
	 *
	 * Return:
	 * @return {Coco.Model}         - The created model.
	 *
	 * Event:
	 * Triggers <Coco.Event.ADD> event.
	 */
	createOne: function ($attributes) {
		if ($attributes instanceof this._modelClass) {
			return null;
		}

		var model = new this._modelClass($attributes);

		var handle = model.addEventListener(Coco.Event.DESTROY, (event) => {
			this.__onModelDestroy(event);
		}, true);
		this._models.push(model);
		this._addModelHandle(handle, model);

		this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, model));

		return model;
	},

	/**
	 * Function: has
	 * checks for existing model in collection.
	 *
	 * Parameter:
	 * @param {Coco.Model} model    - An <Coco.Model> instance
	 *
	 * Return:
	 * @returns {boolean}           - True if model is in Collection
	 */
	has: function (model) {
		for (var i = 0; i < this._models.length; i++) {
			if (model.isEqual(this._models[i])) {
				return true;
			}
		}

		return false;
	},

	/**
	 * Function: reset
	 * Removes all models from the collection.
	 *
	 * Event:
	 * Triggers <Coco.Event.REMOVE> event for each model that gets removed.
	 *
	 * Triggers <Coco.Event.RESET> event.
	 *
	 * Return:
	 * @return {Coco.Collection}     - The <Coco.Collection> instance.
	 */
	reset: function () {
		for (var i = 0; i < this._models.length; i++) {
			//remove all model handles
			this._removeModelHandles(this._models[i]);
			this._dispatchEvent(new Coco.ModelEvent(Coco.Event.REMOVE, this._models[i]));
		}
		this._models = [];
		this._dispatchEvent(new Coco.ModelEvent(Coco.Event.RESET, this));

		return this;
	},

	/**
	 * Function: remove
	 * Removes one model.
	 *
	 * Parameter:
	 * @param {Coco.Model}  model     - The instance of <Coco.Model> to remove.
	 *
	 * @param {boolean}     $silent   - If set to true the model won't trigger the <Coco.Event.REMOVE> event.
	 *
	 * Event:
	 * Triggers <Coco.Event.REMOVE> event if $silent is not set to true.
	 */
	remove: function (model, $silent) {
		if(model == null) {
			console.warn(this.$name + ": can't delete null object!");
			return;
		}
		for (var i = 0; i < this._models.length; i++) {
			if (model.isEqual(this._models[i])) {
				this.removeAt(i, $silent);
				break;
			}
		}
	},

	/**
	 * Function: removeAt
	 * Removes model at specific index position.
	 *
	 * Parameter:
	 * @param {integer}     index    - The index position.
	 *
	 * @param {boolean}     $silent  - {optional} If set to true the model won't trigger the `remove` event.
	 *
	 * Event:
	 * Triggers <Coco.Event.REMOVE> event if $silent is not set to true.
	 */
	removeAt: function (index, $silent) {
		if (this._models.length > index) {
			var m = this._models.splice(index, 1);

			this._removeModelHandles(m[0]);

			if ($silent !== true) {
				this._dispatchEvent(new Coco.ModelEvent(Coco.Event.REMOVE, m[0]));
			}
		}
	},

	/**
	 * Function: getAt
	 * Gets model at specific index.
	 *
	 * Parameter:
	 * @param {integer}  index  - The index position.
	 *
	 * Return:
	 * @return {Coco.Model}     - The remove <Coco.Model> instance.
	 */
	getAt: function (index) {
		if (index >= this._models.length || index < 0) {
			return null;
		}

		return this._models[index];
	},

	/**
	 * Function: indexOf
	 * Gets the index of a model.
	 *
	 * Parameter:
	 * @param {Coco.Model}   model  - An <Coco.Model> instance
	 *
	 * Return:
	 * @return {Number}             - The index of the <Coco.Model> instance.
	 */
	indexOf: function (model) {
		for (var i = 0; i < this._models.length; i++) {
			if (model.isEqual(this._models[i])) {
				return i;
			}
		}

		return -1;
	},

	/**
	 * Function: getAll
	 * Gets all models as <Coco.Model> instances.
	 *
	 * Return:
	 * @return {Array} - Array of <Coco.Model> instances.
	 */
	getAll: function () {
		return this._models;
	},

	/**
	 * Function: getAllAttributes
	 * Gets all models. This returns an array of all attributes of all models, not the Coco.Model instances.
	 * every model has its own entry
	 *
	 * Return:
	 * @returns {Array} - Array of attributes of <Coco.Model> instances.
	 */
	getAllAttributes: function () {
		var models = [];

		$.each(this._models, function (i, e) {
			// Add all attributes of current model
			models.push(e.getAttributes());
		});

		return models;
	},

	/**
	 * Function: each
	 * Iterates over all objects in the collection and executes a given callback function for every model.
	 *
	 * If the callback returns false, the each function breaks.
	 *
	 * Parameter:
	 * @param {Function}    callback    - The method to execute for each model. Parameters are Coco.Model instance and index.
	 */
	each: function (callback) {
		if (this._models == null) {
			return false;
		}
		for (var i = 0; i < this._models.length; i++) {
			if (callback(this._models[i], i) === false) {
				break;
			}
		}
	},

	/**
	 * Function: push
	 * Adds a model at the end of the collection.
	 *
	 * Parameter:
	 * @param {Coco.Model}  model   - The <Coco.Model> instance to add.
	 *
	 * Event:
	 * Triggers <Coco.Event.ADD> event
	 */
	push: function (model) {
		if (model instanceof this._modelClass) {
			var handle = model.addEventListener(Coco.Event.DESTROY, (event) => {
				this.__onModelDestroy(event);
			}, true);
			this._models.push(model);
			this._addModelHandle(handle, model);

			this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, model));
		}
	},

	/**
	 * Function: pop
	 * Removes and returns the last model from the collection.
	 *
	 * Return
	 * @return {Coco.Model} - The removed <Coco.Model> instance.
	 *
	 * Event:
	 * Triggers <Coco.Event.REMOVE> event
	 */
	pop: function () {
		var model = this._models.pop();

		this._dispatchEvent(new Coco.ModelEvent(Coco.Event.REMOVE, model));

		return model;
	},

	/**
	 * Function: unshift
	 * Adds a model at the beginning of the collection.
	 *
	 * Parameter:
	 * @param {Coco.Model}  model   - The <Coco.Model> instance to add.
	 *
	 * Event:
	 * Triggers <Coco.Event.ADD> event
	 */
	unshift: function (model) {
		if (model instanceof this._modelClass) {
			//TODO ????
			//this._removeModelHandles(model);
			this._dispatchEvent(new Coco.ModelEvent(Coco.Event.ADD, model));
			return this._models.unshift(model);
		}
	},

	/**
	 * Function: shift
	 * Removes and returns the first model from the collection.
	 *
	 * Return:
	 * @return {Coco.Model} - The removed <Coco.Model> instance.
	 *
	 * Event:
	 * Triggers <Coco.Event.REMOVE> event
	 */
	shift: function () {
		var model = this._models.shift();

		this._dispatchEvent(new Coco.ModelEvent(Coco.Event.REMOVE, model));

		return model;
	},

	/**
	 * Function: findBy
	 * Finds models by given query object. The object contains attributes and their values and findBy will match this
	 * against the collections models.
	 *
	 * Parameter:
	 * @param {object}  query   - The object of attributes and values to look for in the collection.
	 *
	 * Return:
	 * @return {Array}          - Array of matched <Coco.Model> instances.
	 */
	findBy: function (query) {
		var models = [];
		var valid = false;

		$.each(this._models, function (i, e) {
			valid = true;

			$.each(query, function (key, value) {
				if (!e.has(key) || e.get(key) != value) {
					valid = false;

					return false;
				}
			});

			if (valid) {
				models.push(e);
			}
		});

		return models;
	},

	/**
	 * Function: findOneBy
	 * Acts like findBy but returns the first matched model.
	 *
	 * Parameter:
	 * @param {object}  query       - The object of attributes and values to look for in the collection.
	 *
	 * Return:
	 * @return {Coco.Model|null}    - First matched <Coco.Model> instance of null.
	 */
	findOneBy: function (query) {
		var model = null;
		var valid = false;

		$.each(this._models, function (i, e) {
			valid = true;

			$.each(query, function (key, value) {
				if (!e.has(key) || e.get(key) != value) {
					valid = false;

					return false;
				}
			});

			if (valid) {
				model = e;

				return false;
			}
		});

		return model;
	},

	/**
	 * Function: removeBy
	 * removes all matched models from current collection
	 *
	 * Parameter:
	 * @param {object}  query       - The object of attributes and values to look for in the collection.
	 *
	 * Return:
	 * @return {Array} - all removed models
	 */
	removeBy: function removeBy(query, $silent) {
		var models = [];
		var modelIndex = [];
		var valid;
		$.each(this._models, function (i, e) {
			valid = true;

			$.each(query, function (key, value) {
				if (!e.has(key) || e.get(key) != value) {
					valid = false;

					return false;
				}
			});

			if (valid) {
				models.push(e);
				modelIndex.push(i);
			}
		});

		_.each(modelIndex, (index) => {
			this.removeAt(index, $silent);
		});

		return models;
	},

	/**
	 * Function: sortByProperty
	 * sorts all models in collection by property
	 *
	 * Parameter:
	 * @param {String }propertyName - name of property to sort on
	 *
	 * @param {boolean} $descending - (optional) sort direction: descending (default) == true
	 */
	sortByProperty: function (propertyName, $descending) {
		if ($descending == null) {
			$descending = true;
		}

		var val;

		this._models.sort(function (a, b) {
			if (a === b) {
				return 0;
			}

			if (a == null) {
				//b is not null
				return $descending ? 1 : -1;
			}

			if (b == null) {
				//a is not null
				return $descending ? -1 : 1;
			}

			if (a.get(propertyName) === b.get(propertyName)) {
				return 0;
			}

			if (a.get(propertyName) == null) {
				return $descending ? 1 : -1;
			}

			if (b.get(propertyName) == null) {
				return $descending ? -1 : 1;
			}

			if (Coco.Math.isNumber(a.get(propertyName))) {
				val = parseFloat(a.get(propertyName)) < parseFloat(b.get(propertyName)) ? 1 : (parseFloat(a.get(propertyName)) === parseFloat(b.get(propertyName)) ? 0 : -1);
				return $descending ? val : (-1 * val);
			}

			val = a.get(propertyName) < b.get(propertyName) ? 1 : (a.get(propertyName) === b.get(propertyName) ? 0 : -1);

			return $descending ? val : (-1 * val);
		});
	},

	/**
	 * Function: size
	 * Returns the size of the collection.
	 *
	 * Return:
	 * @return {integer} - The size of the collection.
	 */
	size: function () {
		return this._models.length;
	},

	/**
	 * Function: where
	 *
	 * Description:
	 * Looks through each value in the list, filters models by given object properties
	 *
	 * @return {array} - returning an array of all the values that contain all of the key-value pairs listed in properties.
	 */
		where(propertyObject) {
		return _.where(this.getAllAttributes(), propertyObject);
	},

	/**
	 * Function: __onModelDestroy
	 *
	 * EventListener for Coco.Event.DESTROY - Event
	 *
	 * Removes a model from the collection when it's destroyed.
	 *
	 * Parameter:
	 * @param {Coco.ModelEvent}  model - model to remove
	 * @private
	 */
	__onModelDestroy: function (event) {
		this.remove(event.model, true);
	},

	/**
	 * Function: getId
	 * Returns the internal id. Useful for comparison between different objects. If two object have the same id,
	 * they are identical.
	 *
	 * Return:
	 * @return {string} - The internal collection id.
	 */
	getId: function () {
		return this.__id;
	},

	/**
	 * Function: isEqual
	 * Checks if two collections are the same
	 *
	 * Parameter:
	 * @param {Coco.Collection} collection  - The <Coco.Collection> instance to compare
	 *
	 * Return:
	 * @return {boolean}                    - True if both collections are the same instance, otherwise false.
	 */
	isEqual: function (collection) {
		return this.__id === collection.getId();
	},

	/**
	 * Function: destroy
	 * Destroy the collection. Destroying the collection will remove and destroy
	 * all attached models.
	 */
	destroy: function () {
		this._dispatchEvent(new Coco.ModelEvent(Coco.Event.DESTROY, this));

		this.each((model) => {
			// Destroy all models
			model.destroy();
		});

		this.removeAllEventListener();
	}
});
