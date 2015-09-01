/**
 * Class: Coco.EventDispatcher
 *
 * Description:
 * Event dispatcher class for dispatching events to all java script classes.
 *
 * @author Andreas Wiedenfeld <andreas.wiedenfeld@3m5.de>
 *
 * (c) 2015 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
    $name: "Coco.EventDispatcher",

    /**
     * Private map of listeners.
     */
    __listeners: {},

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
     * Function: addEventListener
     *
     * Adds an event listener to this class. Save the returned event listener handle for removing this listener again.
     *
     * Parameter:
     * @param {string}      eventType  - The event type to listen to
     *
     * @param {Function}    listener   - The event listener function
     *
     * @param {boolean}    $once       - Flag if the listener should only listen for first event
     *
     * Return:
     * @returns {Symbol} listener handle for removing event listeners again
     */
    addEventListener : function(eventType, listener, $once) {
        if (eventType == null) {
            throw new Error("Missing eventType parameter in " + this.$name + ".addEventListener");
        }
        if (typeof eventType !== 'string') {
            throw new Error("Invalid eventType parameter in " + this.$name + ".addEventListener");
        }
        if (listener == null) {
            throw new Error("Missing listener parameter in " + this.$name + ".addEventListener");
        }
        if (typeof listener !== 'function') {
            throw new Error("Invalid listener parameter in " + this.$name + ".addEventListener");
        }

        // create unique handle by ES6 Symbol
        var handle = Symbol();

        // create array of listeners if not exists yet
        if (!$.isArray(this.__listeners[eventType])) {
            this.__listeners[eventType] = [];
        }

        // create listener object
        var listenerObject = {
            handle : handle,
            listener : listener
        };

        if ($once) {
            listenerObject.once = true;
        }
        this.__listeners[eventType].push(listenerObject);

        return handle;
    },

    /**
     * Function: addOnceEventListener
     *
     * Adds an event listener to this class that will only be called on first event. Save the returned event listener handle for removing this listener again.
     *
     * Parameter:
     * @param {string}      eventType  - The event type to listen to
     *
     * @param {Function}    listener   - The event listener function
     *
     * Return:
     * @returns {number} listener handle for removing event listeners again
     */
    addOnceEventListener : function(eventType, listener) {
        return this.addEventListener(eventType, listener, true);
    },

    /**
     * Function: removeEventListener
     *
     * Removes an event listener from this class. If there is no such event listener the method does nothing.
     *
     * Parameter:
     * @param {Symbol|String}  handle  - The event type to remove all event listeners for or the event handle to remove a specific event listener.
     */
    removeEventListener : function(eventTypeOrHandle) {
        if (eventTypeOrHandle == null) {
            throw new Error("Missing parameter in " + this.$name + ".removeEventListener");
        }
        if (typeof eventTypeOrHandle === 'string') {
            this.__removeEventListenerByEventType(eventTypeOrHandle);
        } else if (typeof eventTypeOrHandle === 'number') {
            this.__removeEventListenerByHandle(eventTypeOrHandle);
        } else {
            throw new Error("Invalid parameter in " + this.$name + ".removeEventListener");
        }
    },

    /**
     * Function: hasEventListener
     *
     * Checks if there is an event listener for the given event type.
     *
     * Parameter:
     * @param {string}  eventType  - The event type to check for event listeners.
     *
     * Return:
     * @returns {boolean} true if the event dispatcher has event listeners for the given event type
     */
    hasEventListener : function(eventType) {
        if (eventType == null) {
            throw new Error("Missing eventType parameter in " + this.$name + ".hasEventListener");
        }
        if (typeof eventType !== 'string') {
            throw new Error("Invalid eventType parameter in " + this.$name + ".hasEventListener");
        }

        return ($.isArray(this.__listeners[eventType]) && this.__listeners[eventType].length > 0);
    },

    /**
     * Function: __removeEventListenerByEventType
     *
     * Removes all event listener with for the given event type from this class.
     *
     * Parameter:
     * @param {string}  eventType  - The event type to remove all event listeners for.
     */
    __removeEventListenerByEventType : function(eventType) {
        // check if we have event listeners
        if (this.__listeners[eventType] == null || this.__listeners[eventType].length == 0) {
            return;
        }

        delete this.__listeners[eventType];
    },

    /**
     * Function: __removeEventListenerByHandle
     *
     * Removes an event listener with the given handle from this class.
     *
     * Parameter:
     * @param {number}  handle  - The event listener handle to remove.
     */
    __removeEventListenerByHandle : function(handle) {
        // iterate over all event types
        for (var eventType in this.__listeners) {
            var listeners = this.__listeners[eventType];

            // iterate over all listeners for this event type
            var i = -1;
            var foundHandle = false;
            while (++i < listeners.length) {
                var listener = listeners[i];
                if (listener.handle === handle) {
                    // found matching handle
                    listeners.splice(i, 1);
                    foundHandle = true;
                    break;
                }
            }

            // cleanup
            if (foundHandle) {
                if (listeners.length == 0) {
                    // remove listeners array
                    delete this.__listeners[eventType];
                }
                break;
            }
        }
    },

    /**
     * Function: _dispatchEvent
     *
     * Dispatches an event to all event listeners. If there are no event listeners nothing happens.
     *
     * Parameter:
     * @param {Coco.Event}      event  - The event type to dispatch. You can supply a string as shortcut when you don't want to pass any parameters to the event listener.
     */
    _dispatchEvent : function(event) {
        if (event == null) {
            throw new Error("Missing event parameter in " + this.$name + "._dispatchEvent");
        }

        // get event type
        var eventType = null;
        var hasEventParam = false;
        //console.warn("check eventType: ", event);
        if (typeof event === 'string') {
            eventType = event;
        } else if (event instanceof require("./Coco.Event.js")) {
            eventType = event.type;
            hasEventParam = true;
        } else {
            throw new Error("Unknown event parameter in " + this.$name + "._dispatchEvent. Must be typeof string!");
        }

        // check if we have event listeners
        if (!this.hasEventListener(eventType)) {
            //no listern, do not dispatch event/ do not call listener
            return;
        }
        var listeners = this.__listeners[eventType];

        // iterate over all event listeners
        var i = -1;
        while (++i < listeners.length) {
            if(listeners[i].listener == null) {
                console.warn("invalid eventlistener registered: ", listeners[i]);
                continue;
            }

            if (hasEventParam) {
                // dispatch event
                listeners[i].listener(event);
            } else {
                // call listener without event as shortcut for "dispatchEvent('MYEVENT')"
                listeners[i].listener();
            }

            if (listeners[i].once) {
                // remove once listener
                listeners.splice(i, 1);
                i--;
            }
        }

        // check if we just removed the last once listener
        if (listeners.length == 0) {
            // ... and remove event type array from listeners map
            delete this.__listeners[eventType];
        }
    }
});