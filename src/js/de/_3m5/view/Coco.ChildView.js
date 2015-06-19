var Coco = Coco || {};

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
Coco.ChildView = dejavu.Class.declare({
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
        if ($model instanceof Coco.Collection) {
            modelSet = true;
            this.setCollection($model);
        }

        if($model != null && !modelSet) {
            console.error("Invalid model object! Coco.Model or Coco.Collection expected, given: " + $model);
        }

        // Extend the options
        this._options.syncModelWithForm = (null != $syncModelWithForms) ? $syncModelWithForms : false;

        // Set the template
        this._template = (typeof $template !== 'undefined' && null !== $template) ? $template : this._template;

        // Call this._onInitialize before this.$el is set, to prevent any multiple rendering on initialization.
        this._onInitialize();

        // Create the html wrapper element.
        this.$el = $(this._anchor);
        this.$el.attr('data-coco', this.__id);

        this.__configure();

        // Check if template is handlebar template...
        // We don't render anything here. Since it's a child view, the Coco.View.getDom method is called in Coco.View.addChildView, which will cause the rendering.
        if (Coco.HbsLoader.isHandlebar(this._template)) {
            this.__parseTemplate();
        }
        else if (this._template !== null) {
            //... or css selector
            this.__tpl = $(this._template).html();
        }

        // Omit the this._onFirstRender() call.
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