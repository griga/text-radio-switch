;(function() {
'use strict';

/**
 * Created by griga on 5/29/16.
 */

angular.module('textRadioSwitch', []).directive('trsOnFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function link(scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('trsRepeatFinish');
                });
            }
        }
    };
}).directive('textRadioSwitch', function () {
    var widgetsCounter = 0;
    return {
        restrict: 'E',
        replace: true,
        require: 'ngModel',
        template: '\n<div class="text-radio-switch" id="{{::trsWidgetName}}">\n  <div class="text-radio-switch__viewport">\n    <label ng-repeat="item in ::trsItems" trs-on-finish-render="::ngRepeatFinished" class="text-radio-switch__label" \n    ng-class="{\'text-radio-switch__label_active\': item[trsKeyField]==trsItemSelected}" for="{{::(trsWidgetName + \'__\' + item[trsKeyField])}}"><input \n    ng-click="trsSelect(item)" type="radio" value="item[trsKeyField]" \n    id="{{::(trsWidgetName + \'__\' + item[trsKeyField])}}"\n    ng-checked="{{item[trsKeyField]==trsItemSelected}}" name="{{::trsWidgetName}}" />{{::item[trsNameField]}}</label>\n  </div>\n  <div class="text-radio-switch__left">&lt;</div>\n  <div class="text-radio-switch__right">&gt;</div>\n  <div class="text-radio-switch__highlight-bar"><span></span></div>\n</div>\n',
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
                doHighlight();
            };

            function doHighlight() {
                var label = document.querySelector('label[for="' + scope.trsWidgetName + '__' + scope.trsItemSelected + '"]');
                var span = document.querySelector('#' + scope.trsWidgetName + ' span');
                if (!label || !span) return;

                angular.element(span).css({
                    width: label.offsetWidth + 'px',
                    left: label.offsetLeft + 'px'
                });
            }

            function updateHighlightBarWidth() {
                var labels = document.querySelectorAll('#' + scope.trsWidgetName + ' label');
                var width = 0;
                Array.prototype.forEach.call(labels, function (l) {
                    width += l.offsetWidth;
                    var style = window.getComputedStyle(l);
                    width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
                    width += parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);
                });

                var bar = document.querySelector('#' + scope.trsWidgetName + ' .text-radio-switch__highlight-bar');
                angular.element(bar).css({
                    width: width + 'px'
                });
            }

            scope.$on('trsRepeatFinish', function () {
                setTimeout(function () {
                    doHighlight();
                    updateHighlightBarWidth();
                }, 50);
            });

            scope.trsSelect = function (item) {
                ngModelCtrl.$setViewValue(item[scope.trsKeyField]);
                scope.trsItemSelected = ngModelCtrl.$viewValue;
                doHighlight();
            };
        }
    };
});
}());
