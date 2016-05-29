/**
 * Created by griga on 5/29/16.
 */


angular.module('textRadioSwitch', [])
    .directive('textRadioSwitch', function(){
        let widgetsCounter = 0
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            template:
                `
<div class="text-radio-switch" id="{{trsWidgetName}}">
  <div class="text-radio-switch__left">&lt;</div>
  <div class="text-radio-switch__viewport">
    <label  ng-repeat="item in trsItems" class="text-radio-switch__label" ng-class="{'text-radio-switch__label_active': item[trsKeyField]==trsItemSelected}"><input ng-click="trsSelect(item)" type="radio" value="item[trsKeyField]" ng-checked="{{item[trsKeyField]==trsItemSelected}}" name="{{trsWidgetName}}" />{{item[trsNameField]}}</label>
  </div>
  <div class="text-radio-switch__right">&gt;</div>
  <div class="text-radio-switch__highlight"></div>
</div>
`,
            scope: {
                trsItems: '=items',
                trsKeyField: '@keyField',
                trsNameField: '@nameField'
            },
            link: function(scope, element, attributes, ngModelCtrl){
                widgetsCounter++
                scope.trsWidgetName = 'text-radio-switch-widget-'+widgetsCounter
                scope.trsItemSelected = ngModelCtrl.$modelValue;

                ngModelCtrl.$render = function() {
                    scope.trsItemSelected = ngModelCtrl.$viewValue;
                };

                scope.trsSelect = function(item){
                    console.log(item)
                    ngModelCtrl.$setViewValue(item[scope.trsKeyField])
                    scope.trsItemSelected = ngModelCtrl.$viewValue;
                }

            }
        }
    })