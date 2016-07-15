'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:PagesChatCtrl
 * @description
 * # PagesChatCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('ChatCtrl', function ($scope, $resource) {
    $scope.inbox = $resource('scripts/jsons/chats.json').query();

    $scope.archive = function(index) {
      $scope.inbox.splice(index, 1);
    };
  });
