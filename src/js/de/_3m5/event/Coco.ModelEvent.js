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
  get $name() {
    return "Coco.ModelEvent";
  }

  constructor(type, model, $key = null) {
    super(type);
    if (model == null) {
      throw new Error("Missing model parameter in " + this.$name + ".initialize");
    }
    if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
      throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
    }

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

  get model() {
    return this._model;
  }

  get key() {
    return this._key;
  }

};

module.exports = Coco.ModelEvent;
