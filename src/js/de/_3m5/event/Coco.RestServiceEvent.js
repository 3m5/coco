var Coco = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.RestServiceEvent
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
     * Variable: error
     *
     * Description:
     * {object} the (response) error
     */
    error: null,

    /**
     * Variable: status
     *
     * Description:
     * {int} the (response) error state (default: -1)
     */
    status: -1,

    /**
     * Function: Constructor
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