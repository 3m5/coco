var Coco = Coco || {};
Coco.Event = require("event/Coco.Event.js");
/**
 * Class: Coco.ServiceContainer
 *
 * Description:
 * This class holds and provide all previously created services.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
Coco.ServiceContainer = dejavu.Class.declare({
    $name: 'ServiceContainer',
    $extends: Coco.Event,

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
            if(!this.__services.hasOwnProperty(serviceInstance.$serviceId)) {
                this.__services[serviceInstance.$serviceId] = serviceInstance;
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
        if(Coco.ServiceContainer.__services.hasOwnProperty(serviceId)) {
            return Coco.ServiceContainer.__services[serviceId];
        }

        throw new Error("Service '" + serviceId + "' does not exist. Maybe you forgot to append .$service() at the end of the declaration of your class.");
    }
});