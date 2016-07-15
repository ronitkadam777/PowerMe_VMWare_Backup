'use strict';
/**
 *
 */
// JavaScript for Dashboard-Group page
angular.module('powermeApp')
  .controller('systemCtrl', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService) {

    $scope.page = {
      title: $stateParams.system.charAt(0).toUpperCase() + $stateParams.system.slice(1) + ' Details',
      subtitle: $stateParams.system.charAt(0).toUpperCase() + $stateParams.system.slice(1),
      //test: $stateParams.appName
    };
    $scope.reportNames = [];
    $scope.system = $stateParams.system;

    $scope.count = 0;
    $scope.userNames = [];
    $scope.dashboardPageChart_Dates = [];
    $scope.dashboardPageChart_Count = [];
    $scope.applications = [];
    //console.log("SYSTEM "+$scope.system);
    //console.log("APPLICATION "+$scope.applicationName);
    //console.log("DEPARTMENT "+$scope.department);
    //console.log("DASHBOARD NAME "+$stateParams.appName);


    //Daily Report Usage
    $http
      .post(environment.apiUri + '/powerme/usagegraph/_search ', {
        "size": 0,
        "query": {
          "bool": {
            "must": [{
              "match": {
                "system": $scope.system
              }
            }]
          }
        },
        "aggs": {
          "agg1": {
            "terms": {
              "field": "START_DT",
              "order": {
                "_term": "asc"
              },
              "size": 0
            }
          }
        }
      })
      .success(function (data) {
        console.log(data.aggregations.agg1.buckets.length);
        for (var i = 0; i < data.aggregations.agg1.buckets.length; i++) {
          $scope.dashboardPageChart_Dates.push(data.aggregations.agg1.buckets[i].key_as_string);
          $scope.dashboardPageChart_Count.push(data.aggregations.agg1.buckets[i].doc_count);
        }


        angular.element('#DashboardPageUsageChart').highcharts({
          chart: {
            zoomType: 'x'
          },
          title: {
            text: 'Daily Dashboard Usage Statistics'
          },
          subtitle: {
            text: document.ontouchstart === undefined ?
              'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
          },

          xAxis: {
            type: 'datetime',
            categories: $scope.dashboardPageChart_Dates
          },
          yAxis: {
            title: {
              text: 'Usage'
            },
            min: 0,
            labels: {
              formatter: function () {
                return this.value;
              }
            }
          },

          legend: {
            enabled: false
          },
          plotOptions: {
            area: {
              fillColor: {

              },

              marker: {
                radius: 2
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1
                }
              },
              threshold: null
            }
          },
          series: [{
            type: 'area',
            name: 'Dashboard Usage',
            data: $scope.dashboardPageChart_Count
            }]
        }); //Graph Endpoint
      }) //Sucess Endpoint



    $http
      .post(environment.apiUri + '/powerme/usagegraph/_search', {
        "size": 0,
        "query": {
          "bool": {
            "must": [{
              "match": {
                "system": $stateParams.system
              }
            }]
          }
        },
        "aggs": {
          "users": {
            "terms": {
              "field": "USER_NAME",
              "size": 5
            }
          }
        }
      })
      .success(function (data) {

        if (data.aggregations.users.buckets.length != 0) {
          for (var i = 0; i < data.aggregations.users.buckets.length; i++) {
            $scope.userNames.push(data.aggregations.users.buckets[i].key);
          }

        }

      })
      .error(function () {
        console.log("error");
      })

    for (var key in $rootScope.rootCache) {

      if (key === $stateParams.system) {

        for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

          for (var k in $rootScope.rootCache[key][i]) {

            $scope.applications.push(k);
          }
        }
      }
    }

  })
  .controller('applicationsCtrl', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService) {

    $scope.page = {
      title: $stateParams.system.charAt(0).toUpperCase() + $stateParams.system.slice(1) + ' Details',
      subtitle: $stateParams.application.charAt(0).toUpperCase() + $stateParams.application.slice(1),
      //test: $stateParams.appName
    };
    $scope.params = {

      system: $stateParams.system,
      application: $stateParams.application

    };

    $scope.subjectAreas = [];


    for (var key in $rootScope.rootCache) {

      if (key === $stateParams.system) {

        for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

          for (var k in $rootScope.rootCache[key][i]) {
            if (k === $stateParams.application) {
              for (var j = 0; j < $scope.rootCache[key][i][k].length; j++) {
                for (var x in $scope.rootCache[key][i][k][j]) {


                  $scope.subjectAreas.push(x);
                }
              }
            }

          }
        }
      }
    }

  })
  .controller('authenticateCtrl', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService, $cookieStore) {

    $scope.login = function () {

      $rootScope.userError = "";
      var encrypted = window.btoa($scope.user.password);
      $http
        .post(environment.authenticationUrl + '/Authenticate/' + $scope.user.email, {pwd:encrypted})
        .success(function (data) {
          if (!angular.isUndefined(data)) {
            $rootScope.currentUser = {
              fullname: data.cn,
              username: $scope.user.email,
              user_email: data.mail
            }
            $rootScope.username = $scope.user.email;
            $http.get(environment.apiUri + '/powerme/user/' + $scope.user.email)
              .success(function (user) {
                $rootScope.currentUser.role = angular.isArray(user._source.roles) ? user._source.roles[0] : user._source.roles;
                $rootScope.currentUser.add_desc = user._source.add_desc;
                $rootScope.currentUser.remove_desc = user._source.remove_desc;
              })
              .error(function (error) {
                if (!error.found) {
                  $http.post(environment.apiUri + '/powerme/user', {
                    user_name: $scope.user.email,
                    roles: 'CONSUMER',
                    add_desc:false,
                    remove_desc:false
                  }).success(function (data) {
                    console.log('Result for user post : ', data);
                  }).error(function (error) {
                    console.log('Error while user persona : ', error);
                  });
                }
                $rootScope.currentUser.role = 'CONSUMER';
                $rootScope.currentUser.add_desc = false;
                $rootScope.currentUser.remove_desc = false;

              }).finally(function () {
                $cookieStore.put('currentUser', $rootScope.currentUser);
               if($rootScope.currentUser.role=='CONSUMER'){
                	$state.go("app.dashboardConsumer");
                }else{
                	$state.go("app.dashboard");
                }
              });

          } else {
            $rootScope.username = "";
            $rootScope.userError = "NA";
            $scope.user.email = "";
            $scope.user.password = "";
            $state.go("core.login");
          }
        }).error(function () {
          console.log("error");
        })
    }

  })
  .controller('checkAuthentication', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService, $cookieStore) {
    if (angular.isUndefined($rootScope.currentUser)) {
     if (!angular.isUndefined($cookieStore.get('currentUser'))) {
       //console.log("$cookieStore.get('currentUser')==>", $cookieStore.get('currentUser'));
       $rootScope.currentUser = $cookieStore.get('currentUser');
       $rootScope.username = $rootScope.currentUser.username;
     } else {
       $state.go("core.login");
     }
    }
  })
  .controller('logout', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService, $cookieStore) {
    $scope.logout = function () {
      $cookieStore.remove('currentUser');
      
      //$state.go("core.login");
      $window.location.href = environment.vidmLogoutURI;
    }
  })
  .controller('subjectareasCtrl', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService) {




	$scope.SpecificDashboardPageData_DashboardHits = [];
	$scope.SpecificDashboardPageData_UserCount = [];
	$scope.Chart8_FinalData = [];
	var app = angular.element('#minovate');

	var query8A = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":'+'"'+$stateParams.subjectArea+'"'+'}},{"match": {"repository_name":'+'"'+$stateParams.system+'"'+'}},{"match": {"application":'+'"'+$stateParams.application+'"'+'}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"sum": {"field": "_dbcount"}}}}}}';
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

    var query8B = '{"size": 0,"query": {"bool": {"must": [{"match": {"subjectarea_name":'+'"'+$stateParams.subjectArea+'"'+'}},{"match": {"repository_name":'+'"'+$stateParams.system+'"'+'}},{"match": {"application":'+'"'+$stateParams.application+'"'+'}}]}},"aggs": {"group_by_dbname": {"date_histogram": {"field": "date","interval": "week"},"aggs": {"sum_of_dbcount": {"terms": {"field": "_name","size":0}}}}}}';
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


    angular
        .element('#DashboardGroupChart')
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

	    $scope.sortedData = 'dashboard';

                $scope.changeSort = function (sortType) {
                  if  ($scope.sortedData === sortType) {
                    $scope.sortedData = '-' + sortType;
                  } else {
                    $scope.sortedData = sortType;
                  }
                }

    $scope.page = {
      title: $stateParams.subjectArea.charAt(0).toUpperCase() + $stateParams.subjectArea.slice(1) + ' Details'

      //test: $stateParams.appName
    };
    $scope.params = {

      system: $stateParams.system,
      application: $stateParams.application,
      subjectarea: $stateParams.subjectArea
    };

    //TOP 10 FREQUENT USERS FOR DASHBOARD-GROUP PAGE
      $scope.FrequentUserNames = [];
	  $scope.FrequentUserUsageCount = [];
	  $rootScope.query = {
		      "size": 0,
		      "query": {
		        "bool": {
		          "must": [

		            {"match": {"repository_name": $stateParams.system}},
		            {"match": {"application": $stateParams.application}},
		            {"match": {"subjectarea_name": $stateParams.subjectArea}}
		          ]
		        }
		      },
		      "aggs": {
		        "dashboard_names": {
		          "terms": {
		            "field": "repositories.applications.subject-areas.dashboards.users._name",
		            "order": {
		              "result.value": "desc"
		            },
		            "size": 10
		          },
		          "aggs": {
		            "result": {
		              "sum": {
		                "field": "repositories.applications.subject-areas.dashboards.users._count"
		              }
		            }
		          }
		        }
		      }
		     };
    console.log("QUERY FAULTY: "+$rootScope.query);
    var data = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
    data = JSON.parse(data);
    for (var i = 0; i < data.aggregations.dashboard_names.buckets.length; i++) {
        $scope.FrequentUserNames.push(data.aggregations.dashboard_names.buckets[i].key);
        $scope.FrequentUserUsageCount.push(
          data.aggregations.dashboard_names.buckets[i].result.value);
      }


    $scope.dashboards = [];

    /*console.log("$state
    Params.system"+$stateParams.system);
    console.log("$stateParams.application"+$stateParams.application);
    console.log("$stateParams.subjectArea"+$stateParams.subjectArea);*/

    $rootScope.query = {
      "size": 20,
      "query": {
        "bool": {
          "must": [{
            "match_phrase": {
              "applications/sites.group.dashboard_group_name": $stateParams.subjectArea
            }
          }, {
            "match": {
              "applications/sites.application/site_id": $stateParams.application
            }
          }, {
            "match": {
              "system_name": $stateParams.system
            }
          }]
        }
      }
    };
    //console.log(JSON.stringify($rootScope.query));
    var data = averageRankingService(environment.apiUri + '/powerme/systems/_search');
    data = JSON.parse(data);
    //console.log(data);
    //console.log(data.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id);
    for (var k = 0; k < data.hits.hits.length; k++) {
      var averageRanking = 0;
      var totalUsers = 0;

      //AVERAGE RANKING
      if ($stateParams.system == "TABLEAU") {
        $rootScope.query = {
          "size": 20,
          "query": {
            "bool": {
              "must": [{
                "match_phrase": {
                  "dashboardId": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                }
              }]
            }
          }
        };
        var commentsData = averageRankingService(environment.apiUri + '/powerme/comments/_search');
        commentsData = JSON.parse(commentsData);
        var commentsDataRanking = [];
        if (commentsData.hits.hits.length != 0) {
          for (var i = 0; i < commentsData.hits.hits.length; i++) {
            if (commentsData.hits.hits[i]._source.message != undefined) {
              totalUsers++;
              commentsDataRanking = commentsData.hits.hits[i]._source.message.split("||");
              if (commentsDataRanking.length > 1) {
                averageRanking = averageRanking + parseInt(commentsDataRanking[1]);

              }
            }

          }

          averageRanking = averageRanking / (totalUsers);

        }

        //USAGE COUNT
// Chnages made my Kabir in application line of query
        $rootScope.query = {
          "size": 0,
          "query": {
            "bool": {
              "must": [{
                "match": {
                  "_dbname": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name
                }
              }, {
                "match": {
                  "repository_name": $stateParams.system
                }
              }, {
                "match": {
                  "application": $stateParams.application
                }
              }, {
                "match": {
                  "subjectarea_name": $stateParams.subjectArea
                }
              }]
            }
          },
          "aggs": {
            "group_by_state": {
              "terms": {
                "field": "repositories.applications.subject-areas.dashboards._dbname"
              },
              "aggs": {
                "total_count": {
                  "sum": {
                    "field": "repositories.applications.subject-areas.dashboards._dbcount"
                  }
                }
              }
            }
          }
        };
        var totalCount = 0;

        var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
        usageData = JSON.parse(usageData);

        if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
          totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
        }

        $scope.dashboards.push({
          "system": $stateParams.system,
          "application": $stateParams.application,
          "dashboardGroupName": $stateParams.subjectArea,
          "dashboard": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name.replace("=\"", "").replace("\"", ""),
          "owner": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_owner_friendly_name,
          "dashboardId": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
          "averageRanking": averageRanking,
          "totalUsers": totalUsers,
          "totalCount": totalCount
        })
      } else {

        //AVERAGE RANKING
        $rootScope.query = {
          "size": 20,
          "query": {
            "bool": {
              "must": [{
                "match_phrase": {
                  "dashboardId": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                }
              }]
            }
          }
        };
        var commentsData = averageRankingService(environment.apiUri + '/powerme/comments/_search');
        commentsData = JSON.parse(commentsData);
        var commentsDataRanking = [];
        if (commentsData.hits.hits.length != 0) {
          for (var i = 0; i < commentsData.hits.hits.length; i++) {
            if (commentsData.hits.hits[i]._source.message != undefined) {
              totalUsers++;
              commentsDataRanking = commentsData.hits.hits[i]._source.message.split("||");
              if (commentsDataRanking.length > 1) {
                averageRanking = averageRanking + parseInt(commentsDataRanking[1]);
              }
            }
          }
          averageRanking = averageRanking / (totalUsers);
        }

        //USAGE COUNT
        $rootScope.query = {
          "size": 0,
          "query": {
            "bool": {
              "must": [{
                "match": {
                  "_dbname": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name
                }
              }, {
                "match": {
                  "repository_name": $stateParams.system
                }
              }, {
                "match": {
                  "application": $stateParams.application
                }
              }, {
                "match": {
                  "subjectarea_name": $stateParams.subjectArea
                }
              }]
            }
          },
          "aggs": {
            "group_by_state": {
              "terms": {
                "field": "repositories.applications.subject-areas.dashboards._dbname"
              },
              "aggs": {
                "total_count": {
                  "sum": {
                    "field": "repositories.applications.subject-areas.dashboards._dbcount"
                  }
                }
              }
            }
          }
        };
        var totalCount = 0;
        //console.log("-----" + k);
        //console.log("_dbame " + data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name);
        //console.log("repository_name " + $stateParams.system);
        //console.log("application " + $stateParams.application);
        //console.log("subjectarea_name " + $stateParams.subjectArea);

        var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
        usageData = JSON.parse(usageData);
        if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
          totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
        }
        $scope.dashboards.push({
          "system": $stateParams.system,
          "application": $stateParams.application,
          "dashboardGroupName": $stateParams.subjectArea,
          "dashboard": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name.replace("=\"", "").replace("\"", ""),
          "owner": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_owner_friendly_name,
          "dashboardId": data.hits.hits[k]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
          "averageRanking": averageRanking,
          "totalUsers": totalUsers,
          "totalCount": totalCount
        })
      }
    }
  });
