'use strict';
/**
 *
 */
angular.module('powermeApp')
  .controller(
    'personaCtrl',
    ['$scope', '$rootScope', 'personas', 'users', 'ngTableParams', 'Users', '$filter',
     function ($scope, $rootScope, personas, users, ngTableParams, Users, $filter) {
       $scope.options = {
         tableData: users.hits.hits
       }

       $scope.filterPersona = function () {
         $scope.tableParams.filter({$: $scope.filterData});
         $scope.tableParams.reload();
       }

       $scope.tableParams = new ngTableParams({
         page: 1,            // show first page
         count: 10,           // count per page
         sorting: {
           user_name: 'asc'
         }
       }, {
         total: $scope.options.tableData.length, // length of data
         counts: [],
         getData: function ($defer, params) {
           var users = [];
           angular.forEach($scope.options.tableData, function (user) {
             this.push(user._source);
           }, users);
           users = $scope.filterData ?
             $filter('filterBy')(users, ['user_name', 'roles'], $scope.filterData) : users;
           users = params.sorting() ? $filter('orderBy')(users, params.orderBy()) : users;
           params.total(users.length);
           $defer.resolve(users.slice((params.page() - 1) * params.count(),
                                      params.page() * params.count()));
         }
       });
       $scope.sort = function (keyname) {
         $scope.sortKey = keyname;   //set the sortKey to the param passed
         $scope.reverse = !$scope.reverse; //if true make it false and vice versa
         $scope.tableParams.sorting(keyname, $scope.reverse ? 'asc' : 'desc');
         $scope.tableParams.reload();
       }

       $scope.addUser = function (user_name, roles) {
         $scope.saveUser({
                           user_name: user_name,
                           roles: roles,
                           add_desc: true,
                           remove_desc: false
                         }, true);
       }

       $scope.saveUser = function (user, isNew) {
         var newUser = new Users(user);

         newUser.$save(function (data, headers) {
           console.log("Result of User Save : ", data);
           if (isNew) {
             data._source = user;
             $scope.options.tableData.push(data);
             $scope.tableParams.reload();
           }
         }, function (err) {
           console.error(err);
         });

       }
     }]);
