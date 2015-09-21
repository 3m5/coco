/// <reference path="Coco.Event2.d.ts" />
/**
 * Class: Coco.TestEvent
 *
 * Description:
 * This class is for all events triggered by Coco.Model instances
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
declare module Coco {
    class TestEvent extends Event {
        $name: String;
        /**
         * Function: get model
         *
         * Description:
         * return <Coco.Model> or <Coco.Collection> that dispatched this event.
         */
        model: Object;
        /**
         * Variable: _key
         *
         * Description:
         * Key that has changed in case of an change event.
         */
        protected _key: String;
        /**
         * Function: get key
         *
         * Description:
         * returns the key of the model event depends to
         *
         * @return {String}
         */
        key: String;
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
        constructor(type: String, model: Object, $key: String);
    }
}
