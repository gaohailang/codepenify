```html
<!--
link:http://code.angularjs.org/1.2.5/angular.js,http://code.angularjs.org/1.2.5/angular-animate.js
-->
<div ng-init="items=['a','b','c','d','e','x','f', 'h']">
  <input placeholder="filter" ng-model="f" />
  <div ng-repeat="item in items | filter:f" class="repeat-animation">
    {{item}}
  </div>
</div>
```

```js
angular.module('myApp', ['ngAnimate']);
angular.element(document).ready(function() {
      angular.bootstrap(document, ['myApp']);
    });
```

```css
.repeat-animation {
  box-sizing:border-box;
  line-height:20px;
  border:1px solid #ddd;
}

.repeat-animation.ng-enter-stagger,
.repeat-animation.ng-leave-stagger,
.repeat-animation.ng-move-stagger {
  /* 200ms will be applied between each sucessive enter operation */ 
  -webkit-transition-delay:0.2s;
  transition-delay:0.2s;
}

.repeat-animation.ng-enter,
.repeat-animation.ng-leave,
.repeat-animation.ng-move {
  -webkit-transition:0.5s linear all;
  transition:0.5s linear all;
}

.repeat-animation.ng-leave.ng-leave-active,
.repeat-animation.ng-enter,
.repeat-animation.ng-move {
  -webkit-transition:0.5s linear all;
  transition:0.5s linear all;

  opacity:0;
  line-height:0;
}

.repeat-animation.ng-leave,
.repeat-animation.ng-move.ng-move-active,
.repeat-animation.ng-enter.ng-enter-active {
  opacity:1;
  line-height:20px;
}
```