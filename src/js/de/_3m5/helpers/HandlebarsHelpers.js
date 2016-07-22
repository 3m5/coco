/**
 * (c) Johannes Klauss <johannes.klauss@3m5.de>
 * created at 14.01.14
 */

var Handlebars = require('handlebars/runtime'),
    JSON = require("JSON");

Handlebars.registerHelper('getText', function (key, $replace) {
  var Coco = require("../Coco.Init.js");
  //console.log(".$replace: ", $replace);
  //if $replace is not set in template, its not null here, its an handlebars object...
  if(typeof $replace == "number") {
    //keep numbers working
    $replace = [$replace];
  } else {
    if (typeof $replace != "string") {
      $replace = null;
    } else {
      try {
        //parse strings to object/ array
        $replace = JSON.parse($replace);
      } catch(error) {
        //keep strings
        $replace = [$replace];
      }
    }
  }
  return Coco.Translator.get(key, $replace);
});

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

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
	switch (operator) {
		case '==':
			return (v1 == v2) ? options.fn(this) : options.inverse(this);
		case '!=':
			return (v1 != v2) ? options.fn(this) : options.inverse(this);
		case '===':
			return (v1 === v2) ? options.fn(this) : options.inverse(this);
		case '<':
			return (v1 < v2) ? options.fn(this) : options.inverse(this);
		case '<=':
			return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		case '>':
			return (v1 > v2) ? options.fn(this) : options.inverse(this);
		case '>=':
			return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		case '&&':
			return (v1 && v2) ? options.fn(this) : options.inverse(this);
		case '||':
			return (v1 || v2) ? options.fn(this) : options.inverse(this);
		default:
			return options.inverse(this);
	}
});

Handlebars.registerHelper('add', function (v1, v2) {
  return Number(v1) + Number(v2);
});

Handlebars.registerHelper('sub', function (v1, v2) {
  return Number(v1) - Number(v2);
});

Handlebars.registerHelper('concat', function (v1, v2) {
  return v1 + v2;
});

Handlebars.registerHelper('for', function (from, to, step, block) {
  var accum = '';
  for(var i = from; i < to; i += step) {
    accum += block.fn(i);
  }
  return accum;
});

Handlebars.registerHelper('is', function (v1, v2, options) {
	console.error("Handlebars.Helper 'is' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('isNot', function (v1, v2, options) {
	console.error("Handlebars.Helper 'isNot' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('isGreater', function (v1, v2, options) {
	console.error("Handlebars.Helper 'isGreater' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('isGreaterThan', function (v1, v2, options) {
	console.error("Handlebars.Helper 'isGreaterThan' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('isLess', function () {
	console.error("Handlebars.Helper 'isLess' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('isLessThan', function () {
	console.error("Handlebars.Helper 'isLessThan' is deprecated! use 'ifCond' instead!");
});

Handlebars.registerHelper('testIf', function () {
	var args = Array.prototype.slice.call(arguments);

	// We just have one argument (besides options), so this one is just a regular
	if (args.length === 2) {
		return (args[0] == true) ? args[1].fn(this) : args[1].inverse(this);
	}

	if (v1 <= v2) {
		return options.fn(this);
	}

	return options.inverse(this);
});
