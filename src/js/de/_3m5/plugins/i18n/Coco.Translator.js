var JSON = require("JSON"),
    _    = require("underscore");

/**
 * Package: Plugins.i18n
 *
 * Class: Coco.Plugins.i18n.Translator
 *
 * Description:
 * This class stores messages per locale and domain and can be used to translate placeholders.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
module.exports = dejavu.Class.declare({
  $name: "Coco.Translator",

  /**
   * All retrieved messages are stored in here.
   *
   * @private
   * @type {Object}
   */
  __messages: {},

  /**
   * The current locale.
   *
   * @private
   * @type {string}
   * @default
   */
  __locale: "de",

  /**
   * The current domain.
   *
   * @private
   * @type {string}
   * @default
   */
  __domain: "default",

  /**
   * Function: loadMessages
   *
   * Description:
   * Loads all messages from a json file synchronously by given path.
   *
   * Parameter:
   * @param {string}  path   -   The JSON file to load.
   * @param {function}  $callback -   (optional) callback function
   * @param {string}  $locale -  (optional) If set the locale will be changed.
   * @param {string}  $domain -  (optional) If set the message will be added to given $domain.
   */
  loadMessages: function (path, $callback, $locale, $domain) {

    return $.ajax({
      url:      path,
      global:   false,
      async:    true,
      dataType: "json",
      success:  (data) => {
        if (typeof data == "string") {
          data = JSON.parse(data);
        }
        if ($locale != null) {
          this.__locale = $locale;
        }

        if ($domain != null) {
          this.__domain = $domain;
        }

        this.createDomain(this.__domain);
        this.fill(data);
        if ($callback) {
          $callback();
        }
      }
    });
  },

  /**
   * Function: loadMessagesFromObject
   *
   * Description:
   * Load messages from a well formed object. Works like {@link loadMessages}, but takes the object instead of a
   * file path containing the objects.
   *
   * Parameter:
   * @param {object}  messages  -    The object containing the translations
   *
   * @param {string}  $locale   -    The optional locale to save to. If not set the current locale is assumed.
   * @param {string}  $domain   -    The optional domain to save to. If not set the current domain is assumed.
   */
  loadMessagesFromObject: function (messages, $locale, $domain) {
    if ($locale != null) {
      this.__locale = $locale;
    }

    if ($domain != null) {
      this.__domain = $domain;
    }

    this.createDomain(this.__domain);
    this.fill(messages);
  },

  /**
   * Function: get
   *
   * Description:
   * Get a message by key.
   *
   * Parameter:
   * @param {string}  key  -     The message to look for. Can be separated with points.
   * @param {object}  $replace - optional Object. If set the function will replace all matched keys of $replace in string with the proper value.
   *
   * Return:
   * @returns {string}
   */
  get: function (key, $replace) {
    var string = "";

    if (Object.keys(this.__messages).length === 0 && JSON.stringify(this.__messages) === JSON.stringify({})) {
      throw new Error(this.$name + " not yet instantiated - call " + this.$name + ".loadMessages(...) before trying to read data!");
    }
    if (key.split('.').length > 1) {
      var array = this.__messages[this.__locale + ':' + this.__domain];

      $.each(key.split('.'), function (i, e) {
        if (array == null) {
          console.error("Could not find label with key: " + key);
          return false;
        }
        array = array[e];
      });

      string = array;
    }
    else {
      var data = this.__messages[this.__locale + ':' + this.__domain];
      if (data == null) {
        console.error("Could not find label with key: " + key);
        return "";
      }
      string = data[key];
    }

    if(string == null || typeof string != "string") {
      console.error("Could not find label with key: " + key);
      return "";
    }

    if(typeof $replace == "string") {
      $replace = JSON.parse($replace);
    }
    if (_.isArray($replace)) {
      $.each($replace, function (index, value) {
        var reg = new RegExp("%" + index + "%", "ig");
        string  = string.replace(reg, value);
      });
    }

    return string;
  },

  /**
   * Function: getAll
   *
   * Description:
   * Get all messages of current domain.
   *
   * Parameter:
   * @param {boolean} $allDomains - (optional) If set to true, all messages of current locale of all domains will be returned.
   *
   * Return:
   * @returns {object} - returns the whole messages object for given domain and current iso
   */
  getAll: function ($allDomains) {
    if ($allDomains) {
      var msgs = {};
      for (var key in this.__messages) {
        if (this.__messages.hasOwnProperty(key)) {
          if (key.startsWith(this.__locale)) {
            msgs = $.extend(msgs, this.__messages[key]);
          }
        }
      }
      return msgs;
    }

    return this.__messages[this.__locale + ':' + this.__domain];
  },

  /**
   * Function: has
   *
   * Description:
   * Check if a key exists in the current domain. This works only for the first level.
   *
   * Parameter:
   * @param {string}      key   -  The key to look for
   *
   * Return:
   * @returns {boolean}
   */
  has: function (key) {
    return this.__messages[this.__locale + ':' + this.__domain].hasOwnProperty(key);
  },

  /**
   * Function set
   *
   * Description:
   * Set a key with value. Also works if key did not exist before.
   *
   * Parameter:
   * @param {string}  key   -  The key to add.
   *
   * @param {string}  value -  The keys value.
   */
  set: function (key, value) {
    this.__messages[this.__locale + ':' + this.__domain][key] = value;
  },

  /**
   * Function add
   * calls <Coco.Translator.set>
   *
   * Parameter:
   * @param {string}  key   -  The key to add.
   *
   * @param {string}  value  - The keys value.
   */
  add: function (key, value) {
    this.set(key, value);
  },

  /**
   * Function: fill
   *
   * Description:
   * Fills a domain with messages.
   *
   * Parameter:
   * @param {object}  messages - The messages object.
   *
   * @param {boolean} $soft  - (optional)  If set to true already existing messages will not be overridden
   */
  fill: function (messages, $soft) {
    if ($soft) {
      this.__messages[this.__locale + ':' + this.__domain] = $.extend(messages, this.__messages[this.__domain]);
    }

    this.__messages[this.__locale + ':' + this.__domain] = messages;
  },

  /**
   * Function: hasDomain
   *
   * Description:
   * Check if the a given domain is set
   *
   * Parameter:
   * @param {string}      domain -   The domain to check for.
   *
   * Return:
   * @returns {boolean}
   */
  hasDomain: function (domain) {
    return this.__messages.hasOwnProperty(this.__locale + ':' + domain);
  },

  /**
   * Function: createDomain
   *
   * Description:
   * Create a domain.
   *
   * Parameter:
   * @param {string}  domain  -  The domain to create.
   *
   * @param {boolean} $force  - (optional)  If set to `true` the domain will overwrite a possible already existing domain with same name.
   */
  createDomain: function (domain, $force) {
    if ($force) {
      this.__messages[this.__locale + ':' + domain] = {};
    }
    else if (!this.hasDomain(domain)) {
      this.__messages[this.__locale + ':' + domain] = {};
    }
  },

  /**
   * Function: deleteDomain
   *
   * Description:
   * Delete a domain.
   * Parameter:
   * @param {string}  domain - The domain to delete.
   */
  deleteDomain: function (domain) {
    if (this.hasDomain(domain)) {
      delete this.__messages[this.__locale + ':' + domain];
    }
  },

  /**
   * Function: setLocale
   *
   * Description:
   * Set the locale.
   *
   * Parameter:
   * @param {string}  locale  -  The locale to set to.
   */
  setLocale: function (locale) {
    this.__locale = locale;
  },

  /**
   * Function: getLocale
   *
   * Description:
   * Get the locale.
   *
   * Return:
   * @returns {string} - current locale
   */
  getLocale: function () {
    return this.__locale;
  },

  /**
   * Function: setDomain
   *
   * Description:
   * Set the domain name to write to.
   *
   * Parameter:
   * @param {string}  domain  -  The domain to switch to.
   */
  setDomain: function (domain) {
    this.__domain = domain;
  },

  /**
   * Function: switchDomain
   *
   * Description:
   * Same as setDomain.
   *
   * Parameter:
   * @param {string}  domain    The domain to switch to.
   */
  switchDomain: function (domain) {
    this.setDomain(domain);
  },

  /**
   * Function: getDomain
   *
   * Description:
   * Get the currently active domain.
   *
   * Return:
   * @returns {string} - current domain
   */
  getDomain: function () {
    return this.__domain;
  },

  /**
   * Function: hasLocaleAndDomain
   *
   * Description:
   * Check if there are messages for locale and domain.
   *
   * Parameter:
   * @param {string}  locale   -     The locale to look for.
   *
   * @param {string}  domain   -     The domain to look for.
   *
   * Return:
   * @returns {boolean}
   */
  hasLocaleAndDomain: function (locale, domain) {
    return this.__messages.hasOwnProperty(locale + ':' + domain);
  }
});
