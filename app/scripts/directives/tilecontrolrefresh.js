'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:tileControlRefresh
 * @description
 * # tileControlRefresh
 */
angular.module('powermeApp')
  .directive('tileControlRefresh', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');
        var dropdown = element.parents('.dropdown');

        element.on('click', function(){
          tile.addClass('refreshing');
          dropdown.trigger('click');
        });
      }
    };
  });
