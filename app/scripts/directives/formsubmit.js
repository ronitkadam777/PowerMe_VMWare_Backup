'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:formSubmit
 * @description
 * # formSubmit
 */
angular.module('powermeApp')
  .directive('submit', function() {
    return {
      restrict: 'A',
      link: function(scope, formElement, attrs) {
        var form;
        form = scope[attrs.name];
        return formElement.bind('submit', function() {
          angular.forEach(form, function(field, name) {
            if (typeof name === 'string' && !name.match('^[$]')) {
              if (field.$pristine) {
                return field.$setViewValue(field.$value);
              }
            }
          });
          if (form.$valid) {
            return scope.$apply(attrs.submit);
          }
        });
      }
    };
  });
