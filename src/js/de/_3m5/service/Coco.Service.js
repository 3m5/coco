var Coco = Coco || {};
Coco.ServiceProvider = require("../service/Coco.ServiceProvider.js");
Coco.Utils = require("../lib/Coco.Utils.js");

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
    $serviceId: 'service',

    /**
     * The internal instance id.
     */
    __id: Coco.Utils.uniqueId('s'),

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