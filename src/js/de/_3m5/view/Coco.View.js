/** @namespace **/
var Coco = Coco || {};

Coco.Event = Coco.Event || require("../event/Coco.Event.js");
Coco.ServiceProvider = require("../service/Coco.ServiceProvider.js");
Coco.Utils = Coco.Utils || require("../lib/Coco.Utils.js");
Coco.Model = Coco.Model || require("../model/Coco.Model.js");
Coco.Collection = Coco.Collection || require("../model/Coco.Collection.js");
//! do not require ChildView here!, because there is no Coco.View class during require process !
/**
 * Class: Coco.View
 *
 * extends <Coco.ServiceProvider>
 *
 * Description:
 * This class holds a template and a model or collection. It adds events to the view and holds their callbacks.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = Coco.View = dejavu.Class.declare({
    $name: 'View',

    $extends: Coco.ServiceProvider,

    $statics: {
        /**
         * A object or variable from the model declared as "ether" can be demanded as a read-only value by other
         * views to work with the value of a otherwise invisible model.
         *
         * Ether variables hold their origins and property name in the key of `this.$static.__etherStore` and
         * their method to fetch their value in the value of the `this.$static.__etherStore` object.
         */
        ether: {
            /**
             * All objects that you can demand.
             */
            __etherStore: {},

            /**
             * Function: _add
             * Adds ether attributes to the `this.__etherStore` object.
             *
             * Parameter:
             * @param {Coco.Model}  model   A <Coco.Model> instance
             * @protected
             */
            _add: function (model) {
                console.log("get etherStore: ");
                //var etherObjects = {};
                //var etherModel = model.getEtherKeys();
                //
                //if(etherModel) {
                //    for (var i = 0; i < etherModel.length; i++) {
                //        etherObjects[model.$name + ":" + etherModel[i]] = model.boundGet;
                //    }
                //}
                //
                //this.__etherStore = $.extend(this.__etherStore, etherObjects);
            },

            /**
             * Function: get
             * Demands a ether object.
             * Returns undefined if nothing could be found.
             *
             * Parameter:
             * @param {string}  etherKey    A key of a ether attribute from a model
             * @return {*}
             */
            _get: function (etherKey) {
                var property = etherKey.substr(etherKey.indexOf(':') + 1);
                var reg = new RegExp(etherKey, "ig");

                console.log("get etherStore: ", this.__etherStore);
                for (var key in this.$static.ether.__etherStore) {
                    if (this.$static.ether.__etherStore.hasOwnProperty(key)) {
                        if (reg.test(key) === true) {
                            // this.__etherStore[key] returns the .boundGet() method for given key of current model.
                            var value = this.__etherStore[key](property);

                            if (value instanceof Coco.Event) {
                                return value;
                            }

                            if (value instanceof Array) {
                                return value.slice();
                            }
                            else if (typeof value === 'object') {
                                //return object clone to protect original model
                                return $.extend({}, value);
                            }

                            return value;
                        }
                    }
                }

                return undefined;
            }
        }
    },

    /**
     * An array of service ids to inject needed services.
     */
    $inject: [],

    /**
     * The internal view id.
     *
     * @private
     * @type string
     */
    __id: null,

    /**
     * The compiled handlebar template or DOM.
     *
     * @private
     * @type Function
     */
    _template: null,

    /**
     * Is set to true when view becomes active in the router.
     *
     * @private
     */
    __isActive: false,

    /**
     * A hash map of all attached child views of this view. Works similar to the `this._events` hash map. The only
     * difference is, that `this.__childViews` holds an array, because multiple child views could be attached to the same
     * selector.
     * Key is a selector within the scope of the parent views DOM segment.
     * Value is an instance of a valid Coco.View.
     *
     * Example:
     * {
     *      "div.anchor": [view1, view2],
     *      "div.anchor2: [view3]
     * }
     *
     * @private
     */
    __childViews: {},

    /**
     * Variable: _anchor
     * A CSS selector defining the block where the template gets appended to. If empty, the anchor will be a <div>.
     *
     * @protected
     */
    _anchor: '<div></div>',

    /**
     * Variable: _events
     * Developer defined jQuery events.
     *
     * jQuery Events are built like this: {"event selector": "callback"}
     *
     * Example:
     * {
     *      "click button": "callbackFunctionName"
     * }
     *
     * @protected
     */
    _events: {},

    /**
     * Variable: _options
     * options for current view
     */
    _options: {
        syncModelWithForm: false
    },

    /**
     * Variable: $el
     * A jQuery object holding the scope of the view in the DOM.
     *
     * @type jQuery
     */
    $el: null,

    /**
     * Variable: model
     * The attached <Coco.Model>.
     *
     * @type Coco.Model
     */
    _model: null,

    /**
     * Variable: collection
     * The attached <Coco.Collection>.
     *
     * @type Coco.Collection
     */
    _collection: null,

    /**
     * Variable _eventsDelegated
     * @protected Flag to show if <Coco.View._events> are still delegated or not
     */
    _eventsDelegated: false,

    /**
     * Variable _firstRendered
     * @protected Flag to show if <Coco.View> is rendered once or never
     */
    _firstRendered: false,

    /**
     * Variable _autoRender
     * @protected Flag to render this class after initialization
     */
    _autoRender: false,

    /**
     * Ctor.
     *
     * @param {Coco.Model|Coco.Collection}  $model                  Can be a new or existing model.
     * @param {Object}                      $syncModelWithForms     Override default options of view (optional).
     */
    initialize: function ($model, $syncModelWithForms) {
        this.$super();

        // Assign new id to the view object
        this.__id = Coco.Utils.uniqueId("v");

        var modelSet = false;

        // Set the model if given
        if ($model instanceof Coco.Model) {
            modelSet = true;
            this.setModel($model);
        }

        // Set the collection if given
        if ($model instanceof Coco.Collection) {
            modelSet = true;
            this.setCollection($model);
        }

        if ($model != null && !modelSet) {
            console.error("Invalid model object! Coco.Model or Coco.Collection expected, given: ", $model);
        }

        // Extend the options
        this._options.syncModelWithForm = (null != $syncModelWithForms) ? $syncModelWithForms : false;

        // Call this._onInitialize before this.$el is set, to prevent any multiple rendering on initialization.
        this._onInitialize();

        if(this._getRouter() != null) {
            this.listenTo(this._getRouter(), Coco.Event.HIDE_VIEW + this.$name, () => {this.showLoading();});
        }

        // Create the html wrapper element.
        this.$el = $(this._anchor);
        if(this.$el == null || this.$el.length == 0) {
            console.error(this.$name + "-anchor [" + this._anchor + "] not found in DOM: ", this.$el);
        }
        this.$el.attr('data-coco', this.__id);

        this._configure();

        //we only use precompiled templates
        if(this.__template != null) {
            //no autorender anymore!
            if(this._autoRender === true && this._getRouter() == null) {
                //only autoRender here, if no router is used!
                this.render();
            }
        } else {
            console.warn(this.$name + " has no Template set during initilization!");
        }
    },

    /**
     * Function: _getRouter()
     * @return {service} | {Coco.Router}
     * @protected
     */
    _getRouter: function() {
        return this._getService("router");
    },

    /**
     * Function: $(string selector)
     * A function that acts as a proxy for `jQuery.find` in the scope of the views DOM.
     *
     * Parameter:
     * @param {string} selector
     *
     * Return:
     * @return {jQuery|null}
     */
    $: function (selector) {
        if (this.$el == null) {
            throw new Error("$el of " + this.$name + " (" + this.getId() + ") is null. Please provide an _anchor.");
        }

        return this.$el.find(selector);
    },

    /**
     * Function: setModel(Coco.Model model)
     * Set the model if after `this.initialize` there is no model set.
     * It also copies the transferable objects to the $static segment of the view.
     *
     * Parameter:
     * @param {Coco.Model}  model  - A <Coco.Model> instance
     */
    setModel: function (model) {
        if (!(model instanceof Coco.Model)) {
            return;
        }

        if (this._model !== null) {
            this.stopListening(this._model);
            this._model.destroy();

            delete this._model;
        }

        this._model = model;

        Coco.View.ether._add(this._model);
    },

    /**
     * Function: setCollection(Coco.Collection collection)
     * Set the collection if after `this.initialize` there is no model set.
     * It also copies the transferable objects to the $static segment of the view.
     *
     * Parameter:
     * @param {Coco.Collection}     collection  - A <Coco.Collection> instance
     */
    setCollection: function (collection) {
        if (!(collection instanceof Coco.Collection)) {
            return;
        }

        if (this._collection !== null) {
            this.stopListening(this._collection);
            this._collection.destroy();

            delete this._collection;
        }

        this._collection = collection;

        this._collection.each((model) => {
            Coco.View.ether._add(model);
        });
    },

    /**
     * Function getModel()
     * Public getter for the model instance.
     *
     * Return:
     * @return Coco.Model - The current <Coco.Model> instance or null.
     */
    getModel: function () {
        return this._model;
    },

    /**
     * Function getCollection()
     * Public getter for the collection instance.
     *
     * Return:
     * @return Coco.Collection - The current <Coco.Collection> instance or null.
     */
    getCollection: function () {
        return this._collection;
    },

    /**
     * Function: _onInitialize()
     * Override these two functions to add anything you want to the init function.
     * This function is called at the end of the <Coco.View.initialize> function to prevent that subclasses of <Coco.View>
     * need to extend the <Coco.View.initialize> function and call this.$super.
     *
     * This method is called before the first time <Coco.View.render> is called, so you can attach events to the <Coco.Event.RENDER>
     * event.
     *
     * @protected
     */
    _onInitialize: function () {
    },

    /**
     * Function: _onFirstRender()
     * This method is called after everything has been rendered for the first time and after everything has been
     * initialized.
     *
     * @protected
     */
    _onFirstRender: function () {
    },

    onPreActive: function () {
        this.$el.attr('data-coco', this.__id);
    },

    /**
     * Function: onActive()
     * This method is called before the view gets appended to the DOM by the Router (Right after the ROUT_CHANGE event fired).
     * Implement this method if you want to do some business logic on this event.
     */
    onActive: function ($routerParameter) {
        if(this._autoRender === true) {
            this.render();
        }
    },

    /**
     * Function: onPause()
     * This method is called before the view gets removed from the DOM by the Router (Right after the ROUT_CHANGE event fired).
     * Implement this method if you want to do some business logic on this event.
     */
    onPause: function () {
    },

    /**
     * Function: onRenderedActive()
     * This method is called after the view gets appended to the DOM by the Router.
     * Implement this method if you want to do some UI related stuff when the view gets active.
     */
    onRenderedActive: function () {
    },

    /**
     * Function: render()
     * Updates the view.
     *
     * Return:
     * @return Coco.View - The current <Coco.View> instance.
     */
    render: function () {
        if (this.__template === null) {
            throw new Error("Could not render Coco.View [" + this.$name + "], no template found! ", this.__template);
        }

        //we use require now, so hbs templates are precompiled, just add the model here
        //var html = (typeof this.__template === 'function') ? this.__template(this._getHBSModel()) : this.__template;
        var html = this.__template(this._getHBSModel());

        this.$('> :first-child').detach();
        this.$el.empty().append(html);

        if (this.__isActive) {

            // Empty/append ONLY IF the $el inside main container is not THE SAME
            if(this._getRouter() && this._getRouter().$container.children().first()[0] != this.$el[0]) {
                this._getRouter().$container.empty().append(this.$el);
            }

            this.hideLoading();
        }


        if(this._firstRendered === false) {
            this._firstRendered = true;
            //use delayed callback, to let the DOM get rendered
            setTimeout(() => {
                this._onFirstRender();
            });
        }
        this.delegateEvents();
        setTimeout(() => {
            this.trigger(Coco.Event.RENDER);
            this.trigger(Coco.Event.RENDER + this.$name);
        });
    },

    /**
     * Function: showLoading()
     * Add 'loading' class to main container after 300ms of page loading
     * This works for long AJAX request, not for pages with heavy rendering
     */
    showLoading: function() {
        // Show loader only after delay
        // Because we don't want the pages to flash if the loading was really fast
        clearTimeout(window.loading_timeout);
        window.loading_timeout = setTimeout(() => {
            if (this._getRouter() && this._getRouter().$container) {
                this._getRouter().$container.addClass('loading');
            }
        }, 300);
    },

    /**
     * Function: hideLoading()
     */
    hideLoading: function() {
        clearTimeout(window.loading_timeout);
        setTimeout(() => {
            if (this._getRouter() && this._getRouter().$container) {
                //TODO test & reactivate this...
                //this._getRouter().$container.removeClass('loading application-loading');
            }
        }, 10);
    },

    /**
     * Function: _getHBSModel()
     * creates the hbs model for this view, based on given <Coco.Model> objects
     *
     * @returns {object} - properties (array of all properties of all <Coco.Collection> models, or for one <Coco.Model>)
     *
     * @protected
     */
    _getHBSModel: function () {
        var props = {};

        //use only simple comparison, to catch null and undefined
        if (this._collection != null || this._model != null) {
            /**
             * The available properties when using a collection are models and length
             * @deprecated Will be removed on Jan 27 2014
             *
             * Use collection.models and collection.size instead of model and length.
             */
            if (this._collection != null && this._model != null) {
                console.warn(this.$name + " collection AND model are set at once, but only one model can be used in template, collection will override model data!");
            }
            props = (this._collection == null) ? this._model.getAttributes() : {collection: {models: this._collection.getAllAttributes(), size: this._collection.size()}};
        }

        return props;
    },

    /**
     * Function: getDOM()
     * Returns the DOM of the view. Calling this function will always cause a render of this view.
     *
     * Return:
     * @return {*} - The DOM representation of the <Coco.View> instance.
     */
    getDOM: function () {
        this.render();

        return this.$el.get();
    },

    /**
     * Function: getCachedDOM()
     * Return the cached DOM of the view. Calling this function won't cause a render of the view.
     *
     * Return:
     * @returns {*}
     */
    getCachedDOM: function () {
        return this.$el.get();
    },

    /**
     * Function: remove(boolean removeAssoc)
     * Removes the view permanently.
     *
     * Parameter:
     * @param {boolean} removeAssoc   - If set to true, the associated model/collection will trigger it's destroy event.
     */
    remove: function (removeAssoc) {
        this.trigger(Coco.Event.DESTROY, this);

        if (removeAssoc && this._model !== null) {
            this._model.destroy();
            this._model = null;
        }

        if (removeAssoc && this._collection !== null) {
            this._collection.destroy();
            this._collection = null;
        }

        //stop listening jQuery events
        this.undelegateEvents();
        this.stopListening();
        this.removeAllChildViews();
    },

    /**
     * Renders the child views that are attached to the view.
     * This can be stopped because this method is an callback for the `render` event that is triggered by `this.render`.
     * This has the advantage that the need to re-render is propagated to each child view and it's child views, etc.
     *
     * @private
     */
    __renderChildViews: function () {
        for (var selector in this.__childViews) {
            if (this.__childViews.hasOwnProperty(selector)) {
                for (var i = 0; i < this.__childViews[selector].length; i++) {
                    this.$el.find(selector).append(this.__childViews[selector][i].getCachedDOM());
                }
            }
        }
    },

    /**
     * Function: addChildView(String selector, Coco.View view)
     * Add a child view to this view. Child views are attached again to it's parent view automatically, if `this.render`
     * was called by the parent view.
     *
     * Parameter:
     * @param {string}        selector      - Where to attach the child view
     *
     * @param {Coco.ChildView}     view     - An instance of a <Coco.View>
     *
     * @param {string|number} $strategy     - {optional} How should the child view be inserted? Valid values are "push" and "unshift".
     *
     * @param {boolean} $addToAllMatching   - {optional} If set to true child views will be added to all matching selector instead of the first.
     *
     * Return:
     * @returns {Coco.ChildView}
     */
    addChildView: function (selector, view, $strategy, $addToAllMatching) {
        if (!(view instanceof Coco.View)) {
            throw new Error("View '" + view.$name + "' is not a instance of Coco.View. To add the view as a child view extend from Coco.ChildView rather than from Coco.View");
        }

        if (!this.__childViews.hasOwnProperty(selector)) {
            this.__childViews[selector] = [];
        }

        if ($strategy && $strategy === 'unshift') {
            this.__childViews[selector].unshift(view);

            if ($addToAllMatching) {
                this.$el.find(selector).prepend(view.getDOM());
            }
            else {
                this.$el.find(selector).first().prepend(view.getDOM());
            }
        }
        else {
            this.__childViews[selector].push(view);

            if ($addToAllMatching) {
                this.$el.find(selector).append(view.getDOM());
            }
            else {
                this.$el.find(selector).first().append(view.getDOM());
            }
        }

        /**
         * Call child views _onFirstRender. Because this method is called after the first rendering, but has no effect
         * if the <Coco.View> instance is a child view, since it's only inserted into the DOM after the above line.
         * So we need to call the child views _onFirstRender again.
         */

        return view;
    },

    /**
     * Function: addChildViews
     * add multiple child views in one container to given childview container. It's better to use this function for large data
     *
     * @param {Coco.Collection} collection - <Coco.Collection> with models to create childviews from
     * @param {string} selector - CSS selector to add childviews
     * @param {Coco.View} viewDefinition - class of <Coco.View> to add
     */
    addChildViews: function (collection, selector, view_definition) {
        if (!(collection instanceof Coco.Collection)) {
            throw new Error("Collection '" + collection.$name + "' is not a instance of Coco.Collection.");
        }

        if (!this.__childViews.hasOwnProperty(selector)) {
            this.__childViews[selector] = [];
        }

        // Create virtual DOM element
        var $virtualElement = $(document.createDocumentFragment());

        // Append all childviews to it
        collection.each((model) => {
            var view_instance = new view_definition(model);
            this.__childViews[selector].push(view_instance);

            $virtualElement.append(view_instance.getDOM());
        });

        // Append virtual element to actual HTML
        this.$el.find(selector).first().append($virtualElement);
    },

    /**
     * Function: getChildViewsBySelector
     * Get all child views attached to the given selector.
     *
     * Parameter:
     * @param {string} selector - A CSS selector
     *
     * Return:
     * @return {Array} - Array of <Coco.View> instances or an empty array.
     */
    getChildViewsBySelector: function (selector) {
        var ret = this.__childViews[selector];

        return (ret instanceof Array) ? ret : [];
    },

    /**
     * Function: getChildViewById
     * Get a view by it's id.
     *
     * Parameter:
     * @param {string} viewId    - The view id to look for.
     *
     * Return:
     * @return {Coco.View} - The matched <Coco.View> instance or null.
     */
    getChildViewById: function (viewId) {
        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                for (var i = 0; i < this.__childViews[views].length; i++) {
                    if (this.__childViews[views][i].getId() === viewId) {
                        return this.__childViews[views][i];
                    }
                }
            }
        }

        return null;
    },

    /**
     * Function: getChildViewByModelId
     * Get a view by it's attached model id.
     *
     * Parameter:
     * @param {string} modelId - The internal id of a <Coco.Model> instance.
     *
     * Return:
     * @return {Coco.View} - The matched <Coco.View> instance or null.
     */
    getChildViewByModelId: function (modelId) {
        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                for (var i = 0; i < this.__childViews[views].length; i++) {
                    if (this.__childViews[views][i].model !== null && this.__childViews[views][i].model.getId() === modelId) {
                        return this.__childViews[views][i];
                    }
                }
            }
        }

        return null;
    },

    /**
     * Function: countChildViews
     *
     * @returns int - number of childviews
     */
    countChildViews: function () {
        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                return this.__childViews[views].length;
            }
        }
        return 0;
    },

    /**
     * Function
     * Get the internal child views.
     *
     * @returns {Object} - The internal childViews object.
     */
    getChildViews: function () {
        return this.__childViews;
    },

    /**
     * Function: eachChildView
     * Iterate over all child views.
     *
     * @param {Function} callback   -   The callback function. Takes the view, the index, the selector and the index in the selector context.
     */
    eachChildView: function (callback) {
        var index = 0;

        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                for (var i = 0; i < this.__childViews[views].length; i++) {
                    callback(this.__childViews[views][i], index++, views, i);
                }
            }
        }
    },

    /**
     * Function: removeChildViewById
     * Remove a child view from this parent view.
     *
     * Parameter:
     * @param {Number|string}   viewId        - The id of the view instance to remove.
     */
    removeChildViewById: function (viewId) {
        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                for (var i = 0; i < this.__childViews[views].length; i++) {
                    if (this.__childViews[views][i].getId() === viewId) {
                        this.$('[data-coco="' + this.__childViews[views][i].getId() + '"]').remove();

                        this.__childViews[views][i].remove();
                        this.__childViews[views].splice(i, 1);

                        break;
                    }
                }
            }
        }
    },

    /**
     * Function: removeChildViewByModelId
     * Remove a child view from it's parent view by the model of the child view.
     *
     * Parameter:
     * @param {Number|string}   modelId         - The id of the model that the child view holds.
     */
    removeChildViewByModelId: function (modelId) {
        var view = this.getChildViewByModelId(modelId);

        if (view !== null) {
            this.removeChildViewById(view.getId());
        }
    },

    /**
     * Function: removeChildViewsBySelector
     * Removes all child views attached to the given selector.
     *
     * Parameter:
     * @param {string} selector      - The selector to remove all child views from.
     */
    removeChildViewsBySelector: function (selector) {
        if (!this.__childViews.hasOwnProperty(selector)) {
            return;
        }

        for (var i = 0; i < this.__childViews[selector].length; i++) {
            this.$('[data-coco="' + this.__childViews[selector][i].getId() + '"]').remove();

            this.__childViews[selector][i].remove();
        }

        this.__childViews[selector].splice(0, i);
    },

    /**
     * Function: removeAllChildViews
     * Removes all attached childViews.
     */
    removeAllChildViews: function () {
        for (var views in this.__childViews) {
            if (this.__childViews.hasOwnProperty(views)) {
                for (var i = 0; i < this.__childViews[views].length; i++) {
                    this.$('[data-coco="' + this.__childViews[views][i].getId() + '"]').remove();

                    this.__childViews[views][i].remove();
                }

                this.__childViews[views].splice(0, i);
            }
        }
    },

    /**
     * Configures the View based on the given options and sets the defined eventHandlers
     *
     * @private
     */
    _configure: function () {
        if (this._model !== null) {
            this.listenTo(this._model, Coco.Event.DESTROY, () => {
                this.stopListening(this._model);

                this._model = null;
            });

            //this works only with 1 model
            if (this._options.syncModelWithForm) {
                this.$el.on('change', 'select, textarea, input', (e) => {
                    var $ele = $(e.target);

                    if (this._model.has($ele.prop('name'), false)) {
                        this._model.set($ele.prop('name'), $ele.val());
                    }
                });
            }
        }

        this.listenTo(this, Coco.Event.RENDER, this.__renderChildViews);
    },

    /**
     * Function: delegateEvents
     * Delegate the Events to jQuerys .on() method.
     * If no events passed as parameter it uses the <Coco.View._events> property of the view.
     *
     * Parameter:
     * @param $events   - {optional} An object of events, just like the views _events object.
     */
    delegateEvents: function ($events) {
        if ($events == null) {
            if (this._eventsDelegated) {
                //do not delegate events twice
                return;
            }

            this._eventsDelegated = true;
        }

        $events = ($events != null) ? $events : this._events;

        for (var key in $events) {
            if ($events.hasOwnProperty(key)) {
                var event = key.substr(0, key.indexOf(' '));
                var selector = key.substr(key.indexOf(' ') + 1);
                var callback = $events[key];

                if (undefined === this[callback]) {
                    throw new Error("The callback function '" + callback + "' does not exist in '" + this.$name + "'.");
                }

                this.$el.on(event, selector, this[callback].$bind(this));
            }
        }

        this.eachChildView((view) => {
            view.delegateEvents(null);
        });
    },

    /**
     * Function: undelegateEvents
     * Removes all jQuery event handlers defined in <Coco.View._events>.
     *
     * Parameter:
     * @param $events   - {optional} An object of events, just like the views _events object.
     */
    undelegateEvents: function ($events) {
        if ($events == null) {
            this._eventsDelegated = false;
        }

        $events = ($events != null) ? $events : this._events;

        for (var key in $events) {
            if ($events.hasOwnProperty(key)) {
                var event = key.substr(0, key.indexOf(' '));
                var selector = key.substr(key.indexOf(' ') + 1);

                //remove evenhandler
                this.$el.off(event, selector);
            }
        }

        this.eachChildView((view) => {
            view.undelegateEvents(null);
        });
    },


    /**
     * Function: animate
     * Shortcut for animating parts of the view via jQuery. Note that animations are saved until next rendering.
     *
     * Parameter:
     * @param {String} selector      - Which part should be animated
     *
     * @param {object} properties    - Which properties should be animated
     *
     * @param {Number} $duration     - {optional} An optional duration the animation takes. Default is 100
     *
     * @param {Function} $callback   - {optional} An optional callback to execute when the animation finished
     */
    animate: function (selector, properties, $duration, $callback) {
        $duration = (null != $duration) ? $duration : 100;

        this.$(selector).animate(properties, $duration, $callback);
    },

    /**
     * Function: css
     * Shortcut for restyle parts of the view via jQuery.
     *
     * Parameter:
     * @param {String} selector      - Which part should be changed
     *
     * @param {Object} properties    - Which properties should be changed
     */
    css: function (selector, properties) {
        this.$(selector).css(properties);
    },

    /**
     * Function: show
     * Display the views DOM.
     */
    show: function () {
        this.$el.show();
    },

    /**
     * Function: hide
     * Hide the views DOM.
     */
    hide: function () {
        this.$el.hide();
    },

    isActive: function () {
        return this.__isActive;
    },

    activate: function() {
        this.__isActive = true;
    },

    deactivate: function() {
        this.__isActive = false;
    },

    /**
     * Function: getId
     * Return the internal id. Useful for comparison between different objects. If two object have the same id,
     * they are identical.
     *
     * @returns {string} - The internal id of this instance.
     */
    getId: function () {
        return this.__id;
    },

    /**
     * Function: isEqual
     * Checks if two views are the same
     *
     * @param {Coco.View} view  - A <Coco.View> instance to compare.
     * @returns {boolean}   - True if both instances are the same, otherwise false.
     */
    isEqual: function (view) {
        return this.__id === view.getId();
    }
});