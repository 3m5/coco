var Coco   = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.ViewEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.View> or <Coco.ChildView>.
 *
 * (c) 2015 3m5. Media GmbH
 */
Coco.ViewEvent = class extends Coco.Event {

  get $name() {
    return "Coco.ViewEvent";
  }

  /**
   * Function: Constructor
   *
   * Parameter:
   * @param {<Coco.View>}  view      - The <Coco.View> that dispatched the event
   */
  constructor(type, view) {
    super(type);
    if (view == null) {
      throw new Error("Missing view parameter in " + this.$name + ".initialize");
    }
    if (!(view instanceof require("../view/Coco.View.js"))) {
      throw new Error("Invalid view parameter in " + this.$name + ".initialize. Must be Coco.View!");
    }
    /**
     * Variable: view
     *
     * Description:
     * <Coco.View> that dispatched this event.
     */
    this._view = view;
  }

  get view() {
    return this._view;
  }

};

module.exports = Coco.ViewEvent;
