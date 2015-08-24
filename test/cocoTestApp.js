/**
 * @author (c) Andreas Wiedenfeld <andreas.wiedenfeld@3m5.de>
 * updated at 19.06.2015
 */
/** @namespace **/

var Coco = require("../src/js/de/_3m5/Coco.Init.js");
var TestCollection = require("./testCollection");
var TestView = require("./testView");

var CocoApplication = dejavu.Class.declare({

    initialize() {
        console.log("CocoTestApp initialized, look at available Coco-Classes: ", Coco);

        var innerModel = new Coco.Model({id:123, label:"innerModel", properts: "myInnerProperty"});
        var innerCollection = new TestCollection([{id:1, label:11}, {id:2, label:22}]);
        var testModel = new Coco.Model({id:12, label:"myLabel", property: innerModel, properties: innerCollection});

        console.log(testModel);
        console.log(testModel.getAttributes());

        var testView = new TestView(testModel);
        //testView.render();
    }

});

$(document).ready(() => {
    new CocoApplication();
})
//module.exports = new CocoApplication();

/** @class Coco.config **/
/*Coco.config = $.extends({
    cacheHbs: true,             // If set to true, handlebar files will be cached, which increases the performance of View and ChildView creation.
    baseUrl: null,              //server context path
    router: {
        loaderDelay: 300        // When views are swapped by Router, this time adjusts when the loading class
    },
    restService: {              //restService configuration
        path: null,             //restService path
        cacheGet: 600,          //cache time for GET Requests of same url in seconds
        cachePost: null         //cache time for GET Requests of same url in seconds
    }
}, (Coco.config != null) ? Coco.config : {});*/

if(!Coco.config) {
    Coco.config = {
        cacheHbs: true,             // If set to true, handlebar files will be cached, which increases the performance of View and ChildView creation.
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
}