/**
 * Created by griga on 5/29/16.
 */


angular.module('textRadioSwitch', [])
    .directive('onFinishRender', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit('trsRepeatFinish');
                    });
                }
            }
        }
    })
    .directive('textRadioSwitch', function ($window) {
        let widgetsCounter = 0
        return {
            restrict: 'E',
            replace: true,
            require: 'ngModel',
            template: `
<div class="text-radio-switch" id="{{::trsWidgetName}}">
  <div class="text-radio-switch__viewport">
    <label ng-repeat="item in ::trsItems" on-finish-render="::ngRepeatFinished" class="text-radio-switch__label" 
    ng-class="{'text-radio-switch__label_active': item[trsKeyField]==trsItemSelected}" for="{{::(trsWidgetName + '__' + item[trsKeyField])}}"><input 
    ng-click="trsSelect(item)" type="radio" value="item[trsKeyField]" 
    id="{{::(trsWidgetName + '__' + item[trsKeyField])}}"
    ng-checked="{{item[trsKeyField]==trsItemSelected}}" name="{{::trsWidgetName}}" />{{::item[trsNameField]}}</label>
  </div>
  <div class="text-radio-switch__left">&lt;</div>
  <div class="text-radio-switch__right">&gt;</div>
  <div class="text-radio-switch__highlight-bar"><span></span></div>
</div>
`,
            scope: {
                trsItems: '=items',
                trsKeyField: '@keyField',
                trsNameField: '@nameField'
            },
            link: function (scope, element, attributes, ngModelCtrl) {
                var w = angular.element($window);
                widgetsCounter++
                scope.trsWidgetName = 'text-radio-switch-widget-' + widgetsCounter
                scope.trsItemSelected = ngModelCtrl.$modelValue;


                ngModelCtrl.$render = function () {
                    scope.trsItemSelected = ngModelCtrl.$viewValue;
                    doHighlight()
                };

                function doHighlight() {
                    let label = document.querySelector('label[for="' + scope.trsWidgetName + '__' + scope.trsItemSelected + '"]')

                    let span = document.querySelector('#' + scope.trsWidgetName + ' span')
                    if (!label || !span) return;

                    angular.element(span).css({
                        width: label.offsetWidth + 'px',
                        left: label.offsetLeft + 'px'
                    })

                }
                
                function updateHighlightBarWidth(){
                    let labels = document.querySelectorAll('#' + scope.trsWidgetName + ' label')
                    let width = 0
                    Array.prototype.forEach.call(labels, (l)=>{
                        width += l.offsetWidth
                        console.log(l.style)

                        let style = window.getComputedStyle(l);

                        width += parseInt(style.marginLeft, 10) + parseInt(style.marginRight, 10);
                        width += parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);

                    })

                    let bar = document.querySelector('#' + scope.trsWidgetName + ' .text-radio-switch__highlight-bar')
                    angular.element(bar).css({
                        width: width + 'px'
                    })
                }


                scope.$on('trsRepeatFinish', ()=> {
                    setTimeout(()=> {
                        doHighlight()
                        updateHighlightBarWidth()

                    }, 50)
                });

                scope.trsSelect = function (item) {
                    ngModelCtrl.$setViewValue(item[scope.trsKeyField])
                    scope.trsItemSelected = ngModelCtrl.$viewValue;
                    doHighlight()
                }
                   

            }
        }
    })