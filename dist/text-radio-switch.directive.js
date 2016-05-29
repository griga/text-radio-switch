;(function() {
'use strict';

/**
 * Created by griga on 5/29/16.
 */

angular.module('textRadioSwitch', []).directive('textRadioSwitch', function () {
    var widgetsCounter = 0;
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        template: '\n<div class="text-radio-switch" id="{{trsWidgetName}}">\n  <div class="text-radio-switch__left">&lt;</div>\n  <div class="text-radio-switch__viewport">\n    <label  ng-repeat="item in trsItems" class="text-radio-switch__label" ng-class="{\'text-radio-switch__label_active\': item[trsKeyField]==trsItemSelected}"><input ng-click="trsSelect(item)" type="radio" value="item[trsKeyField]" ng-checked="{{item[trsKeyField]==trsItemSelected}}" name="{{trsWidgetName}}" />{{item[trsNameField]}}</label>\n  </div>\n  <div class="text-radio-switch__right">&gt;</div>\n  <div class="text-radio-switch__highlight"></div>\n</div>\n',
        scope: {
            trsItems: '=items',
            trsKeyField: '@keyField',
            trsNameField: '@nameField'
        },
        link: function link(scope, element, attributes, ngModelCtrl) {
            widgetsCounter++;
            scope.trsWidgetName = 'text-radio-switch-widget-' + widgetsCounter;
            scope.trsItemSelected = ngModelCtrl.$modelValue;

            ngModelCtrl.$render = function () {
                scope.trsItemSelected = ngModelCtrl.$viewValue;
            };

            scope.trsSelect = function (item) {
                console.log(item);
                ngModelCtrl.$setViewValue(item[scope.trsKeyField]);
                scope.trsItemSelected = ngModelCtrl.$viewValue;
            };
        }
    };
});
}());
