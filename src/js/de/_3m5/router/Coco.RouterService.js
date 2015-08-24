var Coco = Coco || {};
Coco.Service = Coco.Service || require("../service/Coco.Service.js");
Coco.Event = Coco.Event || require("../event/Coco.Event.js");
Coco.Model = Coco.Model || require("../model/Coco.Model.js");
var Handlebars = require("handlebars");
/**
 * Class: Coco.RouterService
 *
 * extends: <Coco.Service>
 *
 * Description:
 * This class holds routing and history information to navigate through the app.
 * This class must be injected as a service into some major app controlling class.
 *
 * @author Johannes Klauss <johannes.klauss@3m5.de>
 */
'use strict';
Coco.RouterService = dejavu.Class.declare({
    $name: 'RouterService',

    $extends: Coco.Service,

    $serviceId: 'router',

    /**
     * Holds the routing object, that defines routes and their corresponding views that should be shown.
     */
    __routes: {},

    /**
     * Holds the current route plus it's current mapped arguments.
     */
    __currentRoute: null,

    /**
     * If the hashchange event has been triggered, a next route will be determined that is stored here and copied to
     * __currentRoute after the views have been switched.
     */
    __nextRoute: null,

    /**
     * The path history to refer to for back and forth manipulation.
     */
    __pathHistory: [],

    /**
     * The current path history index.
     */
    __pathHistoryIndex: -1,

    initialize: function () {
        this.$super();
        $(window).on('hashchange', this.__onRouteChanged.$bind(this));

        /**
         * The syntax in the helper is e.g. "id:id, linkOne:someKeyInTheModel"
         * We split the string to a array of these key1:key2 pairs.
         *
         * In the for loop we then split the key1:key2 and add key1 as key to the parsedParams object and the value of
         * key2 as the key1 value.
         */
        Handlebars.registerHelper('route', function(v1, v2) {
            var params = [];
            if (typeof v2 == 'string') {
                params = v2.replace(/\s+/g, '').split(',');
            }

            var parsedParams = {};
            var key;

            for(var i = 0; i < params.length; i++) {
                if(params[i].indexOf(':') === -1) {
                    if(this.hasOwnProperty(params[i])) {
                        parsedParams[params[i]] = this[params[i]];
                    }
                    else {
                        throw new Error('Error while generating route "' + v1 + '". Model has no key "' + params[i] + '".');
                    }
                }
                else {
                    key = params[i].substring(params[i].indexOf(':') + 1);

                    if(this.hasOwnProperty(key)) {
                        parsedParams[params[i].substr(0, params[i].indexOf(':'))] = this[key];
                    }
                    else {
                        parsedParams[params[i].substr(0, params[i].indexOf(':'))] = key;
                    }
                }
            }

            return this.generateUrl(v1, parsedParams);
        });
    },

    setContainer: function ($container) {
        this.$container = $container;
    },

    /**
     * Function: start($path)
     * Start the Routing.
     *
     * Parameter:
     * @param {string} $path    -   {optional} If a path is given, the routing starts with this path.
     */
    start: function ($path) {
        if($path == null) {
            $path = '/';
        }
        //only accept valid deeplinks!
        if(window.location.hash.length > 0 && this.__matchRoute(window.location.hash)) {
            $(window).trigger('hashchange');
        }
        else {
            window.location.hash = $path;
        }
    },

    /**
     * Function: addRoute(name, params)
     * Add a route.
     *
     * @param name   {string}   -   The name of the route.
     * @param params {object}   -   The params of the route (view object or constructor and path)
     */
    addRoute: function (name, params) {
        if(this.__routes.hasOwnProperty(name)) {
            throw new Error('Route "' + name + '" is already defined.');
        }

        this.__routes[name] = params;
    },

    /**
     * Function: generateUrl(route, $params)
     * Generate a url by a route name and optional arguments to fill the placeholders.
     *
     * Parameter:
     * @param {string} route    -   The route name
     * @param {object} $params  -   {optional}  A object of parameters for the given route
     */
    generateUrl: function (route, $params) {
        if(!this.__routes.hasOwnProperty(route)) {
            throw new Error('Route "' + route + '" does not exist.');
        }

        if($params) {
            var parts = this.__routes[route].path.slice(1).replace(/[()]/g, '').split('/');

            for(var i = 0; i < parts.length; i++) {
                if(parts[i].indexOf(':') === 0) {
                    if ( $params.hasOwnProperty(parts[i].substr(1))) {
                        parts[i] = $params[parts[i].substr(1)];
                    } else {
                        parts.splice(i, 1);
                        i--;
                    }
                }
            }

            parts.unshift('');
            return '#' + parts.join('/');
        }

        return this.__routes[route].path.replace(/\(.*\)/g, '');
    },

    /**
     * Function: getCurrentRoute()
     * Returns the current route object.
     *
     * Return:
     * @return {object} -   The current route object.
     */
    getCurrentRoute: function () {
        return this.__currentRoute;
    },

    /**
     * Function: setPath(path)
     * Set the new path programmatically.
     *
     * Parameter:
     * @param path {string} - The path the application should be set to.
     */
    setPath: function (path) {
        window.location.hash = path;
    },

    /**
     * Function: callPath(path)
     * Set the new path programmatically.
     *
     * Parameter:
     * @param route     {string}    - The route the application should be set to.
     * @param $params   {object}   - An object containing the parameters.
     */
    callRoute: function (route, $params) {
        window.location.hash = this.generateUrl(route, $params);
    },

    /**
     * Function: hasRoute(route)
     * Returns true if the route exists.
     *
     * @param route     {string}    -   The route name
     * @returns {boolean}
     */
    hasRoute: function (route) {
        return this.__routes.hasOwnProperty(route);
    },

    /**
     * Function history
     * returns array with historical path objects, without current path
     *
     * @params {Integer} steps - steps needed for history, -1 for whole history
     * @returns {Array}
     */
    history: function (steps, duplicates) {
        var history = [];
        if(steps == -1) {
            steps = this.__pathHistory.length - 1;
        }
        steps = Math.min(this.__pathHistory.length - 1, steps);
        var routes = [];
        var counter = 1;
        for(var i = this.__pathHistory.length - 2; i >= (this.__pathHistory.length - 1) - steps; i--) {
            var pHistory = this.__pathHistory[i];
            if(!duplicates) {
                if(routes.indexOf(pHistory) > -1) {
                    //no duplicates allowed
                    continue;
                }
            }
            routes.push(pHistory);
            //send steps back to reach this route
            var route = $.extend(true, {back: counter}, this.__getRoute(pHistory));
            counter++;
            history.unshift(route);
        };

        return history;
    },

    clearHistory: function() {
        this.__pathHistory = [];
        this.__pathHistoryIndex = -1;
    },

    /**
     * Function: goback()
     * Go back given steps in history, delete
     */
    goback: function (steps) {
        if(steps > 0 && steps < this.__pathHistory.length) {
            //drop current route
            var newPath = this.__pathHistory.pop();
            //drop previous routes
            while(steps > 0) {
                newPath = this.__pathHistory.pop();
                steps--;
            }
            this.__pathHistoryIndex = this.__pathHistory.length - 1;
            this.setPath(newPath);
        }
    },

    /**
     * Function: back()
     * Go back one step in history.
     */
    back: function () {
        if(this.__pathHistoryIndex > 0 && this.__pathHistoryIndex <= this.__pathHistory.length) {
            this.setPath(this.__pathHistory[--this.__pathHistoryIndex]);
        }
    },

    /**
     * Function: forward()
     * Go one step forward in history.
     */
    forward: function () {
        if(this.__pathHistoryIndex - 1 < this.__pathHistory.length) {
            this.setPath(this.__pathHistory[++this.__pathHistoryIndex]);
        }
    },

    /**
     * Function: go(steps)
     * Go a specified number of steps back or forth in history.
     *
     * Parameter:
     * @param {Number} steps    -   A signed integer indicating how many steps to go. Values below zero go back, values above go forth in History.
     */
    go: function (steps) {
        if(steps === 0) {
            return;
        }

        var i = this.__pathHistoryIndex += steps;

        if(i > 0 && i < this.__pathHistory.length) {
            window.location.hash = this.__pathHistory[i];
        }
    },

    /**
     * Adds the current hash value of the location to the pathHistory array.
     *
     * @param {string} path -   The path to add to the history.
     * @private
     */
    __pushPathToHistory: function (path) {
        this.__pathHistory.splice(++this.__pathHistoryIndex, (this.__pathHistory.length - this.__pathHistoryIndex), path);
    },

    /**
     * Callback for hashchange event. Tries to match a route.
     * If a route has been found this.__fireRoute will be called.
     *
     * @private
     */
    __onRouteChanged: function () {
        if (this.__matchRoute(window.location.hash)) {
            this.__fireRoute();
        }
    },

    /**
     * Tries to match a route by taken the given path and returns route object.
     *
     * @param {string}  path        - The path from the current url
     * @param {boolean} duplicates  - Allow duplicates?
     * @return {boolean}
     *
     * @private
     */
    __getRoute: function (path, duplicates) {
        path = path.slice(2);
        var pathParts = path.split('/'),
            matched;

        var addedRoutes = [];
        for(var i in this.__routes) {
            if(this.__routes.hasOwnProperty(i)) {
                var routeRegex = this.__convertToRegex(this.__routes[i].path.slice(1));
                matched = true;

                if (path.match(routeRegex) === null) {
                    matched = false;
                }

                if(matched) {
                    if(!duplicates) {
                        if(addedRoutes.indexOf[i] > -1) {
                            //no duplicates allowed
                            continue;
                        }
                    }
                    addedRoutes.push(i);

                    var routeParts = this.__routes[i].path.slice(1).replace(/[()]/g, '').split('/');

                    this.__mapArguments(pathParts, routeParts, this.__routes[i]);
                    //copy route object, add route label
                    var r = $.extend(true, {key: i}, this.__routes[i]);
                    //replace path variables
                    for(var parts = 0; parts < routeParts.length; parts++) {
                        r.path = r.path.replace(routeParts[parts], pathParts[parts]);
                    }

                    //delete view from route
                    delete r.view;
                    return r;
                }
            }
        }

        return null;
    },

    /**
     * Tries to match a route by taken the given path and returns boolean flag.
     *
     * @param  {string} path - The path from the current url
     * @return {boolean}
     * @private
     */
    __matchRoute: function (path) {
        path = path.slice(2);
        var pathParts = path.split('/'),
            matched;

        for(var i in this.__routes) {
            if(this.__routes.hasOwnProperty(i)) {
                var routeRegex = this.__convertToRegex(this.__routes[i].path.slice(1));
                matched = true;

                if (path.match(routeRegex) === null) {
                    matched = false;
                }

                if (matched) {
                    var routeParts = this.__routes[i].path.slice(1).replace(/[()]/g, '').split('/');
                    this.__nextRoute = this.__mapArguments(pathParts, routeParts, this.__routes[i]);

                    return true;
                }
            }
        }

        return false;
    },

    __convertToRegex: function (route) {
        var optionalParam = /\((.*?)\)/g;
        var namedParam    = /(\(\?)?:\w+/g;

        route = route.replace(optionalParam, '(?:$1)?')
            .replace(namedParam, function(match, optional) {
                return optional ? match : '([^/?]+)';
            });

        return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    /**
     * Maps the arguments from the hash path to the currently matched route.
     *
     * @param {Array} pathParts
     * @param {Array} routeParts
     * @param {object} nextRoute
     * @return {object}
     * @private
     */
    __mapArguments: function (pathParts, routeParts, nextRoute) {
        var mode = 0;

        if(nextRoute.paramsAsObject != null && nextRoute.paramsAsObject) {
            mode = 1;
        }

        nextRoute.args = [];

        if(mode === 1) {
            nextRoute.args.push({});
        }

        for(var i = 0; i < routeParts.length; i++) {
            if(routeParts[i].indexOf(':') === 0) {
                if(!isNaN(pathParts[i])) {
                    pathParts[i] = Number(pathParts[i]);
                }

                if(mode === 0) {
                    nextRoute.args.push(pathParts[i]);
                }
                else {
                    nextRoute.args[0][routeParts[i].substring(1)] = pathParts[i];
                }
            }
        }

        return nextRoute;
    },

    /**
     * Fires a route and executes the attached callback methods of the view that will be showed and the view that will
     * be hidden.
     *
     * @private
     */
    __fireRoute: function () {
        if(this.__currentRoute != null) {
            // The onPause method of a view can return a value that is pushed to the params to the next active view.
            this.__callRouteView(this.__currentRoute);
            this.__callRouteMethod(this.__currentRoute, 'onPause');
        }

        this.__callRouteView(this.__nextRoute);

        if(this.__nextRoute == null || this.__nextRoute.view == null) {
            console.error("invalid route called! ", this.__nextRoute);
            return;
        }

        if(this.__currentRoute != null) {
            this.trigger(Coco.Event.HIDE_VIEW);
            this.trigger(Coco.Event.HIDE_VIEW + this.__currentRoute.view.$name);

            this.__currentRoute.view.deactivate();
        }

        this.__nextRoute.view.activate();

        //call this AFTER deactivating current view, because current view can be also NEXT view - and so, all events are killed
        this.__callRouteMethod(this.__nextRoute, 'onActive');

        if (this.__currentRoute && (this.__currentRoute.view.$name == this.__nextRoute.view.$name)) {
            // If we navigate to the same view, don't add new route to history array
            // Just replace the last one with new value
            this.__pathHistory[this.__pathHistory.length - 1] = window.location.hash;
        } else {
            // Otherwise add new route path to history array
            this.__pushPathToHistory(window.location.hash);
        }

        this.trigger(Coco.Event.CHANGE_ROUTE, this.__nextRoute, this.__currentRoute);

        this.__currentRoute = $.extend({}, this.__nextRoute);

        this.__callRouteMethod(this.__nextRoute, 'onRenderedActive');

        this.__nextRoute = null;
    },

    /**
     * Calls the onActive or onPause callback of the view.
     *
     * @param {object} route    - The route object where the view lies in
     */
    __callRouteView: function (route) {
        if(typeof route.view === 'function') {
            console.debug("callRouteView: ", route);
            if (route.model && route.model instanceof Coco.Model) {
                route.view = new route.view(route.model);
            } else {
                route.view = new route.view();
            }
        }
    },

    __callRouteMethod: function (route, method) {
        if (method === 'onPause') {
            //deactivated views do not need any eventhandler!
            route.view.undelegateEvents();
            return route.view[method]();
        } else if (method === 'onActive') {
            //route.view.delegateEvents();
            return route.view[method].apply(route.view, this.__nextRoute.args);
        }
        else if(typeof route.view[method] === 'function') {
            route.view[method].apply(route.view, this.__nextRoute.args);
        }
    }

}); //.$service();
//instantiate Service automatically
module.exports = new Coco.RouterService();