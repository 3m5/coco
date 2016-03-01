/**
 * JavaScript (c) 2012 3m5. Media GmbH
 * File: testCollection
 *
 * Description:
 *
 */

var Coco = require("../src/js/de/_3m5/Coco.Init.js");

module.exports = dejavu.Class.declare({
    $name: "TestCollection",
    $extends : Coco.Collection,

    _modelClass: Coco.Model,

    _onInitialize() {
        this.addEventListener(Coco.Event.ADD, (event) => {this._onModelAdded(event);});
        this.addEventListener(Coco.Event.REMOVE, this._onModelRemoved.bind(this), true);
    },

    /**
     * EventHandler, when model was added to collection
     **/
    _onModelAdded: function (modelEvent) {
        console.error("model added ", modelEvent);
        modelEvent.model.addEventListener(Coco.Event.CHANGE, this._onModelChanged);

    },

    /**
     * EventHandler, when model was removed from collection
     **/
    _onModelRemoved: function (model) {
        console.error("model removed ", model, this);
    },

    /**
     * EventHandler is called after properties of child model was changed
     **/
    _onModelChanged: function (model) {
        //TODO implement model changed event handler if needed
        console.error("model changed ", model, this);
    }


});
