var Coco = Coco || {};
Coco.EventDispatcher = require("../event/Coco.EventDispatcher.js");
Coco.ServiceContainer = require("./Coco.ServiceContainer.js");

/**
 * Class: Coco.ServiceProvider
 *
 * extends: <Coco.Event>
 *
 * Description:
 * This class provides all defined services.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.AbstractClass.declare({
    $name: 'ServiceProvider',

    $extends: Coco.EventDispatcher,

    /**
     * Variable: $inject
     * Array to inject other services, simply provide an array of service ids.
     */
    $inject: [],

    /**
     * Variable: $services
     * The services will be filled on instantiation of the class.
     * Key is the serviceId and value is the service instance.
     */
    $services: {},

    initialize: function () {
        this._injectServices();
    },

    /**
     * Function: _injectServices
     *
     * {protected} function is called in constructor to inject services defined in $services-Array, deletes itself after calling 1st time
     */
    _injectServices: function() {
        if(this.__injectServices != null) {
            this.__injectServices();
        } else {
            console.warn("Services already injected, do not call this._injectServices twice!");
            return;
        }
        // Protect the ServiceContainer
        delete this.__injectServices;
        this._onServicesInjected();
    },

    /**
     * Function: _onServicesInjected
     *
     * {protected} function is called after services were injected, use it as hook to prevent overriding constructor
     */
    _onServicesInjected() {
    },

    /**
     * Function: __injectServices
     *
     * {private} function injects service instances
     */
    __injectServices: function () {
        var serviceContainer = new Coco.ServiceContainer();

        for(var i = 0; i < this.$inject.length; i++) {
            console.debug(this.$name + ".inject service: " + this.$inject[i]);
            this.$services[this.$inject[i]] = serviceContainer.getService(this.$inject[i]);
        }
    },

    /**
     * Function: _getService(serviceId)
     *
     * {protected} returns special service by given service id
     *
     * Parameter:
     * @param serviceId - String service id to get
     *
     * Return:
     * @returns {Coco.Service} service
     */
    _getService : function(serviceId) {
        return this.$services[serviceId];
    }
});