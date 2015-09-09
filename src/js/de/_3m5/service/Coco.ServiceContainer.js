var Coco = Coco || {};
Coco.EventDispatcher = require("../event/Coco.EventDispatcher.js");
/**
 * Class: Coco.ServiceContainer
 *
 * Description:
 * This class holds and provide all previously created services.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = Coco.ServiceContainer = dejavu.Class.declare({
    $name: 'Coco.ServiceContainer',
    $extends: Coco.EventDispatcher,

    $statics: {
        __services: {},

        /**
         * Function addService
         *
         * {static} function to add service class
         *
         * @param serviceInstance
         */
        addService: function (serviceInstance) {
            console.debug("register service for Coco: ", serviceInstance.$serviceId);
            if(!this.$static.__services.hasOwnProperty(serviceInstance.$serviceId)) {
                this.$static.__services[serviceInstance.$serviceId] = serviceInstance;
            }
            else {
                throw new Error("Service '" + serviceInstance.$serviceId + "' already defined with class '" + serviceInstance.$name + "'.");
            }
        }
    },

    /**
     * Function: getService
     *
     * Return the service
     *
     * @param serviceId
     */
    getService: function (serviceId) {
        if(this.$static.__services.hasOwnProperty(serviceId)) {
            return this.$static.__services[serviceId];
        }

        throw new Error("Service '" + serviceId + "' does not exist. Maybe you forgot to initialize your service at the end of the declaration of your class, or you did not require the serviceClass.js");
    }
});