angular
    .module('powermeApp')
    .controller('Compliance_OverallCtrl',function($scope,$rootScope,averageRankingService,$http,ngTableParams){
     $scope.spinnerOn = true;
     $scope.complianceType = "overall";
    
     $http.post('http://localhost:9200/powerme/user_comp_info/_search',{"size": 0,"aggs":{"DateWiseCompliance":{"terms":{"field": "date","size":0,"order" : { "_term" : "asc" }}}}})
        .success(function(data){
        $scope.sortType = '_source.date';
        $scope.sortReverse = true;
        var TotalData = [];
         for(var i=0; i<data.aggregations.DateWiseCompliance.buckets.length; i++){
             var date8A = moment(data.aggregations.DateWiseCompliance.buckets[i].key_as_string,"YYYY-MM-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                      TotalData.push([dateFormat,data.aggregations.DateWiseCompliance.buckets[i].doc_count]);
                      
         }
         
          angular
            .element('#ComplianceOverallChart')
            .highcharts({
                          chart: {
                            zoomType: 'x'

                          },
                          title: {
                            text: 'Daily Compliance Issues'
                          },
                          subtitle: {
                            text: document.ontouchstart === undefined ?
                              'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                          },

                          xAxis: {
                            type: 'datetime',

                            labels: {
                              autoRotation: false
                            }
                          },
                          yAxis: {
                            title: {
                              text: '# of Compliance Issues'
                            },
                            min: 0,
                            labels: {
                              formatter: function () {
                                return this.value;
                              }
                            }
                          },

                          legend: {
                            enabled: true
                          },
                          series: [{
                              name: 'Compliance Issues',
                              data: TotalData
                          }]
                        });
        })
        .error(function(err){
            console.log(err);
        });
    
    
     $http.post('http://localhost:9200/powerme/user_comp_info/_search',{"size":10000})
     .success(function(data){
        $scope.complianceData = data.hits.hits;
        $scope.spinnerOn = false;
        
         /*
         $scope.options.tableParams = new ngTableParams({
                  page: 1, // show first page
                  count: 10 // count per page
                }, {
                  total: $scope.options.vendorTableData.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.vendorTableData.length);
                    $defer.resolve($scope.options.vendorTableData.slice((params.page() - 1) * params.count(),
                                                                  params.page() * params.count()));
                  }
        });
        //$scope.options.tableParams.reload();
        */
     })
    .error(function(err){
        console.log(err);
     });

});