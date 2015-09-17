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
     * Variable: newRoute {object}
     *
     * the new route changed to
     */
    newRoute: null,

    /**
     * Variable: oldRoute {object}
     *
     * the old route changed from
     */
    oldRoute: null,

    $constants: {
        /**
         * Event: CHANGE_ROUTE
         * Called in <Coco.RouterService> when the url changed.
         */
        CHANGE_ROUTE: 'coco:route:change'
    },

    /**
     * Ctor.
     *
     * Parameter:
     * @param {string}  type          - The type that dispatched the event
     * @param {object}  newRoute      - The new route changed to
     * @param {object}  oldRoute      - The old route changed from
     */
    initialize: function (type, newRoute, oldRoute) {
        this.$super(type);
        if (newRoute == null) {
            throw new Error("Missing newRoute parameter in " + this.$name + ".initialize");
        }
        this.newRoute = newRoute;
        if (oldRoute == null) {
            throw new Error("Missing oldRoute parameter in " + this.$name + ".initialize");
        }
        this.oldRoute = oldRoute;
    }

});