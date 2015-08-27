# Coco changelog

## 0.0.981 (unpublished)

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

