'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('MainCtrl', function ($scope, $http) {

    $scope.main = {
      title: 'PowerMe',
      settings: {
        navbarHeaderColor: 'scheme-default',
        sidebarColor: 'scheme-default',
        brandingColor: 'scheme-default',
        activeColor: 'scheme-cyan',
        headerFixed: true,
        asideFixed: true,
        rightbarShow: false
      }
    };

    $scope.ajaxFaker = function(){
      $scope.data=[];
      var url = 'http://www.filltext.com/?rows=10&fname={firstName}&lname={lastName}&delay=5&callback=JSON_CALLBACK';

      $http.jsonp(url).success(function(data){
        $scope.data=data;
        console.log('cecky');
        angular.element('.tile.refreshing').removeClass('refreshing');
      });
    };
  });