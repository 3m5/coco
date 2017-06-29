# Coco changelog

## 0.2.1

- unpublished

## 0.2.0

- catches IE trusted zone error "SCRIPT5: Access denied" when trying to open window.localStorage

## 0.1.88

- fixed Coco.HandlebarsHelpers failed JSON.parse for string-number values, needs to be an array

## 0.1.87

- fixed Coco.View: call delegateEvents also delayed like '_onFirstRender' to prevent async problems

## 0.1.86

- fixed Coco.RouterService history calculation, now it also works for just one step

## 0.1.85

- deactivate HandleBars Helper: is, isNot, isGreater, isGreaterThan, isLess, isLessThan
- added Handelbars Helpers: add, sub, concat, for
- do not fire route, if it is the same as previous

## 0.1.84

- Coco.translator now does not eats all errors in loadMessages success callback, so you can use promises OR callback

## 0.1.83

- fixed console.warning bug on Coco.Translator

## 0.1.82

- added babel preset es2015 to compilation
- added babel preset stage-2 to compilation
- added babel preset stage-3 to compilation
- added babel plugin es6promise to compilation

## 0.1.81

- fixed webpack problems with 'let' on Coco.Init
- Coco.Translator now returns arrays and objects from i18n file
- updated babel-polyfill requirement
- updated jquery requirement
- removed core/traceuer-runtime.js

## 0.1.80

- replaced let by var for window.Event variable...

## 0.1.79

- catch InvalidReference Error on 1st Handlebars contact 
- replaced var by let for Coco and Event variables...

## 0.1.78

- fixed bug with new babel context & handlebars 4.0.5 use let instead of var...

## 0.1.77

- added error handler into Coco.Translator.loadMessages, so we see errors during loading json files
- updated some libraries
- added HandlebarsHelper routePAram(key, value) to generate route params dynamically

## 0.1.76

- added JSON 1.0.0 to dependencies
- do not throw error anymore, when Translator.getMessages is called without optional parameter $callback 
- Coco.Translator now supports loading & merging multiple message files on one locale & domain, new one overrides existing nodes

## 0.1.75

- Coco.View: prevent error, if no router is available...
- Coco.Translator getText - ignore illegal replace parameter from hbs template
- Coco.Translator now dispatches Translator.Event.CHANGE_LOCALE on each locale change
- changed dependency from babel/polyfill to babel-polyfill
- added jQuery 2.2.1 to dependencies
- added underscore 1.8.3 to dependencies

## 0.1.74

- Coco.Translator is now instantiated automatically
- HandlebarsHelper getText(key, replaceArray) is now registered by default, call it to get i18n text directly from Coco.Translator
- Coco.Plugins are no more available 
- uses now npm-module jquery instead of custom jQuery library

## 0.1.73

- Coco.BaseRestService: contentType is now false by default (not null)

## 0.1.72

- Coco.Collection.sortByProperty now sorts all string values alphabetically, a BEFORE B (all letters are compared lowercase)
- Coco.View.addChildView(selector, view, $strategy, $addToAllMatching): parameter $strategy can now be type of number --> insert ChildView at specific index

## 0.1.71

- Coco.config.restService.path and Coco.config.baseUrl can now be an empty string!
- Coco.BaseRESTService: use JSON.stringify/ parse to cache GET-responses and protect them from later manipulation in code
- Coco.BaseRESTService: make caching also work with promises
- Coco.ChildView: delegate events even though, parent view events already delegated... (reRender after new childviews were added)
- replaced static json2 file by npm-module
- fixed bug in Coco.Model during removing ChildViewsByModelId

## 0.1.70

- Coco.Collection: findBy, findOneBy, removeBy are no more type safe anymore
- added older browser support for Symbol-Event-handles
- Coco.Collection: sortByProperty() - Bugfix added missing import

## 0.1.69

- added function removeBy to Coco.Collection
- added $compute functionality to all functions to implement computed properties for models, you can check a computed function by boolean '.isComputed' property

## 0.1.68

- fixed bug in Coco.Collection
- added babel/polyfill requirement for IE support
- enable application-loading again
- fixed bug in Coco.EventDispatcher to removeEvents by given Symbol-handle
- Rewrite modern console methods for old browsers (like IE 9/10)
- enable working with promises - Coco.BaseRestService now returns Promise object
- pass contentType as parameter for POST and PUT
- reactivate removal of application-loading class from main container

## 0.1.67

- added Coco.config.locale (default is 'de') for handlebars localization
- handlebars templates now get localization from Coco.config for other modules e.g. formatJS
- moved handlebars & underscore from dependencies to devDependencies to prevent double includes

## 0.1.66

- HOTFIX HandleBars-Helper, dont use ES6 syntax!

## 0.1.65

- Hotfix

## 0.1.64

- fixed bug to prevent executing model properties with type function during rendering
- added Coco.Utils.sizeOfObject function to count object properties
- added Coco.Collection.where function, based on underscore.where to get filtered array of models

## 0.1.63

- added Handlebars.Helper 'ifCond' - deprecates: 'is', 'isNot', 'isGreater', 'isGreaterThan', 'isLess', 'isLessThan'
- hotfix

## 0.1.6

- fixed require bugs for all Coco.Events

## 0.1.5

- added some error message for missing injected service
- moved CHANGE_ROUTE Event-Type from Coco.Event to Coco.RouterEvent
- moved FIRE_ROUTE Event-Type from Coco.Event to Coco.RouterEvent
- moved SHOW_VIEW Event-Type from Coco.Event to Coco.RouterEvent
- moved HIDE_VIEW Event-Type from Coco.Event to Coco.RouterEvent
- added oldRoute object to Coco.RouterEvent
- removed Coco.HashMap from library, use ES6 classes instead

## 0.1.4

- correct Reference to Coco.URLHelper class
- replaced Coco.HashMap by ECMA6 Map in RestBaseService
- removed Coco.EventDispatcher inheritance on Coco.Event

## 0.1.3

- Bugfix: fixed illegal usage of Coco.Classes in BaseRestService
- Added: Coco.URLHelper class

## 0.1.2

- Bugfix: fixed 'this'-bug in Coco.RouterService
- Bugfix: fixed logical bug in Coco.Model/ Coco.Collection (removed illegal call of no more existing functions)
- Update: Coco.Collection destroys now all model EventHandler after removing model
- Update: Coco.Model, Collection, View & ChildView now remove all their EventListener when .destroy() is called

## 0.1.1

- Bugfix: fixed logical bug in Coco.View (removed illegal call of no more existing functions)

## 0.1.0

- Change: use Coco.EventDispatcher instead of Coco.Event for Event-Handling
- Deprecated: Coco.Event.listenTo
- Deprecated: Coco.Event.trigger

## 0.0.981

- Change: trigger RENDER-Events & _onFirstRender in Coco.View delayed to get the DOM really rendered
- Change: replaced __tpl by _template in Coco.View

## 0.0.980

- Bugfix: fixed illegal call of service injection in Coco.ChildView
- Change: Coco.View now checks only for instanceof Coco.View before adding ChildView...Coco.ChildView is not available in Coco.View (circle dependency)

## 0.0.979

- Bugfix: added missing Coco.Event dependency in Coco.Model

## 0.0.978

- add Plugin i18n: Coco.Translator

## 0.0.977

- 1st stable/tested version with simple MVC function

