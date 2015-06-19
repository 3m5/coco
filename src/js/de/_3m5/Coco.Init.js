var Coco = Coco || {};
var Handlebars  = require('handlebars');
require("./helpers/HandlebarsHelpers.js");
/**
 * Class: .Coco
 * v0.9.91
 *
 * 3m5. Javascript SDK main class (Coco.Init)
 *
 * instantiates automatically on $(document).ready Event
 *
 * triggers <Coco.Event.INITIALIZED> Event on body when Coco is ready
 *
 * (c) 2014 3m5. Media GmbH
 */
Coco.SDK = dejavu.Class.declare({
    $name: "Coco.Init",

    ////////////////////////////////////////////////////////////
    //////// CLASS DEFINITIONS
    Event: require("./event/Coco.Event.js"),

    //PACKAGE MODEL
    model: {
        Model: require("./model/Coco.Model.js"),
        Collection: require("./model/Coco.Collection.js")
    },

    //PACKAGE SERVICE
    service: {
        BaseRestService: require("./service/Coco.BaseRestService.js"),
        Service: require("./service/Coco.Service.js"),
        ServiceContainer: require("./service/Coco.ServiceContainer.js"),
        ServiceProvider: require("./service/Coco.ServiceProvider.js")
    },

    //PACKAGE LIB
    lib: {
        HashMap: require("./lib/Coco.HashMap.js"),
        //HbsLoader: require("lib/Coco.HbsLoader.js"), not needed anymore, hbs files are compiled by handlebars plugin
        //DateHelper, not needed as well, use momentJS instead
        Math: require("./lib/Coco.Math.js"),
        Utils: require("./lib/Coco.Utils.js"),
        Storage: require("./lib/Coco.Storage.js"),
        StringUtils: require("./lib/Coco.StringUtils.js")
    },

    //PACKAGE MODEL
    view: {
        View: require("./view/Coco.View.js"),
        ChildView: require("./view/Coco.ChildView.js")
    },

    //////// CLASS DEFINITIONS END
    ////////////////////////////////////////////////////////////

    $statics: {
        version: "0.9.93",
        initialized: false,
        html: false,
        i18n: false
    },

    testFunction() {
        console.log("call test function");
    },

    initialize: function () {
        console.logWithDate = true;

        if(Handlebars == null) {
            throw new Error("Missing Handlebars! store node module 'Handlebars' into window element!");
        }

        try {
            $;
        } catch(error) {
            throw new Error("Missing jQuery! Install jQuery to use Coco.SDK ", error);
        }

        console.debug("-------------------------------------------");
        console.debug("Coco.js v" + this.$static.version);
        console.debug("Handlebars v" + Handlebars.VERSION);
        console.debug("Handlebars helpers: ", Handlebars.helpers);
        console.debug("jQuery v" + $().jquery);

        if (Coco.Plugins != null) {
            if (Coco.Plugins.html != null) {
                console.debug("Detected Coco.Plugins.html");

                Coco.Init.html = true;
            }
            if (Coco.Plugins.i18n != null) {
                console.debug("Detected Coco.Plugins.i18n");

                this.$statics.i18n = true;
            }
        }

        console.debug("-------------------------------------------");

        $("body").trigger(this.Event.INITIALIZED);

        this.initialized = true;
    }
});

//console.log("Coco: ", new Coco());
module.exports = new Coco.SDK();