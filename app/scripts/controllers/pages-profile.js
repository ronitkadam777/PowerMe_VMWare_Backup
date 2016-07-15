'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:PagesProfileCtrl
 * @description
 * # PagesProfileCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('ProfileCtrl', function ($scope) {
    $scope.page = {
      title: 'Profile Page',
      subtitle: 'Place subtitle here...'
    };
  });
