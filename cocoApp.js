/**
 * @author (c) Andreas Wiedenfeld <andreas.wiedenfeld@3m5.de>
 * updated at 19.06.2015
 */
/** @namespace **/

var Coco = require("3m5-coco");


var CocoApplication = dejavu.Class.declare({

    initialize() {
        console.log("Coco initialized, look at available classes: ", Coco);
    }

});

module.exports = new CocoApplication();

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