var Coco = Coco || {};
Coco.Event = require("../event/Coco.Event.js");
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

    $extends: Coco.Event,

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

        // Protect the ServiceContainer
        this._injectServices = null;
    },

    /**
     * Function: _injectServices
     * {protected} function injects service instances, its portected because <Coco.ChildView> initialization differs
     */
    _injectServices: function () {
        var serviceContainer = new Coco.ServiceContainer();

        for(var i = 0; i < this.$inject.length; i++) {
            this.$services[this.$inject[i]] = serviceContainer.getService(this.$inject[i]);
        }
    },

    /**
     * Function: _getService(serviceId)
     * {protected} returns special service by given service id
     *
     * Parameter:
     * @param serviceId - String service id to get
     *
     * Return:
     * @returns service - <Coco.Service>
     */
    _getService : function(serviceId) {
        return this.$services[serviceId];
    }
});