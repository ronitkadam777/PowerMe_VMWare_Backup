angular
    .module('powermeApp')
    .controller('userLoginLogsCtrl', function($scope, $rootScope, $http, averageRankingService, $moment, ngTableParams, $stateParams){
    
    $scope.options = {
            tableData: []//,
            //halfData: []
     };
    
    $scope.username = $stateParams.username;
    $scope.fileName = "LoginLog_"+$scope.username+".csv";
    $rootScope.query = {"size": 0,"query": {"bool": {"must": [ {"match": { "username": $scope.username } } ] } }, "aggs": { "Top_Users": { "terms": { "field": "timestamp", "size" : 0, "order" : { "_term" : "desc" } } } }};
    var data = averageRankingService('http://bi-stg-pwrme-d1.vmware.com:9200/powerme/usageProfiling/_search');
    data = JSON.parse(data);
    $scope.options.tableData = data.aggregations.Top_Users.buckets;
    
    $scope.userLoginLogs_csv = [];
    $scope.userLoginLogs_csv.push({
        time_stamp:"Timestamp"
    });
    
    
    for(var i=0; i<$scope.options.tableData.length; i++){
        $scope.userLoginLogs_csv.push({
            time_stamp:$scope.options.tableData[i].key_as_string
        });
        
       // $scope.options.halfData.push($scope.options.tableData[i]);
    }
    $scope.options.userlogTableParams = new ngTableParams({
                  page: 1, // show first page
                  count: 10 // count per page
                }, {
                  total: $scope.options.tableData.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.tableData.length);
                    $defer.resolve($scope.options.tableData.slice((params.page() - 1) * params.count(),params.page() * params.count()));
                  }
    });
    
   $scope.options.userlogTableParams.reload();
    
    
})