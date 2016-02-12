// Rewrite modern console methods for olders browsers (like IE 9/10)
if (!window.console) {
  window.console = {};
} else {
  window.console.logWithDate = true;
}
if (!window.console.debug) {
  window.console.debug = window.console.log || function () {
    };
}

if (!window.console.error) {
  window.console.error = window.console.log || function () {
    };
}

if (!window.console.warn) {
  window.console.warn = window.console.log || function () {
    };
}

//add $compute function to all functions
/** $compute function to register change listeners to properties in Coco.Model */
if (!Function.prototype.$compute) {
  Function.prototype.$compute = function () {
    var fn   = this;
    var args = Array.prototype.slice.call(arguments);

    /**
     * We capsule the function and the $compute properties, because our this context is the function and not the
     * model. When the model gets instantiated we call this returned function with the model context, set the observers
     * and return the original function (with assigned model context) back to the initial model property.
     */
    var retFn = function (targetAttribute, observers) {
      for (var i = 0; i < args.length; i++) {
        observers.push({
          attribute: args[i],
          target:    targetAttribute,
          old:       fn.call(this)
        });
      }

      return fn.$bind(this);
    };

    // Assign a flag to the function, that we can distinct between normal functions as attributes and computed properties.
    retFn.isComputed = true;

    return retFn;
  }
}

// Dependencies
var Handlebars = require('handlebars/runtime');

//use babel polyfill for IE support
require("babel/polyfill");

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
 * CONFIGURATION:
 *
 * config: {
		baseUrl: "/",               //server context path
		locale: "de",               //the Coco default locale
		router: {
			loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
		},
		restService: {              //restService configuration
			path: "rest/",          //restService path
			cacheGet: 0          	//cache time in SECONDS for GET Requests of same url, value lower than 0 causes unlimited cache
		}
	}
 *
 * (c) 2015 3m5. Media GmbH
 */
class Coco {

  ////////////////////////////////////////////////////////////
  //////// CONFIGURATION
  get config() {
    return this._config;
  }

  set config(config) {
    this._config = config;
  }

  //////// CLASS DEFINITIONS

  // PACKAGE EVENT
  static get Event() {
    return require("./event/Coco.Event");
  }

  static get ModelEvent() {
    return require("./event/Coco.ModelEvent");
  }

  static get RouterEvent() {
    return require("./event/Coco.RouterEvent");
  }

  static get ViewEvent() {
    return require("./event/Coco.ViewEvent");
  }

  static get RestServiceEvent() {
    return require("./event/Coco.RestServiceEvent.js");
  }

  static get EventDispatcher() {
    return require("./event/Coco.EventDispatcher.js");
  }

  //PACKAGE MODEL
  static get Model() {
    return require("./model/Coco.Model.js");
  }

  static get Collection() {
    return require("./model/Coco.Collection.js");
  }

  //PACKAGE SERVICE
  static get Service() {
    return require("./service/Coco.Service.js");
  }

  static get ServiceProvider() {
    return require("./service/Coco.ServiceProvider.js");
  }

  //PACKAGE ROUTER
  static get Router() {
    return require("./router/Coco.Router.js");
  }

  //REST
  static get BaseRestService() {
    return require("./service/Coco.BaseRestService.js");
  }

  //PACKAGE LIB
  static get Math() {
    return require("./lib/Coco.Math.js");
  }

  static get Utils() {
    return require("./lib/Coco.Utils.js");
  }

  static get Storage() {
    return require("./lib/Coco.Storage.js");
  }

  static get StringUtils() {
    return require("./lib/Coco.StringUtils.js");
  }

  static get URLHelper() {
    return require("./lib/Coco.URLHelper.js");
  }

  //PACKAGE VIEW
  static get View() {
    return require("./view/Coco.View.js");
  }

  static get ChildView() {
    return require("./view/Coco.ChildView.js");
  }

  //PLUGINS
  static get Plugins() {
    return {
      i18n: {
        Translator: require("./plugins/i18n/Coco.Translator.js")
      }
    }
  }

  //////// CLASS DEFINITIONS END
  ////////////////////////////////////////////////////////////

  static get version() {
    return "0.2.0";
  }

  get initialized() {
    this._initialized;
  }

  static init() {
    this._initialized = false;

    this._config = {
      baseUrl: "/",             //server context path
      router: {
        loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
      },
      restService: {            //restService configuration
        path:     "rest/",      //restService path
        cacheGet: 600           //cache time for GET Requests of same url in seconds
      },
      locale: "de"              //the Coco default locale
    };

    if (Handlebars == null) {
      throw new Error("Missing Handlebars! include npm-module 'handlebars' into your project!");
    }

    try {
      $;
    } catch (error) {
      throw new Error("Missing jQuery! Install jQuery to use Coco.SDK ", error);
    }

    console.debug("-------------------------------------------");
    console.debug("Coco.js v" + Coco.version + " initialized.");
    console.debug("Bugreport@ GitHub: https://github.com/3m5/coco/issues");
    console.debug("Handlebars v" + Handlebars.VERSION);
    console.debug("registered Handlebars helpers: ", Handlebars.helpers);
    console.debug("jQuery v" + $().jquery);

    if (this.Plugins != null) {
      console.debug("Detected Coco.Plugins: ", Coco.Plugins);
    }

    console.debug("-------------------------------------------");

    $("body").trigger(Coco.Event.INITIALIZED);

    this._initialized = true;
  }
};
//initialize Coco SDK
Coco.init();

module.exports = Coco;
