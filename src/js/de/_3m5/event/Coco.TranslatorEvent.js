var Coco = Coco || {};
Coco.Event = require("./Coco.Event.js");
/**
 * Class: Coco.TranslatorEvent
 *
 * Description:
 * Event class that will be dispatched by for Events in <Coco.Translator>.
 *
 * (c) 2016 3m5. Media GmbH
 */
module.exports = dejavu.Class.declare({
    $name: "Coco.TranslatorEvent",
    $extends: Coco.Event,

    /**
     * Variable: locale {string}
     *
	   * Description:
     * the current locale
     */
    locale: null,

    $constants: {
        /**
         * Event: CHANGE_LOCALE
         * Called in <Coco.Translator> when the locale was changed.
         */
        CHANGE_LOCALE: 'coco:locale:change'
    },

    /**
     * Function: Constructor
     *
     * Parameter:
     * @param {string}  type          - The type that dispatched the event
     * @param {string}  locale        - The current locale
     */
    initialize: function (type, locale) {
        this.$super(type);
        if (locale == null) {
            throw new Error("Missing locale parameter in " + this.$name + ".initialize");
        }
        this.locale = locale;
    }

});
