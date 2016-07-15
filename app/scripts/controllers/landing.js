'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:HelpCtrl
 * @description
 * # HelpCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('LandingCtrl', function ($scope, $state) {
     $scope.page = {
      title: 'Welcome to PowerMe'
      
    };
    
    console.log("$state.current "+JSON.stringify($state.current));
  });
