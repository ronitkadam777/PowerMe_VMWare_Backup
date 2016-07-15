'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:vectorMap
 * @description
 * # vectorMap
 */
angular.module('powermeApp')
  .directive('vectorMap', function () {
    return {
      restrict: 'AE',
      scope: {
        options: '='
      },
      link: function postLink(scope, element) {
        var options = scope.options;
        element.vectorMap(options);
      }
    };
  });
