/**
 * Created by tapathan on 10/12/2015.
 */
'use strict'
angular.module('powermeApp')
  .controller('TagDetailsCtrl', ['$scope', 'tag', '$state', function ($scope, tag, $state) {
    $scope.tag = tag;
    if ($state.includes('**.search')) {
      $scope.deleteEnabled  = false;
    } else {
      $scope.deleteEnabled  = true;
    }
  }]);
