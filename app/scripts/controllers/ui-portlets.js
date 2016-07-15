'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:UiPortletsCtrl
 * @description
 * # UiPortletsCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('PortletsCtrl', function ($scope) {
    $scope.page = {
      title: 'Portlets',
      subtitle: 'Place subtitle here...'
    };
  });
