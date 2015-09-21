/**
 * Class: Coco.TestEvent
 *
 * Description:
 * This class is for all events triggered by Coco.Model instances
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
/// <reference path="./Coco.Event2.d.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
//declare function require(name:string);
var Coco;
(function (Coco) {
    var TestEvent = (function (_super) {
        __extends(TestEvent, _super);
        /**
         * Function: Constructor
         *
         * Parameter:
         * @param {string}                        type       - the type of this event
         *
         * @param {Coco.Model|Coco.Collection}    model      - The <Coco.Model> or <Coco.Collection> that dispatched the event
         *
         * @param {string}                        $key       - {optional} The key in the <Coco.Collection> that has changed in case of an change event
         */
        function TestEvent(type, model, $key) {
            _super.call(this, type, model);
            this.$name = "Coco.ModelEvent";
            /**
             * Variable: _key
             *
             * Description:
             * Key that has changed in case of an change event.
             */
            this._key = null;
            if (model == null) {
                throw new Error("Missing model parameter in " + this.$name + ".initialize");
            }
            //if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
            //    throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
            //}
            this._key = $key;
        }
        Object.defineProperty(TestEvent.prototype, "model", {
            /**
             * Function: get model
             *
             * Description:
             * return <Coco.Model> or <Coco.Collection> that dispatched this event.
             */
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TestEvent.prototype, "key", {
            /**
             * Function: get key
             *
             * Description:
             * returns the key of the model event depends to
             *
             * @return {String}
             */
            get: function () {
                return this._key;
            },
            enumerable: true,
            configurable: true
        });
        return TestEvent;
    })(Coco.Event);
    Coco.TestEvent = TestEvent;
})(Coco || (Coco = {}));
