'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:PagesLoginCtrl
 * @description
 * # PagesLoginCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('LoginCtrl', function ($scope, $state) {
    $scope.login = function() {
      $state.go('app.dashboard');
    };
  });
