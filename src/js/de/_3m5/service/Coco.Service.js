var Coco = Coco || {};
Coco.ServiceProvider = require("./Coco.ServiceProvider.js");
Coco.ServiceContainer = Coco.ServiceContainer || require("./Coco.ServiceContainer.js");
Coco.Utils = require("../lib/Coco.Utils.js");
Coco.StringUtils = Coco.StringUtils || require("../lib/Coco.StringUtils.js");

/**
 * Class: Coco.Service
 *
 * extends: <Coco.ServiceProvider>
 *
 * Description:
 * This {abstract} class is extensible for building injectable services.
 * This service class holds the basic information to define a service.
 *
 * Append .$service() after your declare function and before semicolon to tell Coco that this is an injectable service class.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.AbstractClass.declare({
    $name: 'Service',

    $extends: Coco.ServiceProvider,

    /**
     * Variable: $serviceId
     * This will be the name of the service.
     */
    $serviceId: '',

    /**
     * The internal instance id.
     */
    __id: Coco.Utils.uniqueId('s'),

    initialize: function() {
        if(Coco.StringUtils.isEmpty(this.$serviceId)) {
            throw new Error(this.$name + " has no service id!");
        }
        //inject this service into ServiceContainer
        Coco.ServiceContainer.addService(this);

        this.$super();
    },

    /**
     * Function: getId
     * returns unique ID of this ServiceProvider
     *
     * @returns {String}
     */
    getId: function () {
        return this.__id;
    }
});