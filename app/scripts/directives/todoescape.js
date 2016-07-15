'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:todoEscape
 * @description
 * # todoEscape
 */
angular.module('powermeApp')
  .directive('todoEscape', function() {
    var ESCAPE_KEY = 27;

    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        element.bind('keydown', function (event) {
          if (event.keyCode === ESCAPE_KEY) {
            scope.$apply(attrs.todoEscape);
          }
        });
      }
    };
  });
