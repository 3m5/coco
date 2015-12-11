var Coco   = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.RouterEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.View> or <Coco.ChildView>.
 *
 * (c) 2015 3m5. Media GmbH
 */
Coco.RouterEvent = class extends Coco.Event {

  get $name() {
    return "Coco.RouterEvent";
  }

  /**
   * Function: Constructor
   *
   * Parameter:
   * @param {string}  type          - The type that dispatched the event
   * @param {object}  newRoute      - The new route changed to
   * @param {object}  oldRoute      - The old route changed from
   */
  constructor(type, newRoute, oldRoute) {
    super(type);
    if (newRoute == null) {
      throw new Error("Missing newRoute parameter in " + this.$name + ".initialize");
    }
    /**
     * Variable: newRoute {object}
     *
     * Description:
     * the new route changed to
     */
    this._newRoute = newRoute;
    if (oldRoute == null) {
      throw new Error("Missing oldRoute parameter in " + this.$name + ".initialize");
    }
    /**
     * Variable: oldRoute {object}
     *
     * the old route changed from
     */
    this._oldRoute = oldRoute;
  }

  _validateEventType(type) {
    return super._validateEventType(type) || Coco.RouterEvent[type] != null;
  }

  get newRoute() {
    return this._newRoute;
  }

  get oldRoute() {
    return this._oldRoute;
  }

  /**
   * Event: CHANGE_ROUTE
   * Called in <Coco.RouterService> when the url changed.
   */
  static get CHANGE_ROUTE() {
    return 'CHANGE_ROUTE';
  }

  /**
   * Event: FIRE_ROUTE
   */
  static get FIRE_ROUTE() {
    return 'FIRE_ROUTE';
  }

  /**
   * Event: HIDE_VIEW
   * Called in <Coco.RouterService> when the url changed.
   */
  static get HIDE_VIEW() {
    return 'HIDE_VIEW';
  }

  /**
   * Event: SHOW_VIEW
   * Called in <Coco.RouterService> when the url changed.
   */
  static get SHOW_VIEW() {
    return 'SHOW_VIEW';
  }

};

module.exports = Coco.RouterEvent;
