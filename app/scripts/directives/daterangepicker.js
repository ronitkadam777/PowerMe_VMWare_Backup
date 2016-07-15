'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:daterangepicker
 * @description
 * # daterangepicker
 */
angular.module('powermeApp')
  .directive('daterangepicker', function() {
    return {
      restrict: 'A',
      scope: {
        options: '=daterangepicker',
        start: '=dateBegin',
        end: '=dateEnd'
      },
      link: function(scope, element) {
        element.daterangepicker(scope.options, function(start, end) {
          scope.start = start.format('MMMM D, YYYY');
          scope.end = end.format('MMMM D, YYYY');
    //      scope.start = null,
    //      scope.end = null,
          
          scope.$apply();
        });
       

      }
    };
  });

