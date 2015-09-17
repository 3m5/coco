/**
 * Class: Coco.Event
 *
 * Description:
 * This {abstract} class manages all events and attached callbacks.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
var Model = module.exports = dejavu.Class.declare({
    $name: 'Coco.Event',

    /**
     * Variable: type {string}
     *
     * Description:
     * the type of dispatched event
     */
    type: null,

    /**
     * Variable: data {object}
     *
     * Description:
     * the data of dispatched event
     */
    data: null,

    //available types are:
    $constants: {
        /**
         * Event: INITIALIZED
         * Called in <Coco> when Coco is initialized.
         */
        INITIALIZED: 'coco:initialized',
        /**
         * Event: ADD
         * Called in <Coco.Collection> when a new <Coco.Model> has been added.
         */
        ADD: 'coco:add',
        /**
         * Event: AUTHORIZATION_FAILED
         * Called in <Coco.BaseRestService> if http status 401 was received
         */
        AUTHORIZATION_FAILED: 'coco:authorization_failed',
        /**
         * Event: CHANGE
         * Called in <Coco.Model> if the attributes changed.
         */
        CHANGE: 'coco:change',
        /**
         * Event: CHANGE_KEY
         * Called in <Coco.Model> if a specified attribute changed. (Built like CHANGE_KEY + 'key').
         */
        CHANGE_KEY: 'coco:change:',
        /**
         * Event: DESTROY
         * Called in <Coco.Model>, <Coco.Collection> and <Coco.View> before instance gets destroyed.
         */
        DESTROY: 'coco:destroy',
        /**
         * Event: INTERNAL_SERVER_ERROR
         * Called in <Coco.BaseRestService> if http status 500 was received
         */
        INTERNAL_SERVER_ERROR: 'coco:internal_server_error',
        /**
         * Event: INVALID
         * Called in <Coco.Model> if the validation of the model failed.
         */
        INVALID: 'coco:invalid',
        /**
         * Event: REMOVE
         * Called in <Coco.Collection> if a <Coco.Model> instance has been removed from the collection.
         */
        REMOVE: 'coco:remove',
        /**
         * Event: RENDER
         * Called in <Coco.View> when the DOM has been refreshed.
         */
        RENDER: 'coco:render',
        /**
         * Event: RESET
         * Called in <Coco.Collection> when the collection has been reset.
         */
        RESET: 'coco:reset',
        /**
         * Event: REST_SERVER_ERROR
         * Called in <Coco.Collection> when the collection has been reset.
         */
        REST_SERVER_ERROR: 'coco:rest-server-error',
        /**
         * Event: SORTED
         * Called in <Coco.Collection> when the collection has been sorted.
         */
        SORTED: 'coco:sorted',
        /**
         * Event: VALID
         * Called in <Coco.Model> when the validation of the model passed.
         */
        VALID: 'coco:valid'
    },

    /**
     * Constructor
     *
     * @param type {string} - type of event to dispatch
     * @param $data {object} - optional event data object to send
     */
    initialize: function (type, $data) {
        this.type = type;
        this.data = $data;
    },

    /**
     * Function: _createModelChangeKey
     * {protected} creates an Event String for the model Event <Coco.Event.CHANGE_KEY>
     *
     * Parameter:
     * key - String of key to create Change-Event to
     */
    _createModelChangeKey : function(key) {
        return Model.CHANGE_KEY + key;
    }
});