var Coco = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.ViewEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.View> or <Coco.ChildView>.
 *
 * (c) 2015 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
    $name: "Coco.RestServiceEvent",
    $extends: Coco.Event,

    /**
     * {object} that dispatched this event.
     */
    error: null,

    status: -1,

    /**
     * Ctor.
     *
     * Parameter:
     * @param {string}  type    - The type of this dispatched the event
     * @param {int} status      - http status of RESTService Response
     * @param {object} error    - the error object
     */
    initialize: function (type, status, $error) {
        this.$super(type);
        if (status == null) {
            throw new Error("Missing status parameter in " + this.$name + ".initialize");
        }
        this.status = status;
        this.error = $error;
    }

});