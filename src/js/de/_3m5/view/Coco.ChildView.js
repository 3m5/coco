var Coco = Coco || {};

Coco.Utils = Coco.Utils || require("../lib/Coco.Utils.js");
Coco.Model = Coco.Model || require("../model/Coco.Model.js");
Coco.Collection = Coco.Collection || require("../model/Coco.Collection.js");
Coco.View = Coco.View || require("./Coco.View.js");

/**
 * Class: Coco.ChildView
 * This class holds a template and a model or collection. It adds events to the view and holds their callbacks.
 *
 * extends: <Coco.View>
 *
 * Description:
 * Extend from this class if your view will always be a child view. The only difference between Coco.View and
 * Coco.ChildView is that a child view does not call _onFirstRender on the initialize function.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = Coco.ChildView = dejavu.Class.declare({
    $name: 'ChildView',

    $extends: Coco.View,

    /**
     * Ctor.
     *
     * @param {Coco.Model|Coco.Collection}  $model                  Can be a new or existing model.
     * @param {Object}                      $syncModelWithForms     Override default options of view (optional).
     * @param {string}                      $template               Will override `this._template`
     */
    initialize: function ($model, $syncModelWithForms, $template) {
        this._injectServices();

        //kill service injection
        this._injectServices = null;

        // Assign new id to the view object
        this.__id = Coco.Utils.uniqueId("v");

        var modelSet = false;

        // Set the model if given
        if($model instanceof Coco.Model) {
            modelSet = true;
            this.setModel($model);
        }

        // Set the collection if given
        if (!modelSet && $model instanceof Coco.Collection) {
            modelSet = true;
            this.setCollection($model);
        }

        if($model && !modelSet) {
            console.error("Invalid model object! Coco.Model or Coco.Collection expected, given: ", $model);
        }

        // Extend the options
        this._options.syncModelWithForm = (null != $syncModelWithForms) ? $syncModelWithForms : false;

        // Set the template
        this._template = (typeof $template !== 'undefined' && null != $template) ? $template : this._template;

        // Call this._onInitialize before this.$el is set, to prevent any multiple rendering on initialization.
        this._onInitialize();

        // Create the html wrapper element.
        this.$el = $(this._anchor);
        this.$el.attr('data-coco', this.__id);

        this._configure();
    },

    /**
     * Function: autoRender()
     * Calls render. This function is used when ChildViews are added to another View. If the user does not want to
     * automatically render his ChildViews, override this function and leave it empty.
     *
     * Return:
     * @return Coco.View - The current <Coco.View> instance.
     */
    autoRender: function () {
        return this.render();
    }
});