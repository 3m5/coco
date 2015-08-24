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
    $name: "testView2",
    //inheritance
    $extends: Coco.View,
    //jQuery selector to add this view
    //_anchor: ".testView",
    //router service
    $inject: ["router"],

    //jQuery events to handle directly
    _events: {
        //"EVENT CSS-Selector": "eventhandler-function"        
    },

    //_autoRender: true,

    /**
     * Variable: _template
     * Path to a handlebars file (relative to web root) or an CSS selector to an existing DOM element.
     * If a path is given, Coco will set it to the id of the script tag, after the file has been loaded.
     *
     * @protected
     */
    __tpl: require("./testTemplate.hbs"),

    onActive: function() {
        console.log("this is no autorendered class, so call it, after onActive was called (by Router)");
        this.loadData();
    },

    loadData: function() {
        setTimeout(() => {
            this.render();
        }, 500);
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
        this.$super();
    },

    /**
     * override super implementation of this function to add more properties on HBS model
     */
    _getHBSModel: function () {
        return {id:100, label:"Seite 2"};
    }
})