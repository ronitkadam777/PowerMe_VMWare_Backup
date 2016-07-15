'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('HelpCtrl', function ($scope) {
     $scope.page = {
      title: 'Documentation',
      subtitle: 'Place subtitle here...'
    };
  });
