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
    initialize: function (type, newRoute) {
        this.$super(type);
        if (newRoute == null) {
            throw new Error("Missing newRoute parameter in " + this.$name + ".initialize");
        }
        this.newRoute = newRoute;
    }

});