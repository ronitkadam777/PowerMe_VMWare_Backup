'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:UiGridCtrl
 * @description
 * # UiGridCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('GridCtrl', function ($scope) {
    $scope.page = {
      title: 'Grid',
      subtitle: 'Place subtitle here...'
    };
  });
