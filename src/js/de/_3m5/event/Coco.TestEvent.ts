/**
 * Class: Coco.TestEvent
 *
 * Description:
 * This class is for all events triggered by Coco.Model instances
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
/// <reference path="./Coco.Event2.d.ts"/>
/// <reference path="./Coco.Event2.ts"/>

declare function require(name:string);

var Event2 = require("./Coco.Event2.js");

class TestEvent extends Event2 {
    public $name:String = "Coco.ModelEvent";

    /**
     * Function: get model
     *
     * Description:
     * getter only - return <Coco.Model> or <Coco.Collection> that dispatched this event.
     */
    public get model():Object {
        return this._data;
    }

    /**
     * Variable: _key
     *
     * Description:
     * protected key that has changed in case of an change event.
     */
    protected _key:String = null;

    /**
     * Function: get key
     *
     * Description:
     * getter only - returns the key of the model event depends to
     *
     * @return {String}
     */
    public get key():String {
        return this._key;
    }

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
    constructor(type:String, model:Object, $key:String) {
        super(type, model);
        if (model == null) {
            throw new Error("Missing model parameter in " + this.$name + ".initialize");
        }
        if (!(model instanceof require("../model/Coco.Model.js") || model instanceof require("../model/Coco.Collection.js"))) {
            throw new Error("Invalid model parameter in " + this.$name + ".initialize. Must be Coco.Model or Coco.Collection!");
        }
        this._key = $key;
    }
}
export = TestEvent;