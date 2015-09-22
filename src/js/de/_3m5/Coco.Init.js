var Coco = Coco || {};

var Handlebars  = require('handlebars/runtime');
//require non public Coco classes
require("./service/Coco.ServiceContainer.js");
require("./helpers/HandlebarsHelpers.js");
require("./router/Coco.RouterService.js");
/**
 * Class: .Coco
 *
 * 3m5. Javascript SDK main class (Coco.SDK)
 *
 * exports Coco as module, so just type "var Coco = require('3m5-coco')" to us it!
 *
 * triggers <Coco.Event.INITIALIZED> Event on body when Coco is ready
 *
 * (c) 2015 3m5. Media GmbH
 */
Coco.SDK = dejavu.Class.declare({
    $name: "Coco.Init",

    ////////////////////////////////////////////////////////////
    //////// CONFIGURATION
    config: {
        baseUrl: "/",              //server context path
        router: {
            loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
        },
        restService: {              //restService configuration
            path: "rest/",             //restService path
            cacheGet: 600,          //cache time for GET Requests of same url in seconds
            cachePost: null         //cache time for GET Requests of same url in seconds
        }
    },

    //////// CLASS DEFINITIONS
    Event: require("./event/Coco.Event.js"),
    ModelEvent: require("./event/Coco.ModelEvent.js"),
    RestServiceEvent: require("./event/Coco.RestServiceEvent.js"),
    RouterEvent: require("./event/Coco.RouterEvent.js"),
    ViewEvent: require("./event/Coco.ViewEvent.js"),
    EventDispatcher: require("./event/Coco.EventDispatcher.js"),

    //PACKAGE MODEL
    Model: require("./model/Coco.Model.js"),
    Collection: require("./model/Coco.Collection.js"),

    //PACKAGE SERVICE
    Service: require("./service/Coco.Service.js"),
    ServiceProvider: require("./service/Coco.ServiceProvider.js"),

    //PACKAGE ROUTER
    Router: require("./router/Coco.Router.js"),

    //REST
    BaseRestService: require("./service/Coco.BaseRestService.js"),

    //PACKAGE LIB
    HashMap: {error: "not needed anymore, use ES6 classes 'map' or 'set' instead"},
    HbsLoader: {error: "not available anymore, hbs files are compiled by handlebars npm-module"},
    DateHelper: {error: "not available anymore, use momentJS instead (npm-module)"},
    Math: require("./lib/Coco.Math.js"),
    Utils: require("./lib/Coco.Utils.js"),
    Storage: require("./lib/Coco.Storage.js"),
    StringUtils: require("./lib/Coco.StringUtils.js"),
    URLHelper: require("./lib/Coco.URLHelper.js"),

    //PACKAGE VIEW
    View: require("./view/Coco.View.js"),
    ChildView: require("./view/Coco.ChildView.js"),

    //PLUGINS
    Plugins: {
        i18n: {
            Translator: require("./plugins/i18n/Coco.Translator.js")
        }
    },

    //////// CLASS DEFINITIONS END
    ////////////////////////////////////////////////////////////

    $statics: {
        version: "0.1.63",
        initialized: false
    },

    testFunction() {
        console.log("call ES6 test function...");
    },

    initialize: function () {
        console.logWithDate = true;

        if(Handlebars == null) {
            throw new Error("Missing Handlebars! include npm-module 'handlebars' into your project!");
        }

        try {
            $;
        } catch(error) {
            throw new Error("Missing jQuery! Install jQuery to use Coco.SDK ", error);
        }

        console.debug("-------------------------------------------");
        console.debug("Coco.js v" + this.$static.version + " initialized.");
        console.debug("Bugreport@ GitHub: https://github.com/3m5/coco/issues");
        console.debug("Handlebars v" + Handlebars.VERSION);
        console.debug("registered Handlebars helpers: ", Handlebars.helpers);
        console.debug("jQuery v" + $().jquery);

        if (this.Plugins != null) {
            console.debug("Detected Coco.Plugins: ", this.Plugins);
        }

        console.debug("-------------------------------------------");

        $("body").trigger(this.Event.INITIALIZED);

        this.initialized = true;
    }
});

module.exports = new Coco.SDK();