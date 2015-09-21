/**
 * Class: Coco.Event
 *
 * Description:
 * This class is the base class for all Coco.Events.
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
module Coco {
    export class Event {
        public $name:String = 'Coco.Event';

        /**
         * Variable: _type {string}
         *
         * Description:
         * the type of dispatched event
         */
        protected _type:String;

        /**
         * Function: get type
         *
         * Descriptions:
         * returns the type of this event
         *
         * @return {String}
         */
        public get type():String {
            return this._type;
        }

        /**
         * Variable: _data {object}
         *
         * Description:
         * the data of dispatched event
         */
        protected _data:Object;

        /**
         * Function: get data
         *
         * Description:
         * returns the data object of this event
         *
         * @return {Object}
         */
        public get data():Object {
            return this._data;
        }

        //available types are:
        /**
         * Event: INITIALIZED
         * Called in <Coco> when Coco is initialized.
         */
        public static get INITIALIZED():String {
            return 'coco:initialized';
        }

        /**
         * Event: ADD
         * Called in <Coco.Collection> when a new <Coco.Model> has been added.
         */
        public static get ADD():String {
            return 'coco:add';
        }

        /**
         * Event: AUTHORIZATION_FAILED
         * Called in <Coco.BaseRestService> if http status 401 was received
         */
        public static get AUTHORIZATION_FAILED():String {
            return 'coco:authorization_failed';
        }

        /**
         * Event: CHANGE
         * Called in <Coco.Model> if the attributes changed.
         */
        public static get CHANGE():String {
            return 'coco:change';
        }

        /**
         * Event: CHANGE_KEY
         * Called in <Coco.Model> if a specified attribute changed. (Built like CHANGE_KEY + 'key').
         */
        public static get CHANGE_KEY():String {
            return 'coco:change:';
        }

        /**
         * Event: DESTROY
         * Called in <Coco.Model>, <Coco.Collection> and <Coco.View> before instance gets destroyed.
         */
        public static get DESTROY():String {
            return 'coco:destroy';
        }

        /**
         * Event: INTERNAL_SERVER_ERROR
         * Called in <Coco.BaseRestService> if http status 500 was received
         */
        public static get INTERNAL_SERVER_ERROR():String {
            return 'coco:internal_server_error';
        }

        /**
         * Event: INVALID
         * Called in <Coco.Model> if the validation of the model failed.
         */
        public static get INVALID():String {
            return 'coco:invalid';
        }

        /**
         * Event: REMOVE
         * Called in <Coco.Collection> if a <Coco.Model> instance has been removed from the collection.
         */
        public static get REMOVE():String {
            return 'coco:remove';
        }

        /**
         * Event: RENDER
         * Called in <Coco.View> when the DOM has been refreshed.
         */
        public static get RENDER():String {
            return 'coco:render';
        }

        /**
         * Event: RESET
         * Called in <Coco.Collection> when the collection has been reset.
         */
        public static get RESET():String {
            return 'coco:reset';
        }

        /**
         * Event: REST_SERVER_ERROR
         * Called in <Coco.Collection> when the collection has been reset.
         */
        public static get REST_SERVER_ERROR():String {
            return 'coco:rest-server-error';
        }

        /**
         * Event: SORTED
         * Called in <Coco.Collection> when the collection has been sorted.
         */
        public static get SORTED():String {
            return 'coco:sorted';
        }

        /**
         * Event: VALID
         * Called in <Coco.Model> when the validation of the model passed.
         */
        public static get VALID():String {
            return 'coco:valid';
        }

        constructor(type:String, $data:Object) {
            this._type = type;
            this._data = $data;
        }
    }
}