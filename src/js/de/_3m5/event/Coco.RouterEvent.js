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
    $name: "Coco.RouterEvent",
    $extends: Coco.Event,

    /**
     * <Coco.Router> that dispatched this event.
     */
    view: null,

    /**
     * Variable newRoute {object}
     *
     * the type of dispatched event
     */
    newRoute: "",

    /**
     * Ctor.
     *
     * Parameter:
     * @param {<Coco.View>}  view      - The <Coco.View> that dispatched the event
     */
    initialize: function (type, view) {
        this.$super(type);
        if (view == null) {
            throw new Error("Missing view parameter in " + this.$name + ".initialize");
        }
        if (!(view instanceof require("../view/Coco.View.js"))) {
            throw new Error("Invalid view parameter in " + this.$name + ".initialize. Must be Coco.View!");
        }
        this.view = view;
    }

});