'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:TileControlClose
 * @description
 * # TileControlClose
 */
angular.module('powermeApp')
  .directive('tileControlClose', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        var tile = element.parents('.tile');

        element.on('click', function() {
          tile.addClass('closed').fadeOut();
        });
      }
    };
  });
