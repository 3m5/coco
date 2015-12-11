var Coco   = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.ModelEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.Model> or <Coco.Collection>.
 *
 * (c) 2015 3m5. Media GmbH
 */
Coco.ModelEvent = class extends Coco.Event {
  //$name: "Coco.ModelEvent",
  //$extends: Coco.Event,

  constructor(type, model, $key = null) {
    super(type);
    if (model == null) {
      throw new Error("Missing model parameter in " + this.$name + ".initialize");
    }
    //if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
    //  throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
    //}

    /**
     * Variable: model
     *
     * Description:
     * <Coco.Model> or <Coco.Collection> that dispatched this event.
     */
    this._model = model;

    /**
     * Variable: key
     *
     * Description:
     * Key that has changed in case of an change event.
     */
    this._key = $key;
  }

  get $name() {
    return "Coco.ModelEvent";
  }

  get model() {
    return this._model;
  }

  /**
   * Variable: model
   *
   * Description:
   * <Coco.Model> or <Coco.Collection> that dispatched this event.
   */
  //model: null,
  /**
   * Variable: key
   *
   * Description:
   * Key that has changed in case of an change event.
   */
  //key: null,

  /**
   * Function: Constructor
   *
   * Parameter:
   * @param {string}                        type       - the type of this event
   *
   * @param {Coco.Model|Coco.Collection}    model      - The <Coco.Model> or <Coco.Collection> that dispatched the event
   *
   * @param {string}                        $key       - {optional} The key in the <Coco.Collection> that has changed in case of an change event
   */
  //initialize: function (type, model, $key) {
  //    this.$super(type);
  //    if (model == null) {
  //        throw new Error("Missing model parameter in " + this.$name + ".initialize");
  //    }
  //    if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
  //        throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
  //    }
  //
  //    this.model = model;
  //    this.key = $key;
  //}

};

module.exports = Coco.ModelEvent;
