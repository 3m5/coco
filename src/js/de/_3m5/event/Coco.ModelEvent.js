var Coco = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.ModelEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.Model> or <Coco.Collection>.
 *
 * (c) 2015 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
    $name: "Coco.ModelEvent",
    $extends: Coco.Event,

    /**
     * <Coco.Model> or <Coco.Collection> that dispatched this event.
     */
    model: null,
    /**
     * Key that has changed in case of an change event.
     */
    key: null,

    /**
     * Ctor.
     *
     * Parameter:
     * @param {string}                        type       - the type of this event
     *
     * @param {Coco.Model|Coco.Collection}    model      - The <Coco.Model> or <Coco.Collection> that dispatched the event
     *
     * @param {string}                        $key       - {optional} The key in the <Coco.Collection> that has changed in case of an change event
     */
    initialize: function (type, model, $key) {
        this.$super(type);
        if (model == null) {
            throw new Error("Missing model parameter in " + this.$name + ".initialize");
        }
        if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
            throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
        }

        this.model = model;
        this.key = $key;
    }

});