var Coco = Coco || {};
Coco.Utils = require("../lib/Coco.Utils.js");

/**
 * Class: Coco.Event
 *
 * Description:
 * This {abstract} class manages all events and attached callbacks.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.AbstractClass.declare({
    $name: 'Event',

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
     * The saved listeners.
     */
    __listeners: {},

    /**
     * All contexts the instance is listen to.
     */
    __ctx: [],

    $abstracts: {
        /**
         * Function: {abstract} getId()
         *
         * returns unique identifier for inheritance, it's needed to get unique event context
         *
         * If you inherit from Coco.Event you always have to implement this function.
         *
         * @returns: {String} uid
         */
        getId: function () {
        }
    },

    /**
     * Ctor.
     */
    initialize: function () {
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
        if (callback == null) {
            throw new Error("The given callback does not exist in " + this.$name + ".");
        }

        if (context == null) {
            throw new Error("Tried to attach a listener in " + this.$name + " for the Event " + event + ". But the context is null.");
        }

        if (typeof context.__listeners[event] === "undefined") {
            context.__listeners[event] = [];
        }

        var handle = Coco.Utils.uniqueId('e');

        context.__listeners[event].push({
            callback: callback.$bind(this),
            keep: true,
            ctx: this.getId(),
            handle: handle
        });

        this.__ctx.push({
            __listeners: context.__listeners,
            id: context.getId()
        });

        return handle;
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
        if (typeof context.__listeners[event] === "undefined") {
            context.__listeners[event] = [];
        }

        context.__listeners[event].push({
            callback: callback.$bind(this),
            keep: false
        });
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
        var sum = 0,
            event = null,
            i = 0;

        if ($context != null) {
            sum += 3;
        }

        if ($event != null) {
            sum += 5;
        }

        if ($handle != null) {
            sum += 7;
        }

        switch (sum) {
            case 0:
                // No parameters given
                for (i = 0; i < this.__ctx.length; i++) {
                    var ctxListeners = this.__ctx[i].__listeners;

                    for (var e in ctxListeners) {
                        if (ctxListeners.hasOwnProperty(e)) {
                            for (var j = 0; j < ctxListeners[e].length; j++) {
                                if (ctxListeners[e][j].ctx === this.getId()) {
                                    this.__ctx[i].__listeners[e].splice(j, 1);
                                }
                            }
                        }
                    }
                }

                break;

            case 3:
                // $context are given
                for (i = 0; i < this.__ctx.length; i++) {
                    ctxListeners = this.__ctx[i].__listeners;

                    if (this.__ctx[i].id !== $context.getId()) {
                        continue;
                    }

                    for (e in ctxListeners) {
                        if (ctxListeners.hasOwnProperty(e)) {
                            for (j = 0; j < ctxListeners[e].length; j++) {
                                if (ctxListeners[e][j].ctx === this.getId()) {
                                    this.__ctx[i].__listeners[e].splice(j, 1);
                                }
                            }
                        }
                    }
                }

                break;

            case 8:
                // $context and $event are given
                $context.__listeners[$event] = [];

                break;

            case 15:
                // $context, $event and $handle are given
                var l = $context.__listeners[$event];

                for(i = 0; i < l.length; i++) {
                    if(l[i].handle === $handle) {
                        l.splice(i, 1);

                        break;
                    }
                }

                break;
        }
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
        var cbObject = (this.__listeners[event]) ? this.__listeners[event].slice(0) : null,
            i = -1,
            l = (this.__listeners[event]) ? this.__listeners[event].length : 0,
            a1 = arguments[0],
            a2 = arguments[1],
            a3 = arguments[2],
            a4 = arguments[3],
            a5 = arguments[4];

        switch (arguments.length) {
            case 0:
                while (++i < l) {
                    cbObject[i].callback.call();

                    this.__checkForRemove(event, i);
                }
                break;
            case 1:
                while (++i < l) {
                    cbObject[i].callback.call(a1);

                    this.__checkForRemove(event, i);
                }
                break;
            case 2:
                while (++i < l) {
                    cbObject[i].callback.call(a1, a2);

                    this.__checkForRemove(event, i);
                }
                break;
            case 3:
                while (++i < l) {
                    cbObject[i].callback.call(a1, a2, a3);

                    this.__checkForRemove(event, i);
                }
                break;
            case 4:
                while (++i < l) {
                    cbObject[i].callback.call(a1, a2, a3, a4);

                    this.__checkForRemove(event, i);
                }
                break;
            case 5:
                while (++i < l) {
                    cbObject[i].callback.call(a1, a2, a3, a4, a5);

                    this.__checkForRemove(event, i);
                }
                break;
            default:
                while (++i < l) {
                    cbObject[i].callback.call(arguments);

                    this.__checkForRemove(event, i);
                }
        }

        this.__removeOnceListeners(event);
    },

    /**
     * If callback is a one time listener mark it so we can delete it at the end of the trigger function.
     *
     * @param {number|string}   event   The event
     * @param {number}          i       The listener.
     * @private
     */
    __checkForRemove: function (event, i) {
        if (this.__listeners && this.__listeners[event] && this.__listeners[event][i] && !this.__listeners[event][i].keep) {
            this.__listeners[event][i].doDelete = true;
        }
    },

    /**
     * Actually remove the one time listeners.
     *
     * @param {number|string}   event
     * @private
     */
    __removeOnceListeners: function (event) {
        if(this.__listeners[event]) {
            for(var i = this.__listeners[event].length - 1; i >= 0; i--) {
                if(this.__listeners[event][i].doDelete) {
                    this.__listeners[event].splice(i, 1);
                }
            }
        }
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