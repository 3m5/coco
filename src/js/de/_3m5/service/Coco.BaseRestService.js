var RestServiceEvent = require("../event/Coco.RestServiceEvent.js");
var Event = require("../event/Coco.Event.js");
/**
 * Class: Coco.BaseRestService
 *
 * extends: <Coco.Service>
 *
 * Description: Base service for calling REST endpoints.
 *
 * Override this class by concrete implementation, dont forget .$service() for automatic service-injection!
 *
 * (c) 2015 3m5. Media GmbH
 */
module.exports = dejavu.AbstractClass.declare({
	/**
	 * Class name.
	 */
	$name: "Coco.BaseRestService",

	/**
	 * Super class: Coco.Service
	 */
	$extends: require("./Coco.Service.js"),

	/**
	 * cache for GET requests
	 */
	_getCache: null,

	/**
	 * cache for POST requests
	 */
	_postCache: null,

	/**
	 * The REST service path.
	 */
	_restServicePath: null,

	$constants: {
		XHR_FIELDS: {
			withCredentials: true
		},
		CROSSDOMAIN: true
	},

	/**
	 * Ctor.
	 */
	initialize: function () {
		//call constructor for service registration
		this.$super();
		this._onInitialize();
	},

	/**
	 * Function: _onInitialize
	 *
	 * is called after class was initialized
	 * @protected
	 */
	_onInitialize: function () {
	},

	_validateParameterIsBoolean: function (param, onError) {
		if (param != null && typeof param != "boolean") {
			onError({status: 99, responseText: "Parameter is not type of Boolean"});
			return false;
		}
		return true;
	},

	_validateParameterIsInteger: function (param, onError) {
		if (param != null && parseInt(param) !== param) {
			onError({status: 99, responseText: "Parameter is not type of Integer"});
			return false;
		}
		return true;
	},

	_validateParameterIsFloat: function (param, onError) {
		if (param != null && typeof param !== "number") {
			onError({status: 99, responseText: "Parameter is not type of Number"});
			return false;
		}
		return true;
	},
	_validateParameterIsArray: function (param, onError) {
		if (param != null && !Array.isArray(param)) {
			onError({status: 99, responseText: "Parameter is not type of Array"});
			return false;
		}
		return true;
	},

	_validateParameterClass: function (param, paramType, onError) {
		if (param != null && !(param instanceof paramType)) {
			onError({status: 99, responseText: "Parameter is not type of " + (typeof paramType)});
			return false;
		}
		return true;
	},

	/**
	 * Function: _buildEndpointURL
	 *
	 * Builds the full endpoint URL absolute to the host. The URL looks like:
	 * [CONTEXT-PATH]/[REST-PATH]/[ENDPOINT]
	 *
	 * Parameter:
	 *
	 * @param {string} endpoint the REST endpoint
	 */
	_buildEndpointURL: function (endpoint, pathParameter) {
		var Coco = require("../Coco.Init.js");
		if (this._restServicePath == null) {
			throw new Error(this.$serviceId + "._restServicePath not set!");
		}
		if (Coco.config.baseUrl == null) {
			throw new Error("Coco.config.baseUrl  not set! ", Coco.config);
		}
		if (!Coco.config.restService || Coco.config.restService.path == null) {
			throw new Error("Coco.config.restService.path not set! ", Coco.config);
		}
		if (endpoint == null) {
			endpoint = "";
		}
		var finalUrl = Coco.config.baseUrl + Coco.config.restService.path + this._restServicePath + endpoint;
		if (pathParameter && pathParameter.length > 0) {
			finalUrl = this._replacePathParameters(finalUrl, pathParameter);
		}
		return finalUrl;
	},

	_replacePathParameters: function (path, pathParameter) {
		do {
			var paramStart = path.indexOf("{");
			if (paramStart < 0) {
				break;
			}
			var paramEnd = paramStart;
			var depth = 1;
			do {
				paramEnd++;
				var c = path.substring(paramEnd, paramEnd + 1);
				if (c === "{") {
					depth++;
				} else if (c === "}") {
					depth--;
				}
			} while (depth > 0 && paramEnd + 1 < path.length);
			paramEnd++;
			if (paramEnd > path.length) {
				break;
			}
			var pathDefinition = path.substring(paramStart, paramEnd);
			var paramName = pathDefinition.substring(1, pathDefinition.length - 1);
			if (paramName.indexOf(":") > 0) {
				paramName = paramName.substring(0, paramName.indexOf(":"));
			}
			var value = null;
			for (var i = 0; i < pathParameter.length; i++) {
				if (pathParameter[i].name === paramName) {
					value = pathParameter[i].replacement;
					break;
				}
			}
			if (value == null) {
				console.error("missing path parameter: " + paramName + " not set... ", pathParameter);
			}
			//replace position
			path = path.substring(0, paramStart) + value + path.substring(paramEnd);
		} while (true);

		return path;
	},

	/**
	 * Function: __call {private}
	 *
	 * Calls the given endpoint via jQuery ajax function using the given method, data and callbacks.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {string} method the request method ('GET', 'POST', 'PUT' or 'DELETE')
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 */
	__call: function (endpoint, pathParameter, method, data, xhrFields, callbackSuccess, callbackError, $contentType) {
		var url = this._buildEndpointURL(endpoint, pathParameter);
		var Coco = require("../Coco.Init.js");

		var cacheKey = url;
		if ($contentType) {
			cacheKey = cacheKey + $contentType;
		}

		if (method == "GET") {
			if (this._getCache == null) {
				this._getCache = new Map();
			}

			var cacheData = this._getCache.get(cacheKey);
			if (cacheData != null) {
				//cached entry found
				if (cacheData.cocoTimeout == null || cacheData.cocoTimeout > new Date().getTime()) {
					//parse stringed cached response
					var cacheDataResponse = JSON.parse(cacheData.response);
					if (callbackSuccess) {
						callbackSuccess(cacheDataResponse);
					}
					return Promise.resolve(cacheDataResponse);
				}
				//cache timed out, delete it
				this._getCache.delete(cacheKey);
			}
		}

		//delete empty keys from data object
		Object.keys(data).forEach((k) => {
			if (typeof data[k] != 'boolean' && typeof data[k] != 'number' && !data[k]) {
				delete data[k];
			}
		});

		//console.debug("Calling REST service (method: '" + method + "', URL: " + url + ") with data: ", data);
		return $.ajax({
			url: url,
			type: method,
			xhrFields: xhrFields,
			contentType: $contentType || false,
			crossDomain: this.$self.CROSSDOMAIN, //enable crossdomain calls - implement serverside!
			data: data,
			dataType: 'json', //dont use jsonp for RESTservices, only GET requests allowed with jsonp
			processData: (window.FormData && data instanceof FormData ? false : true),
			success: (response) => {
				if (method == "GET") {
					if (Coco.config.restService.cacheGet < 0) {
						//unlimited caching
						this._getCache.set(cacheKey, {response: JSON.stringify(response)});
					} else {
						if (Coco.config.restService.cacheGet > 0) {
							var timeout = new Date(new Date().getTime() + (1000 * Coco.config.restService.cacheGet));

							// todo when array - don't make object from array
							this._getCache.set(cacheKey, {cocoTimeout: timeout, response: JSON.stringify(response)});
						} else {
							//cache disabled
						}
					}
				}

				callbackSuccess(response);
			},
			error: (error) => {
				if (error != null && error.status == 401) {
					//Authorization failed - throw Event
					//this.trigger(Coco.Event.AUTHORIZATION_FAILED);
					this._dispatchEvent(new RestServiceEvent(Event.AUTHORIZATION_FAILED, error.status, error));
				} else if (error != null && error.status == 500) {
					//Authorization failed - throw Event
					//this.trigger(Coco.Event.INTERNAL_SERVER_ERROR, error);
					this._dispatchEvent(new RestServiceEvent(Event.INTERNAL_SERVER_ERROR, error.status, error));
				} else {
					this._dispatchEvent(new RestServiceEvent(Event.REST_SERVER_ERROR, error.status, error));
				}

				if (callbackError != null) {
					callbackError(error);
				}
			}
		});
	},

	/**
	 * Function: _get
	 *
	 * Delegates to _call using 'GET' method.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {array} pathParameter Array
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 */
	_get: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'GET', data, xhrFields, callbackSuccess, callbackError, false);
	},

	/**
	 * Function: _post
	 *
	 * Delegates to _call using 'POST' method.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 *
	 * @param {string} contentType
	 */
	_post: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError, contentType) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'POST', data, xhrFields, callbackSuccess, callbackError, contentType);
	},

	/**
	 * Function: _postJson
	 *
	 * Delegates to _call using 'POST' method, contentType 'application/json' and
	 * stringifys the data object.
	 * Use this method if you consume a (complexly JSON) mapped  object on server-side.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 */
	_postJson: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'POST', JSON.stringify(data), xhrFields, callbackSuccess, callbackError, 'application/json');
	},

	/**
	 * Function: _put
	 *
	 * Delegates to _call using 'PUT' method.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 *
	 * @param {string} contentType
	 */
	_put: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError, contentType) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'PUT', data, xhrFields, callbackSuccess, callbackError, contentType);
	},

	/**
	 * Function: _putJson
	 *
	 * Delegates to _call using 'PUT' method.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 */
	_putJson: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'PUT', JSON.stringify(data), xhrFields, callbackSuccess, callbackError, 'application/json');
	},

	/**
	 * Function: _delete
	 *
	 * Delegates to _call using 'DELETE' method.
	 *
	 * Parameter:
	 * @param {string} endpoint the REST endpoint
	 *
	 * @param {object} data the request data
	 *
	 * @param {object} xhrFields
	 *
	 * @param {function} callbackSuccess the success handler
	 *
	 * @param {function} callbackError the error handler
	 */
	_delete: function (endpoint, pathParameter, data, xhrFields, callbackSuccess, callbackError, contentType) {
		if (!Array.isArray(pathParameter)) {
			throw new Error("2nd parameter has to be pathParameter array, but was: " + typeof pathParameter);
		}
		return this.__call(endpoint, pathParameter, 'DELETE', data, xhrFields, callbackSuccess, callbackError, contentType);
	}

});
