/**
 * @author (c) Andreas Wiedenfeld <andreas.wiedenfeld@3m5.de>
 * updated at 19.06.2015
 */
/** @namespace **/

var Coco = require("../src/js/de/_3m5/Coco.Init.js");
var TestCollection = require("./testCollection");
var TestView = require("./testView");
var TestView2 = require("./testView2");

var CocoApplication = dejavu.Class.declare({

    initialize() {
        console.log("CocoTestApp initialized, look at available Coco-Classes: ", Coco);

        var innerModel = new Coco.Model({id:123, label:"innerModel", properts: "myInnerProperty"});
        var innerCollection = new TestCollection([{id:1, label:11}, {id:2, label:22}]);
        var testModel = new Coco.Model({id:12, label:"myLabel", property: innerModel, properties: innerCollection});

        innerCollection.add(innerModel);
        console.log(testModel);
        console.log(testModel.getAttributes());

        innerCollection.remove(innerModel);

		// !!! NOTICE !!!
		// typescript and es6 objects only work WITHOUT any usage of dejavu!
		//console.log(".Coco.TestEvent ", Coco.TestEvent);
		//console.log(".Coco.TestModelEvent ", Coco.TestModelEvent);
		//console.log(".Coco.Event2 ", Coco.Event2);
		//var testEvent = new Coco.Event2("asd", innerModel);

        //new TestView(testModel);
        //testview is autorendered by flag
        //testView.render();

        new Coco.Router('.routerView', {
            dashboard: {
                path: '/',
                view: TestView,
                model: testModel
            },
            imprint: {
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
    baseUrl: "baseURL",              //server context path
    router: {
        loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
    },
    restService: {              //restService configuration
        path: null,             //restService path
        cacheGet: 600,          //cache time for GET Requests of same url in seconds
        cachePost: null         //cache time for GET Requests of same url in seconds
    }
};
