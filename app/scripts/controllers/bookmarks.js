'use strict';
/**
 *
 */
angular.module('powermeApp')

  .controller('bookmarksCtrl',
              function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService,
                        $cookieStore) {

                $scope.page = {
                  title: 'Bookmarks',
                  subtitle: ''
                };
                $scope.bookmarks = [];
                $scope.bookmarksDashboards = [];
                $rootScope.layout="tile";
                /*  $rootScope.query={ "size": 500, "query": {"bool": {"must": [{"match": { "userId": "gvictor"}}]}}};
                 var data= averageRankingService(environment.apiUri+'/powerme/bookmark/_search');
                 data =  JSON.parse(data);*/
                console.log("$rootScope.username==>" + $rootScope.username);
                
                $http
                  .post(environment.apiUri + '/powerme/bookmark/_search',
                  {"size": 500, "query": {"bool": {"must": [{"match": {"userId": $rootScope.currentUser.username}}]}}})
                  .success(function (data) {


                             if (data.hits.hits.length != 0) {
                               $scope.results = data.hits.hits.length;
                               for (var i = 0; i < data.hits.hits.length; i++) {
                                 if (data.hits.hits[i]._source.dashboardPageId != undefined) {

                                   term = "dashboardPage";


                                   $rootScope.query = {"query": {"match_phrase": {"dashboardPageId": data.hits.hits[i]._source.dashboardPageId}}};
                                   var averageRanking = 0;
                                   var totalUsers = 0;
                                   var commentsData = averageRankingService(environment.apiUri + '/powerme/comments/_search');
                                   commentsData = JSON.parse(commentsData);
                                   var commentsDataRanking = [];
                                   if (commentsData.hits.hits.length != 0) {
                                     for (var x = 0; x < commentsData.hits.hits.length; x++) {
                                       if (commentsData.hits.hits[x]._source.message != undefined) {
                                         totalUsers++;
                                         commentsDataRanking = commentsData.hits.hits[x]._source.message.split("||");
                                         if (commentsDataRanking.length > 1) {
                                           averageRanking = averageRanking + parseInt(commentsDataRanking[1]);

                                         }
                                       }

                                     }
                                     averageRanking = averageRanking / totalUsers;
                                   }
                                   $rootScope.query = {
                                     "size": 0,
                                     "query": {
                                       "bool": {
                                         "must": [
                                           {
                                             "match_phrase": {
                                               "_pgname": data.hits.hits[i]._source.bookmarkName
                                             }
                                           }
                                         ]
                                       }
                                     },
                                     "aggs": {
                                       "group_by_state": {
                                         "terms": {
                                           "field": "repositories.applications.subject-areas.dashboards.dashboard_pages._pgname"
                                         },
                                         "aggs": {
                                           "total_count": {
                                             "sum": {
                                               "field": "repositories.applications.subject-areas.dashboards.dashboard_pages._pgcount"
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

                                   $scope.bookmarks.push({
                                     "id": data.hits.hits[i]._id,
                                     "system": data.hits.hits[i]._source.system,
                                     "application": data.hits.hits[i]._source.application,
                                     "dashboardGroupName": data.hits.hits[i]._source.dashboardGroupName,
                                     "dashboard": data.hits.hits[i]._source.dashboard,
                                     "dashboardPageId": data.hits.hits[i]._source.dashboardPageId,
                                     "dashboardPageName": data.hits.hits[i]._source.bookmarkName,
                                     "owner": data.hits.hits[i]._source.owner,
                                     "createdDate":data.hits.hits[i]._source.createdDate,
                                     "averageRanking": averageRanking,
                                     "totalUsers": totalUsers,
                                     "totalCount": totalCount
                                   });
                                   //$scope.bookmarks.push({"id":data.hits.hits[i]._id,"applicationName":bookMarksData.hits.hits[0]._source.subjectArea,"department":bookMarksData.hits.hits[0]._source.department,"dashboard":bookMarksData.hits.hits[0]._source.dashBoard,"reportName":bookMarksData.hits.hits[0]._source.reportName,"owner":bookMarksData.hits.hits[0]._source.owner,"system":bookMarksData.hits.hits[0]._source.system,"usageCount":bookMarksData.hits.hits[0]._source.usageCount,"averageRanking":averageRanking});

                                 }
                                 //console.log($scope.bookmarks);
                                 if (data.hits.hits[i]._source.dashboardId != undefined) {
                                   term = "dashboard";
                                   $rootScope.query = {"query": {"match_phrase": {"dashboardId": data.hits.hits[i]._source.dashboardId}}};
                                   var averageRanking = 0;
                                   var totalUsers = 0;
                                   var commentsData = averageRankingService(environment.apiUri + '/powerme/comments/_search');
                                   commentsData = JSON.parse(commentsData);
                                   var commentsDataRanking = [];
                                   if (commentsData.hits.hits.length != 0) {
                                     for (var x = 0; x < commentsData.hits.hits.length; x++) {
                                       if (commentsData.hits.hits[x]._source.message != undefined) {
                                         totalUsers++;
                                         commentsDataRanking = commentsData.hits.hits[x]._source.message.split("||");
                                         if (commentsDataRanking.length > 1) {
                                           averageRanking = averageRanking + parseInt(commentsDataRanking[1]);

                                         }
                                       }

                                     }
                                     averageRanking = averageRanking / totalUsers;
                                   }
                                   $rootScope.query = {
                                     "size": 0,
                                     "query": {
                                       "bool": {
                                         "must": [
                                           {
                                             "match_phrase": {
                                               "_dbname": data.hits.hits[i]._source.bookmarkName
                                             }
                                           }
                                         ]
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


                                   $scope.bookmarksDashboards.push({
                                     "id": data.hits.hits[i]._id,
                                     "system": data.hits.hits[i]._source.system,
                                     "application": data.hits.hits[i]._source.application,
                                     "dashboardGroupName": data.hits.hits[i]._source.dashboardGroupName,
                                     "dashboard": data.hits.hits[i]._source.bookmarkName,
                                     "dashboardId": data.hits.hits[i]._source.dashboard,
                                     "owner": data.hits.hits[i]._source.owner,
                                     "createdDate":data.hits.hits[i]._source.createdDate,
                                     "averageRanking": averageRanking,
                                     "totalUsers": totalUsers,
                                     "totalCount": totalCount
                                   });


                                 }

                               }
                             }
                           }).error(function () {
                                      console.log("error");
                                    })

                var term = "";


                $scope.bookMarkIt = function (id, type) {
                  console.log(id);
                  $http
                    .delete(environment.apiUri + '/powerme/bookmark/' + id)
                    .success(function (deletedData) {
                               $scope.results = $scope.results - 1;
                               if (type === "dashboardPage") {
                                 $scope.bookmarks = $scope.bookmarks
                                   .filter(function (el) {
                                             return el.id !== id;
                                           });
                               }
                               if (type === "dashboard") {
                                 $scope.bookmarksDashboards = $scope.bookmarksDashboards
                                   .filter(function (el) {
                                             return el.id !== id;
                                           });
                               }


                             })
                    .error(function () {
                             console.log("error");
                           })


                }
                $http
                  .post(
                  environment.apiUri + '/powerme/systems/_search',
                  {
                    "size": 12000,
                    "fields": [
                      "system_name",
                      "applications/sites.application/site_id",
                      "applications/sites.group.dashboard_group_name",
                      "applications/sites.group.dashboards.dashboard_name"]
                  })
                  .success(
                  function (data) {
                    var set = new StringSet();
                    var jsonData = new StringSet();
                    var jsonFormation = "";

                    for (var i = 0; i < data.hits.hits.length; i++) {
                      if (data.hits.hits[i].fields != undefined) {
                        // console.log(data.hits.hits[i].fields["system_name"][0]);
                        set
                          .add(data.hits.hits[i].fields["system_name"][0]); // Adds
                        // all
                        // System
                        // to
                        // set{}
                        // w/o
                        // repitation
                      }

                    }

                    jsonFormation += '{'; // Opening Scope

                    var sysLength = set.values().length; // Count
                                                         // of
                                                         // various
                                                         // Systems
                                                         // types
                    // console.log(set.values());

                    for (var i = 0; i < sysLength; i++) {
                      jsonFormation += '"' + set.values()[i]
                        + '":[ {';
                      jsonData.values == 0;
                      jsonData = new StringSet();
                      // console.log(jsonData.values());
                      for (var j = 0; j < data.hits.hits.length; j++) {
                        if (data.hits.hits[j].fields != undefined) {
                          if (data.hits.hits[j].fields["system_name"][0] == set
                              .values()[i]) // Compares all System
                          // with set
                          // iteratively
                          {
                            jsonData
                              .add(data.hits.hits[j].fields["applications/sites.application/site_id"][0]); // On
                            // match,
                            // adds
                            // Department
                            // per
                            // System

                          }
                        }

                      }

                      var depLength = jsonData.values().length;

                      for (var j = 0; j < depLength; j++) {
                        jsonFormation += '"'
                          + jsonData.values()[j]
                          + '":[ {';
                        var subjectSet = new StringSet();

                        for (var k = 0; k < data.hits.hits.length; k++) {
                          if (data.hits.hits[k].fields != undefined) {

                            if (data.hits.hits[k].fields["applications/sites.application/site_id"][0] == jsonData
                                .values()[j]
                              && data.hits.hits[k].fields["system_name"][0] == set
                                .values()[i]) // Departments
                            // match
                            {

                              subjectSet
                                .add(data.hits.hits[k].fields["applications/sites.group.dashboard_group_name"][0]); // Add
                              // subjectAreas

                            }
                          }

                        }

                        var subjLength = subjectSet.values().length;
                        for (var k = 0; k < subjLength; k++) {
                          jsonFormation += '"'
                            + subjectSet.values()[k]
                            + '":[';
                          var dashBoard = new StringSet();

                          for (var m = 0; m < data.hits.hits.length; m++) {
                            if (data.hits.hits[m].fields != undefined) {

                              if ((data.hits.hits[m].fields["applications/sites.group.dashboard_group_name"][0] == subjectSet
                                  .values()[k])
                                && (data.hits.hits[m].fields["applications/sites.application/site_id"][0] == jsonData
                                  .values()[j])) // &&
                                                 // (data.hits.hits[m].fields.system==set.values()[i]))
                              {

                                dashBoard
                                  .add(data.hits.hits[m].fields["applications/sites.group.dashboards.dashboard_name"][0]
                                         .replace("=\"", "")
                                         .replace("\"", ""));
                              }
                            }

                          }

                          var dashLength = dashBoard.values().length;
                          for (var n = 0; n < dashLength; n++) {
                            jsonFormation += '"'
                              + dashBoard.values()[n]
                              + '"';

                            if (n != (dashLength - 1)) {
                              jsonFormation += ',';
                            }
                          }

                          jsonFormation += "]";
                          if (k != (subjLength - 1)) {
                            jsonFormation += ',';
                          }
                        }

                        jsonFormation += '}]';
                        if (j != (depLength - 1)) {
                          jsonFormation += ',';
                        }
                      }

                      jsonFormation += '}]';
                      if (i != (sysLength - 1)) {
                        jsonFormation += ',';
                      }

                    }

                    jsonFormation += '}';

                    // console.log(jsonFormation);
                    $scope.localCache = JSON.parse(jsonFormation);
                    $rootScope.cache = $scope.localCache;

                  })
                  .error(function () {
                           console.log("error");
                         });
                var StringSet = function () {
                  var setObj = {}, val = {};

                  this.add = function (str) {
                    setObj[str] = val;
                  };

                  this.contains = function (str) {
                    return setObj[str] === val;
                  };

                  this.remove = function (str) {
                    delete setObj[str];
                  };

                  this.values = function () {
                    var values = [];
                    for (var i in setObj) {
                      if (setObj[i] === val) {
                        values.push(i);
                      }
                    }
                    return values;
                  };
                }

                $scope.sortedData = 'dashboard';
                $scope.filterCriteria = "ALL";

                $scope.filterOptions = {
                  system: '',
                  applications: {}
                }

                $scope.getFilterTypes = function () {
                  $scope.filterInfo = [];
                  $scope.isApps = false;

                  if ($scope.filterCriteria == "System") {
                    $scope.isApplications = false;
                    for (var key in  $rootScope.cache) {
                      $scope.filterInfo.push(key);
                    }

                  }
                  else if ($scope.filterCriteria == "Departments") {
                    $scope.isApplications = false;
                    for (var key in  $rootScope.cache) {

                      for (var i = 0; i < $rootScope.cache[key].length; i++) {

                        for (var k in $rootScope.cache[key][i]) {

                          $scope.filterInfo.push(k);
                          $scope.filterOptions.applications[k] = true;
                        }

                      }
                    }

                  }
                  else if ($scope.filterCriteria == "Applications") {
                    $scope.isApplications = true;
                    for (var key in $rootScope.cache) {

                      for (var i = 0; i < $rootScope.cache[key].length; i++) {

                        for (var k in $rootScope.cache[key][i]) {

                          for (var j = 0; j < $rootScope.cache[key][i][k].length; j++) {
                            $scope.filterInfo.push($rootScope.cache[key][i][k][j]);
                          }
                        }

                      }
                    }

                  }
                  else if ($scope.filterCriteria == "ALL") {
                    $scope.filterData = "";
                    $scope.filterOptions.system = '';
                    $scope.filterOptions.applications = {};
                  }
                }

                $scope.filterByCriteria = function (value, index, array) {
                  var result = true;
                  switch ($scope.filterCriteria) {
                    case 'System':
                      result = $scope.filterOptions.system === '' || value.system == $scope.filterOptions.system;
                      break;
                    case 'Departments':
                      result = angular.isDefined($scope.filterOptions.applications[value.application]) && $scope.filterOptions.applications[value.application];
                      break;
                    default :
                      result = true;
                  }
                  return result;
                }

                $scope.getContent = function (type) {

                  $scope.filterData = type;
                }
                $scope.sortBookmarks = function (type) {
                  console.log(type);
                  $scope.sortedData = type;
                }
              });
