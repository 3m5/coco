var Coco = Coco || {};
Coco.ServiceProvider = require("../service/Coco.ServiceProvider.js");
Coco.Utils = require("../lib/Coco.Utils.js");
Coco.RouterEvent = require("../event/Coco.RouterEvent.js");
/**
 * Class: Coco.Router
 *
 * extends: <Coco.ServiceProvider>
 *
 * Description:
 * This class holds routing and history information to navigate through the app.
 * This class must be injected as a service into some major app controlling class.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
    $name: 'Router',

    $extends: Coco.ServiceProvider,

    $inject: ['router'],

    __id: Coco.Utils.uniqueId("r"),

    /**
     * A jQuery element where the view gets appended to.
     */
    __$container: null,

    /**
     * Function: Constructor
	 *
	 * Description:
     * Initialize the routing functionality of Coco.
     *
     * @param selector      {string}    -   A CSS selector to append the current views.
     * @param routing       {Object}    -   A object containing routing information.
     * @param $initialPath  {Object}    -   A optional $initialPath to start the application with. Defaults to '/'
     */
    initialize: function (selector, routing, $initialPath) {
        //you HAVE to use constructor, because of the given variables
        this.$super();

        this._getService("router").addEventListener(Coco.RouterEvent.SHOW_VIEW, () => {this.__onShowView();});
        this._getService("router").addEventListener(Coco.RouterEvent.HIDE_VIEW, () => {this.__onHideView();});

        this.__$container = $(selector);

        this.$services.router.setContainer(this.__$container);

        // Copy the routing object to prevent any modification during application lifetime.
        this.__createRouting($.extend({}, routing), $initialPath);
    },

    /**
     * Adds the routing object to the routerService and starts the routing.
     *
     * @param routing
     * @param $initialPath
     * @private
     */
    __createRouting: function (routing, $initialPath) {
        for(var i in routing) {
            if(routing.hasOwnProperty(i)) {
                this.$services.router.addRoute(i, routing[i]);
            }
        }

        this.$services.router.start($initialPath);
    },

    /**
     * This function checks if the cached routing anchor is still in the DOM or has been removed or replaced during
     * the lifetime of the application.
     *
     * @returns {boolean}
     * @private
     */
    __isRoutingAnchorStillInDom: function () {
        return this.__$container.closest('body').length > 0;
    },

    /**
     * Reselect the routing anchor, if it has been replaced.
     *
     * @private
     */
    __reselectAnchor: function () {
        this.__$container = $(this.__$container.selector);
    },

    /**
     * Show the new view.
     *
     * @param $dom {Array} - {optional}   The dom of the view
     * @private
     */
    __onShowView: function ($dom) {
        if(!this.__isRoutingAnchorStillInDom()) {
            this.__reselectAnchor();
        }

        this.__$container.append($dom);

        window.scrollTo(0, 0);
    },

    /**
     * Hide the old view.
     *
     * @private
     */
    __onHideView: function () {
        if(!this.__isRoutingAnchorStillInDom()) {
            this.__reselectAnchor();
        }
    },

    /**
     * Function: getId
     * returns unique id of this ServiceProvider
     *
     * @returns {String}
     */
    getId: function () {
        return this.__id;
    }
});