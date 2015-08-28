var Coco = Coco || {};
Coco.Utils = require("../lib/Coco.Utils.js");
Coco.EventDispatcher = require("./Coco.EventDispatcher.js");

/**
 * Class: Coco.Event
 *
 * Description:
 * This {abstract} class manages all events and attached callbacks.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
    $name: 'Coco.Event',
    $extends: Coco.EventDispatcher,

    /**
     * Variable type {string}
     *
     * the type of dispatched event
     */
    type: null,

    /**
     * Variable data {object}
     *
     * the data of dispatched event
     */
    data: null,

    //available types are:
    $constants: {
        /**
         * Event: INITIALIZED
         * Called in <Coco> when Coco is initialized.
         */
        INITIALIZED: 'coco:initialized',
        /**
         * Event: ADD
         * Called in <Coco.Collection> when a new <Coco.Model> has been added.
         */
        ADD: 'coco:add',
        /**
         * Event: AUTHORIZATION_FAILED
         * Called in <Coco.BaseRestService> if http status 401 was received
         */
        AUTHORIZATION_FAILED: 'coco:authorization_failed',
        /**
         * Event: CHANGE
         * Called in <Coco.Model> if the attributes changed.
         */
        CHANGE: 'coco:change',
        /**
         * Event: CHANGE_KEY
         * Called in <Coco.Model> if a specified attribute changed. (Built like CHANGE_KEY + 'key').
         */
        CHANGE_KEY: 'coco:change:',
        /**
         * Event: DESTROY
         * Called in <Coco.Model>, <Coco.Collection> and <Coco.View> before instance gets destroyed.
         */
        DESTROY: 'coco:destroy',
        /**
         * Event: INTERNAL_SERVER_ERROR
         * Called in <Coco.BaseRestService> if http status 500 was received
         */
        INTERNAL_SERVER_ERROR: 'coco:internal_server_error',
        /**
         * Event: INVALID
         * Called in <Coco.Model> if the validation of the model failed.
         */
        INVALID: 'coco:invalid',
        /**
         * Event: REMOVE
         * Called in <Coco.Collection> if a <Coco.Model> instance has been removed from the collection.
         */
        REMOVE: 'coco:remove',
        /**
         * Event: RENDER
         * Called in <Coco.View> when the DOM has been refreshed.
         */
        RENDER: 'coco:render',
        /**
         * Event: RESET
         * Called in <Coco.Collection> when the collection has been reset.
         */
        RESET: 'coco:reset',
        /**
         * Event: REST_SERVER_ERROR
         * Called in <Coco.Collection> when the collection has been reset.
         */
        REST_SERVER_ERROR: 'coco:rest-server-error',
        /**
         * Event: SORTED
         * Called in <Coco.Collection> when the collection has been sorted.
         */
        SORTED: 'coco:sorted',
        /**
         * Event: VALID
         * Called in <Coco.Model> when the validation of the model passed.
         */
        VALID: 'coco:valid',
        /**
         * Event: CHANGE_ROUTE
         * Called in <Coco.RouterService> when the url changed.
         */
        CHANGE_ROUTE: 'coco:route:change',
        /**
         * Event: FIRE_ROUTE
         */
        FIRE_ROUTE: 'coco:route:fire',
        /**
         * Event: HIDE_VIEW
         * Called in <Coco.RouterService> when the url changed.
         */
        HIDE_VIEW: 'coco:view:hide',
        /**
         * Event: SHOW_VIEW
         * Called in <Coco.RouterService> when the url changed.
         */
        SHOW_VIEW: 'coco:view:show'
    },

    /**
     * Ctor.
     */
    initialize: function (type, $data) {
        this.type = type;
        this.data = $data;
    },

    /**
     * Function: listenTo
     *
     * Adds a listener to given context.
     *
     * Parameter:
     * @param {Coco.Event}  context    - The <Coco.Event> object to listen to for an event
     *
     * @param {string}      event      - The event to listen to
     *
     * @param {Function}    callback   - The callback
     *
     * Return:
     * @returns {string}    -   The generated handle.
     */
    listenTo: function (context, event, callback) {
        console.warn(this.$name + ".listenTo is deprecated! Use Coco.EventDispatcher.addEventListener(eventType, listener, $once) instead...");
        return context.addEventListener(event, callback);
    },

    /**
     * Function: on
     * calls <Coco.Event.listenTo>
     *
     * Parameter:
     * @param {Coco.Event}  context    - The <Coco.Event> object to listen to for an event
     *
     * @param {string}      event      - The event to listen to
     *
     * @param {Function}    callback   - The callback
     *
     * Return:
     * @returns {string}    -   The generated handle.
     */
    on: function (context, event, callback) {
        return this.listenTo(context, event, callback);
    },

    /**
     * Function: once
     * Add a listener to call once.
     *
     * Parameter:
     * @param {Coco.Event}  context    - The <Coco.Event> context to listen to for an event
     *
     * @param {string}      event      - The event to listen to
     *
     * @param {Function}    callback   - The callback
     */
    once: function (context, event, callback) {
        console.warn(this.$name + ".once is deprecated! Use Coco.EventDispatcher.addEventListener(eventType, listener, $once) instead...");
        return context.addEventListener(event, callback, true);
    },

    /**
     * Function: stopListening
     *
     * Removes a listener.
     * If no arguments are given, this instance will delete all listeners from every context where
     * it attached callbacks.
     *
     * Parameter:
     * @param {Coco.Event}  $context    - {optional} The <Coco.Event> context to stop listen.
     *
     * @param {string}      $event      - {optional} The event to listen off.
     *
     * @param {string}      $handle     - {optional} The handle for a specific callback that should be detached.
     */
    stopListening: function ($context, $event, $handle) {
        console.warn(this.$name + ".stopListening is deprecated! By use of Coco.EventDispatcher.addEventListener(eventType, listener, $once) no stopListening here is needed anymore");
    },

    /**
     * Function: off
     * calls: <Coco.Event.stopListening>
     *
     * Parameter:
     * @param {Coco.Event}  $context    - {optional} The <Coco.Event> object to stop listen
     *
     * @param {string}      $event      - {optional} The event to listen off
     *
     * @param {string}      $handle     - {optional} The handle for a specific callback that should be detached.
     */
    off: function ($context, $event, $handle) {
        this.stopListening($context, $event, $handle);
    },

    /**
     * Function: trigger
     * Triggers an event.
     *
     * Dispatch idea is taken from backbone.js. Love this approach.
     *
     * You can add as many arguments that will given to the callback functions as you like.
     *
     * If you add up to 5 additional arguments, they will be handles separately.
     *
     * Example:
     * `this.trigger('some:event', arg1, arg2, arg3);` will lead to `callback(arg1, arg2, arg3)`
     *
     * `this.trigger('some:event', arg1, arg2, arg3, arg4, arg5, arg6, arg7);` will lead to `callback(arguments)`
     *
     * Parameter:
     * @param {string} event    - The event to trigger
     */
    trigger: function (event) {
        this._dispatchEvent(event);

        return;
    },

    /**
     * Function: _createModelChangeKey
     * {protected} creates an Event String for the model Event <Coco.Event.CHANGE_KEY>
     *
     * Parameter:
     * key - String of key to create Change-Event to
     */
    _createModelChangeKey : function(key) {
        return this.$static.CHANGE_KEY + key;
    }
});