angular
    .module('powermeApp')
    .controller('usageProfilingCtrl', function($scope, $rootScope, $http, averageRankingService, $moment, ngTableParams){
     $scope.options = {
                  profilingData: []
     };
            
     $rootScope.query = {"size": 0,"aggs": {"dailyUsage": {"date_histogram": {"field": "timestamp","interval": "day"}}}};
        var data = averageRankingService('http://bi-stg-pwrme-d1.vmware.com:9200/powerme/usageProfiling/_search');
        data = JSON.parse(data);
        var dateFormat = [];
        $scope.Chart3_FinalData = [];
        for (var i = 0; i < data.aggregations.dailyUsage.buckets.length; i++) {
            var date1 = moment(data.aggregations.dailyUsage.buckets[i].key_as_string).format('YYYY,M,DD');
            date1 = date1.split(',');
           var month = date1[1] - 1;
           var day = (Number(date1[2]) +1);
           var date = Date.UTC(date1[0], month, day);
            dateFormat.push([date,data.aggregations.dailyUsage.buckets[i].doc_count]);
        }
    
    $scope.Chart3_FinalData.push({
	          	name: "Daily Usage",
	          	data: dateFormat,
                color: '#8085E9'
        });
    
    $rootScope.query = { "size": 0, "aggs": { "group_by_dbname": { "date_histogram": { "field": "timestamp", "interval": "day" }, "aggs": { "userCount": { "terms": { "field": "username", "size": 0 } } } } }};
        var data = averageRankingService('http://bi-stg-pwrme-d1.vmware.com:9200/powerme/usageProfiling/_search');
        data = JSON.parse(data);
        var dateFormat = [];
        for (var i = 0; i < data.aggregations.group_by_dbname.buckets.length; i++) {
            var date1 = moment(data.aggregations.group_by_dbname.buckets[i].key_as_string).format('YYYY,M,DD');
            date1 = date1.split(',');
           var month = date1[1] - 1;
           var day = (Number(date1[2]) +1);
           var date = Date.UTC(date1[0], month, day);
            dateFormat.push([date,data.aggregations.group_by_dbname.buckets[i].userCount.buckets.length]);
        }
    
    $scope.Chart3_FinalData.push({
	          	name: "No. of users",
	          	data: dateFormat,
                color: '#FFA500'
        });
    
    console.log($scope.Chart3_FinalData);
        angular
            .element('#usageProfilingChart')
            .highcharts({
            chart: {
             zoomType: 'x',
             type: 'line'
            },
         title: {
            text: 'Compares Usage Hits & Users',
            style: {
                 display: 'none'
            }
         },
         subtitle: {
             text: document.ontouchstart === undefined ?
             'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
         },
         xAxis: {
             type: 'datetime',
             labels: {
                 autoRotation: false
             },
             offset: 0
            },
         yAxis: {
             title: {
                 text: '# of Users / # of Hits',
             },
             min: 0,
             labels: {
                 formatter: function() {
                     return this.value;
                     }
             },
             offset: 0
             },
             legend: {
                align: 'right',
                verticalAlign: 'middle',
                layout: 'vertical',
                enabled: true
             },
                
            series: $scope.Chart3_FinalData
        }); // Graph Endpoint
    
    
    //Login Usage Table
    $rootScope.query = {"size": 0,"aggs":{"Top_Users":{"terms":{"field":"username","size" : 0}}}};
    var data = averageRankingService('http://bi-stg-pwrme-d1.vmware.com:9200/powerme/usageProfiling/_search');
    data = JSON.parse(data);
    $scope.options.profilingData = data.aggregations.Top_Users.buckets;
    
    $scope.usageProfiling_csv = [];
    
    $scope.usageProfiling_csv.push({
        Username:"Username",
        Login_Count:"Login Count"
    });
    
    for(var i=0; i< $scope.options.profilingData.length; i++){
        $scope.usageProfiling_csv.push({
            Username:$scope.options.profilingData[i].key,
            Login_Count:$scope.options.profilingData[i].doc_count
    });
    }
    
    
    $scope.options.loginTableParams = new ngTableParams({
                  page: 1, // show first page
                  count: 10 // count per page
                }, {
                  total: $scope.options.profilingData.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.profilingData.length);
                    $defer.resolve($scope.options.profilingData.slice((params.page() - 1) * params.count(),
                                                                  params.page() * params.count()));
                  }
    });
    
    $scope.options.loginTableParams.reload();
    
})