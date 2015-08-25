/**
 * (c) Johannes Klauss <johannes.klauss@3m5.de>
 * created at 14.01.14
 */

var Handlebars  = require('handlebars/runtime');

Handlebars.registerHelper('ifNot', function (v1, options) {
    if (!v1) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('nl2br', function (value) {
    if (!value) {
        return "";
    }
    return value.replace(/\n/g, "<br/>");
});

Handlebars.registerHelper('is', function (v1, v2, options) {
    if (v1 == v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('isNot', function (v1, v2, options) {
    if (v1 != v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('isGreater', function (v1, v2, options) {
    if (v1 > v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('isGreaterThan', function (v1, v2, options) {
    if (v1 >= v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('isLess', function (v1, v2, options) {
    if (v1 < v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('isLessThan', function (v1, v2, options) {
    if (v1 <= v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('testIf', function () {
    var args = Array.prototype.slice.call(arguments);

    // We just have one argument (besides options), so this one is just a regular
    if(args.length === 2) {
        return (args[0] == true) ? args[1].fn(this) : args[1].inverse(this);
    }

    if (v1 <= v2) {
        return options.fn(this);
    }

    return options.inverse(this);
});

Handlebars.registerHelper('trans', function (v1, options) {
    if (Coco.Init.i18n && v1.length > 0 && Coco.Plugins.i18n.Translator.has) {

    }

    return options.inverse(this);
});