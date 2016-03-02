/**
 * @author (c) Andreas Wiedenfeld <andreas.wiedenfeld@3m5.de>
 * updated at 19.06.2015
 */
/** @namespace **/

var Coco           = require("../src/js/de/_3m5/Coco.Init.js");
var TestCollection = require("./testCollection");
var TestView       = require("./testView");
var TestView2      = require("./testView2");

var CocoApplication = dejavu.Class.declare({

  initialize() {
    console.log("CocoTestApp initialized, look at available Coco-Classes: ", Coco);

    Coco.Translator.loadMessagesFromObject({
      title:  {
        1: "bla-de",
        2: "blub"
      },
      title2: "Hallo %0%"
    }, "de");

    Coco.Translator.loadMessagesFromObject({
      title:  {
        1: "bla-en",
        2: "blub-en"
      },
      title2: "Hallo %0%"
    }, "en");

    Coco.Translator.setLocale("de");
    console.log("i18n example (de): " + Coco.Translator.get("title.1"));
    console.log("i18n example with replacement: " + Coco.Translator.get("title2", ["Tom"]));

    //change locale
    Coco.Translator.setLocale("en");
    console.log("i18n example (en): " + Coco.Translator.get("title.1"));

    var innerModel      = new Coco.Model({id: 123, label: "innerModel", properts: "myInnerProperty"});
    var innerCollection = new TestCollection([{id: 1, label: 11}, {id: 2, label: 22}]);
    var testModel       = new Coco.Model({id: 12, label: "myLabel", property: innerModel, properties: innerCollection});

    innerCollection.add(innerModel);
    console.log(testModel.getAttributes());

    innerCollection.remove(innerModel);

    //new TestView(testModel);
    //testview is autorendered by flag
    //testView.render();

    new Coco.Router('.routerView', {
      dashboard: {
        path:  '/',
        view:  TestView,
        model: testModel
      },
      imprint:   {
        path: '/testView2',
        view: TestView2
      }
    }, '/');
  }

});

$(document).ready(() => {
  new CocoApplication();
})

Coco.config = {
  baseUrl:     "baseURL",              //server context path
  router:      {
    loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
  },
  restService: {              //restService configuration
    path:      null,             //restService path
    cacheGet:  600,          //cache time for GET Requests of same url in seconds
    cachePost: null         //cache time for GET Requests of same url in seconds
  },
  i18n:        {
    locale: "de",
    domain: "/"
  }
};
