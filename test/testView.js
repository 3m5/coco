/**
 * Class: testView
 *
 * Package:
 *
 * extends <Coco.View>
 *
 * Description:
 *
 * (c) 2013 3m5. Media GmbH
 */
var Coco = require("../src/js/de/_3m5/Coco.Init.js");

module.exports = dejavu.Class.declare({
    //className
    $name: "testView",
    //inheritance
    $extends: Coco.View,
    //jQuery selector to add this view
    //_anchor: ".testView",
    $inject: ["router"],
    //jQuery events to handle directly
    _events: {
        //"EVENT CSS-Selector": "eventhandler-function"
    },

    _autoRender: true,

    /**
     * Variable: _template
     * Path to a handlebars file (relative to web root) or an CSS selector to an existing DOM element.
     * If a path is given, Coco will set it to the id of the script tag, after the file has been loaded.
     *
     * @protected
     */
    _template: require("./testTemplate.hbs"),

    _onInitialize() {
        this.addEventListener(Coco.Event.RENDER, (event) => {
            this._onRender(event);
        })
    },

    _onRender(event) {
        console.log(this.$name + ".onRender ", event);
    },

    /**
     * Constructor
     */
    _onFirstRender: function () {
        console.error(this.$name + " rendered");
    },

    /**
     * Override Coco.View function render, to do sth before or after that, e.g. return the rendered content
     */
    render: function () {
        console.log(this.$name + ".render...");
        var result = this.$super();
        return result;
    },

    /**
     * override super implementation of this function to add more properties on HBS model
     */
    _getHBSModel: function () {
        return this.$super();
    }
})
