'use strict';
/**
 *
 */
angular.module('powermeApp')

  .controller('AnalysisCtrl',
              function ($scope, $http, $rootScope, averageRankingService, ngTableParams) {

                $scope.chartType = 'application'; //dashboardGroup
                $scope.catalogData = $rootScope.catalogData;
                $scope.applications = [];
                $scope.dashboardGroupsObj = [];
                $scope.CheckedApps = [];
                $scope.dashboardNamesObj = {};
                $scope.dashboardPageObj = [];
                $scope.dbPgNameObj = {};
                $scope.options = {
                  tableData: [],
                  tableData_less: [],
				  tableUser: [],
                };
                
    
                $scope.tracker = function () {
                       
                    var tracking_doc = {
                         username: $rootScope.currentUser.username,
                         timestamp: new Date()
                       };
                       $http
                         .post(environment.apiUri + '/powerme/usageTracking', tracking_doc)
                         .success(function (data) {
                                    console.log(data);
                                    data._source = tracking_doc;
                                    
                                  })
                         .error(function () {
                                  console.log("error");
                                });
                     }
                /*
                $scope.tracker = function () {
                    var d = new Date();
                    var curr_date = d.getDate();
                    var curr_month = d.getMonth();
                    var curr_year = d.getFullYear();
                    var date = curr_date + "-" + curr_month + "-" + curr_year;
                    var tracking_doc = {
                         username: $rootScope.currentUser.username,
                         timestamp: date,
                         fileSource: "app"
                       };
                       $http
                         .post(environment.apiUri + '/powerme/usageProfiling', tracking_doc)
                         .success(function (data) {
                                    console.log(data);
                                    data._source = tracking_doc;
                                    
                                  })
                         .error(function () {
                                  console.log("error");
                                });
                     }
                */
                $scope.dashboardsFromSelectedGroups = [];
                $scope.disableRender = false;
                var dashboardKey = '';
                var dbgKey = '';

                $scope.getDashboardGroups = function () {
                  $scope.dashboardGroupsObj = [];
                  $scope.dashboardNamesObj = {};
                  $scope.applications = [];
                  $scope.appNamesObj = {};

                  angular.forEach($scope.catalogData, function (value, key) {

                    angular.forEach(value.children, function (iValue, iKey) {
                      $scope.applications.push({
                                                 application: iValue.label,
                                                 system: value.label,
                                                 ticked: false
                                               });
                      dbgKey = iValue.label + '-' + value.label;
                      $scope.appNamesObj[dbgKey] = iValue.children;

                      angular.forEach(iValue.children, function (jValue, jKey) {
                        $scope.dashboardGroupsObj.push({
                                                         subjectArea: jValue.label,
                                                         application: iValue.label,
                                                         system: value.label,
                                                         ticked: false
                                                       })
                        dashboardKey = jValue.label + '-' + iValue.label + '-' + value.label;
                        $scope.dashboardNamesObj[dashboardKey] = jValue.children;

                      });

                    });
                  });

                }

                $scope.getDashboardGroups();

                $scope.dbGroupClose = function () {
				
                  $scope.selectedDashboardNames = [];
                  var tempDashboards = [];
                  var j = '';
					
                  $scope.dashboardsFromSelectedGroups = [];
                  var tempJsonObj = {};
                  angular.forEach($scope.selectedDashboardGroups, function (dashboardValue, key) {
                    tempJsonObj = {
                      dbName: '<strong>' + dashboardValue.subjectArea + '</strong>',
                      msGroup: true
                    };
                    //tempJsonObj[spaceKey] = 0;
                    $scope.dashboardsFromSelectedGroups.push(tempJsonObj); //DB Group

                    tempDashboards = $scope.dashboardNamesObj[dashboardValue.subjectArea + '-' + dashboardValue.application + '-' + dashboardValue.system];
                    angular.forEach(tempDashboards, function (dbValue, dbKey) {
                      tempJsonObj = {
                        system: dashboardValue.system,
                        application: dashboardValue.application,
                        subjectArea: dashboardValue.subjectArea,
                        dbName: dbValue.label,
                        ticked: false
                      };
                      //tempJsonObj[spaceKey] = 2;
                      $scope.dashboardsFromSelectedGroups.push(tempJsonObj); //All DBs under the DB Group
                    });

                    $scope.dashboardsFromSelectedGroups.push({
                                                               msGroup: false
                                                             });

                  });
		console.log($scope.dashboardsFromSelectedGroups);			//$scope.table();
                }
                /*****/
                $scope.DBGFromSelectedApps = [];
                $scope.appClose = function () {


                  $scope.CheckedApps = $scope.selectedApplications;
                  var tempApplications = [];
                  var j = '';

                  $scope.DBGFromSelectedApps = [];
                  var tempJsonObj = {};
                  angular.forEach($scope.selectedApplications, function (DBGValue, key) {
                    tempJsonObj = {
                      subjectArea: '<strong>' + DBGValue.application + '</strong>',
                      msGroup: true
                    };

                    //tempJsonObj[spaceKey] = 0;
                    $scope.DBGFromSelectedApps.push(tempJsonObj); //DB Group

                    tempApplications = $scope.appNamesObj[DBGValue.application + '-' + DBGValue.system];
                    angular.forEach(tempApplications, function (dbgroupValue, dbKey) {
                      tempJsonObj = {
                        system: DBGValue.system,
                        application: DBGValue.application,
                        subjectArea: dbgroupValue.label,
                        ticked: false
                      };
                      //tempJsonObj[spaceKey] = 2;
                      $scope.DBGFromSelectedApps.push(tempJsonObj); //All DBs under the DB Group
                    });

                    $scope.DBGFromSelectedApps.push({
                                                      msGroup: false
                                                    });

                  });
		console.log($scope.DBGFromSelectedApps);		//$scope.table();    
                }
                $scope.pgFromSelectedDbs = [];
                $scope.dbClose = function () {
                  $scope.selectedDashboardNames = [];
                  var tempDbPg = [];
                  var j = '';

                  $scope.pgFromSelectedDbs = [];
                  var tempJsonObj_pg = {};
                  angular.forEach($scope.selectedDashboards, function (dashboardValue, key) {

                    $rootScope.query = {
                      "size": 0,
                      "query": {
                        "bool": {
                          "must": [{
                            "match": {
                              "repository_name": dashboardValue.system
                            }
                          }, {
                            "match": {
                              "application": dashboardValue.application
                            }
                          }, {
                            "match": {
                              "subjectarea_name": dashboardValue.subjectArea
                            }
                          }, {
                            "match": {
                              "repositories.applications.subject-areas.dashboards._dbname": dashboardValue.dbName
                            }
                          }]
                        }
                      },
                      "aggs": {
                        "dashboard_names": {
                          "terms": {
                            "field": "repositories.applications.subject-areas.dashboards.dashboard_pages._pgname",
                              "size":0
                          }
                        }
                      }
                    }
					console.log(JSON.stringify($rootScope.query));
                    var dataPages = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    dataPages = JSON.parse(dataPages);
					console.log("Query Result "+dataPages);
                    var dbPages = [];
                    for (var i = 0; i < dataPages.aggregations.dashboard_names.buckets.length; i++) {
                      dbPages[i] = dataPages.aggregations.dashboard_names.buckets[i].key;
                    }

                    tempDbPg = dbPages; //For every dashboard an array of pages stored in the JSON

                    tempJsonObj_pg = {
                      pgName: '<strong>' + dashboardValue.dbName + '</strong>',
                      msGroup: true
                    };
                    //tempJsonObj[spaceKey] = 0;
                    $scope.pgFromSelectedDbs.push(tempJsonObj_pg); //DB Group

                    for (var i = 0; i < tempDbPg.length; i++) {
                      tempJsonObj_pg = {
                        system: dashboardValue.system,
                        application: dashboardValue.application,
                        subjectArea: dashboardValue.subjectArea,
                        dbName: dashboardValue.dbName,
                        pgName: tempDbPg[i],
                        ticked: false
                      };
                      $scope.pgFromSelectedDbs.push(tempJsonObj_pg); //All DBs under the DB Group

                    }
                    $scope.pgFromSelectedDbs.push({
                                                    msGroup: false
                                                  });

                  });
				  //$scope.table();
                }
                /****/
                $scope.renderChart = function () {
				  //$scope.table();
				  //console.log("Check if this works");     
                  $scope.disableRender = true;

                  if ($scope.chartType == 'application') {
                    if ($scope.selectedApplications.length == 0) {
                      alert('Please select an application');
                      $scope.disableRender = false;
                      return;
                    }
                    $scope.fetchApplicationData();
                  } else if ($scope.chartType == 'dashboard') {
                    if ($scope.selectedDashboards.length == 0) {
                      alert('Please select a dashboard');
                      $scope.disableRender = false;
                      return;
                    }
                    $scope.fetchDashboardData();
                  } else if ($scope.chartType == 'dashboardGroup') {

                    if ($scope.selectedDashboardGroups.length == 0) {
                      alert('Please select a dashboard group');
                      $scope.disableRender = false;
                      return;
                    }
                    $scope.fetchDashboardGroupData();
                  }
                  /******/
                  else if ($scope.chartType == 'page') {

                    if ($scope.selectedDashboardGroups.length == 0) {
                      alert('Please select a dashboard group');
                      $scope.disableRender = false;
                      return;
                    }
                    $scope.fetchDashboardPage();

                  }
                  $scope.disableRender = false;
                }

                $scope.fetchApplicationData = function () {

                  var dashboardGropupsChartData = [];
                  $scope.Chart8_FinalData = [];
                  angular.forEach($scope.selectedApplications, function (value, key) {

                    $scope.SpecificDashboardPageData_DashboardHits = [];
                    $scope.SpecificDashboardPageData_UserCount = [];


                    var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
                    query8A = JSON.parse(query8A);
                    $rootScope.query = query8A;
                    var data8A = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8A = JSON.parse(data8A);

                    for (var i = 0; i < data8A.aggregations.group_by_dbname.buckets.length; i++) {
                      var date8A = moment(data8A.aggregations.group_by_dbname.buckets[i].key_as_string,
                                          "YYYY-M-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                      $scope.SpecificDashboardPageData_DashboardHits.push(
                        [dateFormat, data8A.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.application + " Usage",
                                                   data: $scope.SpecificDashboardPageData_DashboardHits,

                                                 });

                    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
                    query8B = JSON.parse(query8B);
                    $rootScope.query = query8B;
                    var data8B = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8B = JSON.parse(data8B);

                    for (var i = 0; i < data8B.aggregations.group_by_dbname.buckets.length; i++) {

                      var date1 = moment(data8B.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var date = Date.UTC(date1[0], month, date1[2]);

                      $scope.SpecificDashboardPageData_UserCount.push(
                        [date, data8B.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.buckets.length]);

                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.application + " User Count",
                                                   data: $scope.SpecificDashboardPageData_UserCount

                                                 });

                  });
                  $scope.drawChart($scope.Chart8_FinalData);

                }

                $scope.fetchDashboardGroupData = function () {

                  var dashboardGropupsChartData = [];
                  $scope.Chart8_FinalData = [];
                  angular.forEach($scope.selectedDashboardGroups, function (value, key) {

                    $scope.SpecificDashboardPageData_DashboardHits = [];
                    $scope.SpecificDashboardPageData_UserCount = [];


                    var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
                    query8A = JSON.parse(query8A);
                    $rootScope.query = query8A;
                    var data8A = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8A = JSON.parse(data8A);

                    for (var i = 0; i < data8A.aggregations.group_by_dbname.buckets.length; i++) {
                      var date8A = moment(data8A.aggregations.group_by_dbname.buckets[i].key_as_string,
                                          "YYYY-M-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                      $scope.SpecificDashboardPageData_DashboardHits.push(
                        [dateFormat, data8A.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.subjectArea + " Usage",
                                                   data: $scope.SpecificDashboardPageData_DashboardHits,

                                                 });

                    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
                    query8B = JSON.parse(query8B);
                    $rootScope.query = query8B;
                    var data8B = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8B = JSON.parse(data8B);

                    for (var i = 0; i < data8B.aggregations.group_by_dbname.buckets.length; i++) {

                      var date1 = moment(data8B.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var date = Date.UTC(date1[0], month, date1[2]);

                      $scope.SpecificDashboardPageData_UserCount.push(
                        [date, data8B.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.buckets.length]);

                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.subjectArea + " User Count",
                                                   data: $scope.SpecificDashboardPageData_UserCount

                                                 });

                  });
                  $scope.drawChart($scope.Chart8_FinalData);
                }


                $scope.fetchDashboardData = function () {

                  var dashboardGropupsChartData = [];
                  $scope.Chart8_FinalData = [];
                  angular.forEach($scope.selectedDashboards, function (value, key) {

                    $scope.SpecificDashboardPageData_DashboardHits = [];
                    $scope.SpecificDashboardPageData_UserCount = [];


                    var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}},{"match": {"repositories.applications.subject-areas.dashboards._dbname":' + '"' + value.dbName + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
                    query8A = JSON.parse(query8A);
                    $rootScope.query = query8A;
                    var data8A = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8A = JSON.parse(data8A);

                    for (var i = 0; i < data8A.aggregations.group_by_dbname.buckets.length; i++) {
                      var date8A = moment(data8A.aggregations.group_by_dbname.buckets[i].key_as_string,
                                          "YYYY-M-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                      $scope.SpecificDashboardPageData_DashboardHits.push(
                        [dateFormat, data8A.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.dbName + " Usage",
                                                   data: $scope.SpecificDashboardPageData_DashboardHits,

                                                 });

                    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}},{"match": {"repositories.applications.subject-areas.dashboards._dbname":' + '"' + value.dbName + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
                    query8B = JSON.parse(query8B);
                    $rootScope.query = query8B;
                    var data8B = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8B = JSON.parse(data8B);

                    for (var i = 0; i < data8B.aggregations.group_by_dbname.buckets.length; i++) {

                      var date1 = moment(data8B.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var date = Date.UTC(date1[0], month, date1[2]);

                      $scope.SpecificDashboardPageData_UserCount.push(
                        [date, data8B.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.buckets.length]);

                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.dbName + " User Count",
                                                   data: $scope.SpecificDashboardPageData_UserCount

                                                 });

                  });
                  $scope.drawChart($scope.Chart8_FinalData);
                }

                $scope.fetchDashboardPage = function () {

                  var dashboardGropupsChartData = [];
                  $scope.Chart8_FinalData = [];
                  angular.forEach($scope.selectedPages, function (value, key) {

                    $scope.SpecificDashboardPageData_DashboardHits = [];
                    $scope.SpecificDashboardPageData_UserCount = [];


                    var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}},{"match": {"repositories.applications.subject-areas.dashboards._dbname":' + '"' + value.dbName + '"' + '}},{"match": {"_pgname":' + '"' + value.pgName + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_pgcount"}}}}}}';
                    query8A = JSON.parse(query8A);
                    $rootScope.query = query8A;
                    var data8A = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8A = JSON.parse(data8A);

                    for (var i = 0; i < data8A.aggregations.group_by_dbname.buckets.length; i++) {
                      var date8A = moment(data8A.aggregations.group_by_dbname.buckets[i].key_as_string,
                                          "YYYY-M-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                      $scope.SpecificDashboardPageData_DashboardHits.push(
                        [dateFormat, data8A.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.pgName + " Usage",
                                                   data: $scope.SpecificDashboardPageData_DashboardHits,

                                                 });

                    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":' + '"' + value.subjectArea + '"' + '}},{"match": {"repository_name":' + '"' + value.system + '"' + '}},{"match": {"application":' + '"' + value.application + '"' + '}},{"match": {"repositories.applications.subject-areas.dashboards._dbname":' + '"' + value.dbName + '"' + '}},{"match": {"_pgname":' + '"' + value.pgName + '"' + '}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
                    query8B = JSON.parse(query8B);
                    $rootScope.query = query8B;
                    var data8B = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                    data8B = JSON.parse(data8B);

                    for (var i = 0; i < data8B.aggregations.group_by_dbname.buckets.length; i++) {

                      var date1 = moment(data8B.aggregations.group_by_dbname.buckets[i].key_as_string,
                                         "YYYY-M-DD").format("YYYY,M,DD");
                      date1 = date1.split(',');
                      var month = date1[1] - 1;
                      var date = Date.UTC(date1[0], month, date1[2]);

                      $scope.SpecificDashboardPageData_UserCount.push(
                        [date, data8B.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.buckets.length]);

                    }

                    $scope.Chart8_FinalData.push({
                                                   name: value.pgName + " User Count",
                                                   data: $scope.SpecificDashboardPageData_UserCount

                                                 });

                  });
                  $scope.drawChart($scope.Chart8_FinalData);
                }

                $scope.drawChart = function (chartData) {

                  angular
                    .element('#dbGroupChart')
                    .highcharts({
                                  chart: {
                                    zoomType: 'x'

                                  },

                                  title: {
                                    text: 'Comparative Asset Analysis'
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
                                      text: '# of Dashboard Hits / # of Users'
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
                                  series: chartData

                                });

                };

                $scope.table = function () {
                  
				  var matchAppObjs = [];
				  $scope.Table_SelectedApplications = "";
                  var counter = 1;
                  if($scope.chartType == "application"){
				  
				  angular.forEach($scope.selectedApplications, function (DBGValue, key) {
                    matchAppObjs.push({"match": {"application": DBGValue.application}});
                      if(counter === $scope.selectedApplications.length){
                          $scope.Table_SelectedApplications += DBGValue.application + " ";
                      }
                      else{
                          $scope.Table_SelectedApplications += DBGValue.application + ", ";
                          counter++;
                      }
                  });
				}
				
				if($scope.chartType == "dashboardGroup"){
				  $scope.Table_SelectedApplications = "";
                  $scope.Table_SelectedDB_Groups = "";    
				  var counter = 1;
				  angular.forEach($scope.selectedDashboardGroups, function (DBGValue, key) {
                    matchAppObjs.push({"bool" : {"must" : [{ "match" : {"application" : DBGValue.application}}, { "match" : {"subjectarea_name" : DBGValue.subjectArea}}]}});
                    if(counter === $scope.selectedDashboardGroups.length){
                          $scope.Table_SelectedDB_Groups += DBGValue.application + "/" + DBGValue.subjectArea + " ";
                      }
                      else{
                          $scope.Table_SelectedDB_Groups += DBGValue.application + "/" + DBGValue.subjectArea + ", ";
                          counter++;
                      }
                      
				});
				}
				
				if($scope.chartType == "dashboard"){
				  $scope.Table_SelectedDBs = "";
                  $scope.Table_SelectedApplications = "";
                  $scope.Table_SelectedDB_Groups = "";  
                  var counter = 1;
				  angular.forEach($scope.selectedDashboards, function (DBGValue, key) {
                    matchAppObjs.push(
					{ 
					"bool" : 
						{ 
						"must" : [
							{ "match" : {"application" : DBGValue.application}}, 
							{ "match" : {"subjectarea_name" : DBGValue.subjectArea}},
							{ "match" : {"repositories.applications.subject-areas.dashboards._dbname" : DBGValue.dbName}}
								]
							}
						});
                      if(counter === $scope.selectedDashboards.length){
                          $scope.Table_SelectedDBs += DBGValue.application + "/" +DBGValue.subjectArea + "/" + DBGValue.dbName + " ";
                      }
                      else{
                          $scope.Table_SelectedDBs += DBGValue.application + "/" +DBGValue.subjectArea + "/" + DBGValue.dbName + ", ";
                          counter++;
                      }
					});
				}
				
					
				  $rootScope.query = {"size" : 0,"query": {"bool": {"should": matchAppObjs,"must_not": [ { "term": { "repositories.applications.subject-areas.dashboards._dbname": "NA" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "Welcome" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "SSI-IB" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "1. Welcome" } } ]}},"aggs": {"dashboard_names": {"terms": {"field": "repositories.applications.subject-areas.dashboards._dbname","order": {"result.value":"desc"},"size" : 0},"aggs": {"result": {"sum": {"field": "repositories.applications.subject-areas.dashboards._dbcount"}}}}}};
                  console.log($rootScope.query);
                  var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                  data = JSON.parse(data);
                  $scope.options.tableData = data.aggregations.dashboard_names.buckets;
				
				  $rootScope.query = {"size" : 0,"query": {"bool": {"should": matchAppObjs,"must_not": [ { "term": { "repositories.applications.subject-areas.dashboards._dbname": "NA" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "Welcome" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "SSI-IB" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "1. Welcome" } } ]}},"aggs": {"dashboard_names": {"terms": {"field": "repositories.applications.subject-areas.dashboards._dbname","order": {"result.value":"asc"},"size" : 0},"aggs": {"result": {"sum": {"field": "repositories.applications.subject-areas.dashboards._dbcount"}}}}}};
                  var data_less = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                  data_less = JSON.parse(data_less);
                  $scope.options.tableData_less = data_less.aggregations.dashboard_names.buckets;    
				  
				  $rootScope.query = {"size" : 0,"query": {"bool": {"should": matchAppObjs,"must_not": [ { "term": { "repositories.applications.subject-areas.dashboards._dbname": "NA" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "Welcome" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "SSI-IB" } }, { "term": { "repositories.applications.subject-areas.dashboards._dbname": "1. Welcome" } } ]}},"aggs": {"dashboard_names": {"terms": {"field": "repositories.applications.subject-areas.dashboards.users._name","order": {"result.value":"desc"},"size" : 0},"aggs": {"result": {"sum": {"field": "repositories.applications.subject-areas.dashboards.users._count"}}}}}};
                  var dataUser = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                  dataUser = JSON.parse(dataUser);
                  $scope.options.tableUser = dataUser.aggregations.dashboard_names.buckets;
					
				  //console.log(" QueryResult : ", $scope.options.tableUser);        
                  $scope.options.tableParams.reload();
                  $scope.options.tableParams_desc.reload();
				  $scope.options.UserTable.reload();
                    
				};
				
                $scope.options.tableParams = new ngTableParams({
                  page: 1, // show first page
                  count: 50 // count per page
                }, {
                  total: $scope.options.tableData.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.tableData.length);
                    $defer.resolve($scope.options.tableData.slice((params.page() - 1) * params.count(),
                                                                  params.page() * params.count()));
                  }
                });
				
                $scope.options.tableParams_desc = new ngTableParams({
                  page: 1, // show first page
                  count: 50 // count per page
                }, {
                  total: $scope.options.tableData_less.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.tableData_less.length);
                    $defer.resolve($scope.options.tableData_less.slice((params.page() - 1) * params.count(),
                                                                       params.page() * params.count()));
                  }
                });
			
				$scope.options.UserTable = new ngTableParams({
                  page: 1, // show first page
                  count: 50 // count per page
                }, {
                  total: $scope.options.tableUser.length, // length of data
                  counts: [],
                  getData: function ($defer, params) {
                    params.total($scope.options.tableUser.length);
                    $defer.resolve($scope.options.tableUser.slice((params.page() - 1) * params.count(),
                                                                  params.page() * params.count()));
                  }
                });

              });
