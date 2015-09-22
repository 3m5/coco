/**
 * Class: Coco.Event
 *
 * Description:
 * This class is the base class for all Coco.Events.
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
declare class Event2 {
    $name: String;
    /**
     * Variable: _type {string}
     *
     * Description:
     * the type of dispatched event
     */
    private _type;
    /**
     * Function: get type
     *
     * Descriptions:
     * returns the type of this event
     *
     * @return {String}
     */
    type: String;
    /**
     * Variable: _data {object}
     *
     * Description:
     * the data of dispatched event
     */
    protected _data: Object;
    /**
     * Function: get data
     *
     * Description:
     * returns the data object of this event
     *
     * @return {Object}
     */
    data: Object;
    /**
     * Event: INITIALIZED
     * Called in <Coco> when Coco is initialized.
     */
    static INITIALIZED: String;
    /**
     * Event: ADD
     * Called in <Coco.Collection> when a new <Coco.Model> has been added.
     */
    static ADD(): String;
    /**
     * Event: AUTHORIZATION_FAILED
     * Called in <Coco.BaseRestService> if http status 401 was received
     */
    static AUTHORIZATION_FAILED: String;
    /**
     * Event: CHANGE
     * Called in <Coco.Model> if the attributes changed.
     */
    static CHANGE: String;
    /**
     * Event: CHANGE_KEY
     * Called in <Coco.Model> if a specified attribute changed. (Built like CHANGE_KEY + 'key').
     */
    static CHANGE_KEY: String;
    /**
     * Event: DESTROY
     * Called in <Coco.Model>, <Coco.Collection> and <Coco.View> before instance gets destroyed.
     */
    static DESTROY: String;
    /**
     * Event: INTERNAL_SERVER_ERROR
     * Called in <Coco.BaseRestService> if http status 500 was received
     */
    static INTERNAL_SERVER_ERROR: String;
    /**
     * Event: INVALID
     * Called in <Coco.Model> if the validation of the model failed.
     */
    static INVALID: String;
    /**
     * Event: REMOVE
     * Called in <Coco.Collection> if a <Coco.Model> instance has been removed from the collection.
     */
    static REMOVE: String;
    /**
     * Event: RENDER
     * Called in <Coco.View> when the DOM has been refreshed.
     */
    static RENDER: String;
    /**
     * Event: RESET
     * Called in <Coco.Collection> when the collection has been reset.
     */
    static RESET: String;
    /**
     * Event: REST_SERVER_ERROR
     * Called in <Coco.Collection> when the collection has been reset.
     */
    static REST_SERVER_ERROR: String;
    /**
     * Event: SORTED
     * Called in <Coco.Collection> when the collection has been sorted.
     */
    static SORTED: String;
    /**
     * Event: VALID
     * Called in <Coco.Model> when the validation of the model passed.
     */
    static VALID: String;
    constructor(type: String, $data: Object);
}
export = Event2;
