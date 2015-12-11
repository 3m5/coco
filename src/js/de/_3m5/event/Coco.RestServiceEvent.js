var Coco   = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.RestServiceEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.View> or <Coco.ChildView>.
 *
 * (c) 2015 3m5. Media GmbH
 */
Coco.RestServiceEvent = class extends Coco.Event {

  get $name() {
    return "Coco.RestServiceEvent";
  }

  /**
   * Function: Constructor
   *
   * Parameter:
   * @param {string}  type    - The type of this dispatched the event
   * @param {int} status      - http status of RESTService Response
   * @param {object} error    - the error object
   */
  constructor(type, status, $error) {
    super(type);
    if (status == null) {
      throw new Error("Missing status parameter in " + this.$name + ".initialize");
    }
    /**
     * Variable: status
     *
     * Description:
     * {int} the (response) error state (default: -1)
     */
    this._status = status;
    /**
     * Variable: error
     *
     * Description:
     * {object} the (response) error
     */
    this._error = $error;
  }

  get status() {
    return this._status;
  }

  get error() {
    return this._error;
  }

};

module.exports = Coco.RestServiceEvent;
