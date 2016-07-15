'use strict';
/**
 *
 */
angular.module('powermeApp')
  .controller('tagsCtrl',
  ['$scope', '$http', '$sce', '$state', '$window', '$stateParams', '$rootScope', 'averageRankingService',
   'ngTableParams', '$modal',
   function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService,
             ngTableParams, $modal) {
     $rootScope.query = {
       "size":1000
     };

     $scope.options = {
       tableData: []
     }

     $scope.newTag = {
       name: '',
       desc: ''
     }

     var refreshTable = function () {
       var data = averageRankingService(environment.apiUri + '/powerme/tags/_search?size=1000&sort=tag_name');
       data = JSON.parse(data);
       $scope.options.tableData = data.hits.hits;
     }

     refreshTable();

     $scope.addTag = function (newTag, newTagDesc) {
       $scope.newTag.name = '';
       $scope.newTag.desc = '';
       var tag_doc = {
         tag_name: newTag,
         tag_description: newTagDesc,
         tag_created_by: $rootScope.currentUser.username,
         tag_created_on: new Date()
       };
       $http
         .post(environment.apiUri + '/powerme/tags', tag_doc)
         .success(function (data) {
                    console.log(data);
                    data._source = tag_doc;
                    $scope.options.tableData.push(data);
                    $scope.tableParams.reload();
                  })
         .error(function () {
                  console.log("error");
                });
     }

     $scope.modifyTagName = function (tag, tag_name, tag_description, id) {

      console.log('*** ' + tag);
      $scope.errorDuplicate = false;
      for(var i=0; i< $scope.options.tableData.length; i++){
        
        var tag = $scope.options.tableData[i];
        if((tag_name.trim().toLowerCase() === tag._source.tag_name.trim().toLowerCase()) && 
          (id !== tag._id) ){

          $scope.errorDuplicate = true;
          $scope.errorTagName = tag_name;

          return false;

        }
      }

       $http
         .post(environment.apiUri + '/powerme/tags/' + id + '/_update', {
           "doc": {
             "tag_name": tag_name,
             "tag_description": tag_description
           }
         })
         .success(function (data) {
                    console.log(data);
                    return true;
                  })
         .error(function () {
                  console.log("error");
                });
         tag.$edit = false;
         return true;
     }

     $scope.removeTag = function (tag) {
       var modalInstance = $modal.open({
         templateUrl: '/views/tmpl/tagDetails.html',
         controller: 'TagDetailsCtrl',
         resolve: {
           tag: function () {
             return tag;
           }
         }
       });

       modalInstance.result.then(function (selectedItem) {
         $http.delete(environment.apiUri + '/powerme/tags/' + tag._id)
           .success(function (data) {
                      console.log("Delete Tag response : ", data);
                      $scope.options.tableData.splice($scope.options.tableData.indexOf(tag), 1);
                      $scope.tableParams.reload();
                    })
           .error(function (error) {
                    console.log("Error While removing Tag : ", error);
                  });
       }, function () {
         console.log('Modal dismissed at: ' + new Date());
       });

     }

     $scope.checkExistingTag = function(value, index, array) {
       var result = false;

       if (value._source.tag_name.trim().toLowerCase() === $scope.newTag.name.trim().toLowerCase()) {
         result = true;
       }

       return result;
     }

     $scope.tableParams = new ngTableParams({
       page: 1,            // show first page
       count: 10           // count per page
     }, {
       total: $scope.options.tableData.length, // length of data
       counts: [],
       getData: function ($defer, params) {
         params.total($scope.options.tableData.length),
         $defer.resolve($scope.options.tableData.slice((params.page() - 1) * params.count(),
                                                       params.page() * params.count()));
       }
     });
   }]);
