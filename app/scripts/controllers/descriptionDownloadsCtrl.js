angular
    .module('powermeApp')
    .controller('descriptionDownloadsCtrl',function($scope, $http, $rootScope, averageRankingService, ngTableParams){
    
    $scope.options = {
                  reportDescriptions: [],
    };
    $scope.showSpinner = true;
    $scope.dbDescriptions = [];
    $scope.pgDescriptions = [];
    $scope.reportDescriptions = [];
    
    /*$http.get('http://bi-stg-pwrme-d1.vmware.com:8080/export/dashboard',{headers: {"Accept": "application/json;charset=utf-8",
       "Accept-Charset":"charset=utf-8"}})*/
    $http.get('http://bi-stg-pwrme-d1.vmware.com:8080/export/dashboard')
        .success( function(res){
        
        $scope.dbDescriptions.push({
               dashboard_id:"Dashboard_id",
               dashboard_desc:"Description",
               dashboard_desc_timestamp:"Timestamp",
               user_name:"username",
               usage_count:"Usage Count",
               dashboard_usage_timestamp:"Usage Timestamp" 
           });
        angular.forEach(res, function(obj, id){
           $scope.dbDescriptions.push({
               dashboard_id:obj.dashboard_id,
               dashboard_desc:obj.dashboard_desc,
               dashboard_desc_timestamp:obj.dashboard_desc_timestamp,
               user_name:obj.user_name,
               usage_count:obj.usage_count,
               dashboard_usage_timestamp:obj.dashboard_latest_usage_timestamp
           });
        });
        $scope.showSpinner = false;
    })
    .error(function(err){
        console.log(err);
    });
    
    $http.get('http://bi-stg-pwrme-d1.vmware.com:8080/export/dashboard_page')
        .success( function(res){
        
        $scope.pgDescriptions.push({
               dashboard_id:"Dashboard_id",
               dashboardPage_id:"Page_id",
               dashboardPage_desc:"Description",
               dashboard_Page_desc_timestamp:"Timestamp",
               user_name:"username",
               usage_count:"Usage Count",
               dashboard_pg_usage_timestamp:"Usage Timestamp"
           });
        angular.forEach(res, function(obj, id){
           $scope.pgDescriptions.push({
               dashboard_id:obj.dashboard_id,
               dashboardPage_id:obj.dashboardPage_id,
               dashboardPage_desc:obj.dashboardPage_desc,
               dashboard_Page_desc_timestamp:obj.dashboard_Page_desc_timestamp,
               user_name:obj.user_name,
               usage_count:obj.page_Usage_Count,
               dashboard_pg_usage_timestamp:obj.dashboard_page_usage_timestamp
              
           });
        });
       $scope.showSpinner = false; 
    })
    .error(function(err){
        console.log(err);
    });
    
     
    

  
});