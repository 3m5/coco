/**
 * Class: Coco.Event
 *
 * Description:
 * This class is the base class for all Coco.Events.
 *
 * @author: andreas.wiedenfeld@3m5.de on 21.09.2015.
 */
let Coco = Coco || {};

Coco.Event = class {

  constructor(type, $data = null) {
    /**
     * Variable: _type {string}
     *
     * Description:
     * the type of dispatched event
     */
    if(!this._validateEventType(type)) {
      console.error(this.$name + ".invalid type given! ", type);
    }
    this._type = type;
    /**
     * Variable: _data {object}
     *
     * Description:
     * the data of dispatched event
     */
    this._data = $data;
  }

  _validateEventType(type) {
    return Coco.Event[type] != null;
  }

  /**
   * Function: _createModelChangeKey
   * {protected} creates an Event String for the model Event <Coco.Event.CHANGE_KEY>
   *
   * Parameter:
   * key - String of key to create Change-Event to
   */
  _createModelChangeKey(key) {
    return Coco.Event.CHANGE_KEY + key;
  }

  get $name() {
    return "Coco.Event2";
  }

  /**
   * Function: get type
   *
   * Descriptions:
   * returns the type of this event
   *
   * @return {String}
   */
  get type() {
    return this._type;
  }

  /**
   * Function: get data
   *
   * Description:
   * returns the data object of this event
   *
   * @return {Object}
   */
  get data() {
    return this._data;
  }

  //available types are:
  /**
   * Event: INITIALIZED
   * Called in <Coco> when Coco is initialized.
   */
  static get INITIALIZED() {
    return 'INITIALIZED';
  }

  /**
   * Event: ADD
   * Called in <Coco.Collection> when a new <Coco.Model> has been added.
   */
  static get ADD() {
    return 'ADD';
  }

  /**
   * Event: AUTHORIZATION_FAILED
   * Called in <Coco.BaseRestService> if http status 401 was received
   */
  static get AUTHORIZATION_FAILED() {
    return 'AUTHORIZATION_FAILED';
  }

  /**
   * Event: CHANGE
   * Called in <Coco.Model> if the attributes changed.
   */
  static get CHANGE() {
    return 'CHANGE';
  }

  /**
   * Event: CHANGE_KEY
   * Called in <Coco.Model> if a specified attribute changed. (Built like CHANGE_KEY + 'key').
   */
  static get CHANGE_KEY() {
    return 'CHANGE_KEY';
  }

  /**
   * Event: DESTROY
   * Called in <Coco.Model>, <Coco.Collection> and <Coco.View> before instance gets destroyed.
   */
  static get DESTROY() {
    return 'DESTROY';
  }

  /**
   * Event: INTERNAL_SERVER_ERROR
   * Called in <Coco.BaseRestService> if http status 500 was received
   */
  static get INTERNAL_SERVER_ERROR() {
    return 'INTERNAL_SERVER_ERROR';
  }

  /**
   * Event: INVALID
   * Called in <Coco.Model> if the validation of the model failed.
   */
  static get INVALID() {
    return 'INVALID';
  }

  /**
   * Event: REMOVE
   * Called in <Coco.Collection> if a <Coco.Model> instance has been removed from the collection.
   */
  static get REMOVE() {
    return 'REMOVE';
  }

  /**
   * Event: RENDER
   * Called in <Coco.View> when the DOM has been refreshed.
   */
  static get RENDER() {
    return 'RENDER';
  }

  /**
   * Event: RESET
   * Called in <Coco.Collection> when the collection has been reset.
   */
  static get RESET() {
    return 'RESET';
  }

  /**
   * Event: REST_SERVER_ERROR
   * Called in <Coco.Collection> when the collection has been reset.
   */
  static get REST_SERVER_ERROR() {
    return 'REST_SERVER_ERROR';
  }

  /**
   * Event: SORTED
   * Called in <Coco.Collection> when the collection has been sorted.
   */
  static get SORTED() {
    return 'SORTED';
  }

  /**
   * Event: VALID
   * Called in <Coco.Model> when the validation of the model passed.
   */
  static get VALID() {
    return 'VALID';
  }
};

module.exports = Coco.Event;
