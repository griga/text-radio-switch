# text-radio-switch angular directive

Simple directive that extends radio button functionality.

Check out [demo](http://griga.github.io/text-radio-switch/)


### Usage

1. Include script and style file to your build

2. Then add `textRadioSwitch` module as your app dependency
    ```js
       angular.module('app', ['textRadioSwitch']).controller("DemoController", function () {
           this.model = {
               type: '1'
           }

           this.items = [
               {type: 'all', name: 'All'},
               {type: '1', name: 'YBQ-TKO'},
               {type: '2', name: 'TKO-AKL'},
               {type: '3', name: 'AKL-SFO'},
               {type: '4', name: 'SFO-GIG'},
           ]
       })
    ```

3. And you can use it like this
    ```html
        <text-radio-switch
               ng-model="vm.model.type"
               items="vm.items"
               key-field="type"
               name-field="name"></text-radio-switch>
    ```


### SCSS customization

If you are using SCSS for managing styles in your project, then you can customize directive
 look by overriding following variables (before you include `dist/text-radio-switch.directive.scss`)

Next SCSS customizations are available (defaults are shown)

```scss
    $trs-font-size: 1em !default;
    $trs-line-height: 2em !default;
    $trs-font-color: inherit !default;
    $trs-active-color: darken(red, 5%) !default;
    $trs-bg-color: transparent !default;
    $trs-highlight-bar-color: rgba(white, .2) !default;
    $trs-items-gap: .7em !default;
```


