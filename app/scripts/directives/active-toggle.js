'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:activeToggle
 * @description
 * # activeToggle
 */
angular.module('powermeApp')
  .directive('activeToggle', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attr) {

        element.on('click', function(){

          var target = angular.element(attr.target) || Array(element);

          if (element.hasClass('active')) {
            element.removeClass('active');
            target.removeClass('show');
          } else {
            element.addClass('active');
            target.addClass('show');
          }

        });

      }
    };
  });
