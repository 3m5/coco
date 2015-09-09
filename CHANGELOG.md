# Coco changelog

## 0.1.4

- correct Reference to Coco.URLHelper class
- replaced Coco.HAshMap by ECMA6 Map in RestBaseService

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

