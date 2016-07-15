'use strict';
/**
 *
 */
angular.module('powermeApp')

  .controller('DashboardChartsCtrl', 
              function ($scope, $http, $rootScope, averageRankingService) {

                $scope.selectedIcon = '';
                $scope.selectedIcons = [];
                $scope.chartType = 'dashboardGroup';
                $scope.selectedDashboardGroup = {};
                $scope.dashboardNamesByGroup = [];
                
                $scope.catalogData = $rootScope.catalogData;
                $scope.dashboardGroupNames = [];
                $scope.dashboardGroupsObj = [];
                $scope.dashboardNamesObj = {};
                $scope.SpecificDashboardPageUsageStats = [];
                var dashboardKey = '';

                $scope.getDashboardGroups = function() {
                    $scope.dashboardGroupNames = [];
                    $scope.dashboardGroupsObj = [];
                    $scope.dashboardNamesObj = {};
                    
                    angular.forEach($scope.catalogData, function(value, key) {

                    	angular.forEach(value.children, function(iValue, iKey) {
                  		  
                	    	angular.forEach(iValue.children, function(jValue, jKey) {
                  			  $scope.dashboardGroupNames.push(jValue.label)
                			  $scope.dashboardGroupsObj.push({subjectArea: jValue.label, application: iValue.label, system: value.label})
                			  dashboardKey = jValue.label + '-' + iValue.label + '-' + value.label;
                  			  $scope.dashboardNamesObj[dashboardKey] = jValue.children;
                	    	});
                		  
                    	});
                	});
                }
                $scope.getDashboardGroups();

                $scope.dgGroupChange = function() {
                	$scope.selectedDashboardName = '';
                	$scope.dashboardNamesByGroup = $scope.dashboardNamesObj[$scope.selectedDashboardGroup.subjectArea + '-' + $scope.selectedDashboardGroup.application + '-' + $scope.selectedDashboardGroup.system];
                }
                
                $scope.renderChart = function() {
                	if($scope.chartType == 'dashboard'){
                		$scope.renderDashboardChart();
                	}else {
                		$scope.renderGroupChart();
                	}
                }

                $scope.renderDashboardChart = function() {

                    $scope.DailyUsageCount = [];

                    $rootScope.query = {
                      "size": 0,
                      "query": {
                        "bool": {
                          "must": [{"match": {"repository_name": $scope.selectedDashboardGroup.system}},
                            {"match": {"application": $scope.selectedDashboardGroup.application}},
                            {"match": {"subjectarea_name": $scope.selectedDashboardGroup.subjectArea}},
                            {"match": {"_dbname": $scope.selectedDashboardName}}]
                        }
                      },
                      "aggs": {
                        "group_by_dbname": {
                          "date_histogram": {"field": "date", "interval": "week"},
                          "aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}
                        }
                      }
                    };
                    var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data = JSON.parse(data);

                    for (var i = 0; i < data.aggregations.group_by_dbname.buckets.length; i++) {
                      var date1 = moment(data.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var dateFormat = Date.UTC(date1[0], month, date1[2]);
                      $scope.DailyUsageCount.push([dateFormat,
                                                   data.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }


                    angular.element('#dbGroupChart')
                      .highcharts({
                        chart: {
                          zoomType: 'x'
                        },
                        title: {
                          text: 'Dashboard Usage'
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
                          allowDecimals: false,
                          title: {
                            text: 'Dashboard Hits',
                          },
                          min: 0,
                          labels: {
                            formatter: function () {
                              return this.value;
                            }
                          },
                          offset: 0
                        },
                        legend: {
                          enabled: false
                        },
                        plotOptions: {},
                        series: [{
                          name: 'Specific Dashboard Usage',
                          data: $scope.DailyUsageCount
                        }]
                      }); //Graph Endpoint
                    //AJAX CALL FOR FREQUENT USERS
                }
                $scope.renderDashboardChart_working = function() {
                	//"subjectarea_name":'+'"'+$scope.selectedDashboardGroup.subjectArea+'"'+'}},{"match": {"repository_name":'+'"'+.system+'"'+'}},{"match": {"application":'+'"'+$scope.selectedDashboardGroup.application+'"'+'}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
                	
                	
                    $rootScope.query = {
                      "size": 0,
                      "query": {
                        "bool": {
                          "must": [{"match": {"repository_name": $scope.selectedDashboardGroup.system}},
                            {"match": {"application": $scope.selectedDashboardGroup.application}},
                            {"match": {"subjectarea_name": $scope.selectedDashboardGroup.subjectArea}},
                            {"match": {"_dbname": $scope.selectedDashboardName}}//,
                            //{"match": {"_pgname": $scope.dashboardPageName}}
                            ]
                        }
                      },
                      "aggs": {
                        "group_by_dbname": {
                          "date_histogram": {"field": "date", "interval": "week"},
                          "aggs": {"sum_of_dbcount": {"sum": {"field": "_pgcount"}}}
                        }
                      }
                    };
                    var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data = JSON.parse(data);

                    for (var i = 0; i < data.aggregations.group_by_dbname.buckets.length; i++) {
                      var date1 = moment(data.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var dateFormat = Date.UTC(date1[0], month, date1[2]);
                      $scope.SpecificDashboardPageUsageStats.push([dateFormat,
                                                                   data.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }


                    angular.element('#dbGroupChart')
                      .highcharts({
                        chart: {
                          zoomType: 'x'
                        },
                        title: {
                          text: 'Dashboard Page Usage'
                        },
                        subtitle: {
                          text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' :
                            'Pinch the chart to zoom in'
                        },
                        xAxis: {
                          type: 'datetime',
                          labels: {
                            autoRotation: false
                          },
                          offset: 0
                        },
                        yAxis: {
                          allowDecimals: false,
                          title: {
                            text: 'Dashboard Page Hits',
                          },
                          min: 0,
                          labels: {
                            formatter: function () {
                              return this.value;
                            }
                          },
                          offset: 0
                        },
                        legend: {
                          enabled: false
                        },
                        plotOptions: {},
                        series: [{
                          name: 'Specific Dashboard Page Usage',
                          data: $scope.SpecificDashboardPageUsageStats
                        }]
                      }); //Graph Endpoint
                }
                
                $scope.renderGroupChart = function() {
                	//http://localhost:9000/#/app/Cataloge/OBIEE/application/VMDash/subjectarea/Account%20Analytics

                	$scope.SpecificDashboardPageData_DashboardHits = [];
                	$scope.SpecificDashboardPageData_UserCount = [];
                	$scope.Chart8_FinalData = [];

                	var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":'+'"'+$scope.selectedDashboardGroup.subjectArea+'"'+'}},{"match": {"repository_name":'+'"'+$scope.selectedDashboardGroup.system+'"'+'}},{"match": {"application":'+'"'+$scope.selectedDashboardGroup.application+'"'+'}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
                	query8A = JSON.parse(query8A);
                    $rootScope.query = query8A;
                	var data8A = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
                    data8A = JSON.parse(data8A);

                    for (var i = 0; i < data8A.aggregations.group_by_dbname.buckets.length; i++) {
                        var date8A = moment(data8A.aggregations.group_by_dbname.buckets[i].key_as_string,"YYYY-M-DD").format("YYYY,M,DD");
                        date8A = date8A.split(',');
                        var month = date8A[1] - 1;
                        var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                        $scope.SpecificDashboardPageData_DashboardHits.push([dateFormat,data8A.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }

                    $scope.Chart8_FinalData.push({
                    	name: " Dashboard Group Usage",
                    	data: $scope.SpecificDashboardPageData_DashboardHits,

                    });

                    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":'+'"'+$scope.selectedDashboardGroup.subjectArea+'"'+'}},{"match": {"repository_name":'+'"'+$scope.selectedDashboardGroup.system+'"'+'}},{"match": {"application":'+'"'+$scope.selectedDashboardGroup.application+'"'+'}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
                	query8B = JSON.parse(query8B);
                    $rootScope.query = query8B;
                	var data8B = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
                    data8B = JSON.parse(data8B);

                    for (var i = 0; i < data8B.aggregations.group_by_dbname.buckets.length; i++) {

                	    var date1 = moment(data8B.aggregations.group_by_dbname.buckets[i].key_as_string,"YYYY-M-DD").format("YYYY,M,DD");
                        date1 = date1.split(',');
                        var month = date1[1] - 1;
                        var date = Date.UTC(date1[0], month, date1[2]);

                        $scope.SpecificDashboardPageData_UserCount.push([date,data8B.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.buckets.length]);

                     }

                    $scope.Chart8_FinalData.push({
                    	name: " User Count",
                    	data: $scope.SpecificDashboardPageData_UserCount

                    });

                    console.log('$scope.Chart8_FinalData');
                    console.log($scope.Chart8_FinalData);
                    
                    angular
                        .element('#dbGroupChart')
                        .highcharts({
                            chart: {
                                zoomType: 'x'

                            },

                            title: {
                                text: 'Dashboard Group Usage Analysis'
                            },
                            subtitle: {
                                text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                            },

                            xAxis: {
                                type: 'datetime',

                                labels: {
                                    autoRotation: false
                                }
                            },
                            yAxis: {
                                title: {
                                    text: '# of Dashboard Hits / # of Users'
                                },
                                min: 0,
                                labels: {
                                    formatter: function() {
                                        return this.value;
                                    }
                                }
                            },

                            legend: {
                                enabled: true
                            },
                           series:  $scope.Chart8_FinalData

                        });
                    
                }

                
});
