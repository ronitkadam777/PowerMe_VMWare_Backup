'use strict';
/**
 *
 */
angular.module('powermeApp')

  .controller('searchitemsCtrl',
              ['$scope', '$http', '$stateParams', '$state', '$rootScope', 'averageRankingService', '$filter',
               function ($scope, $http, $stateParams, $state, $rootScope, averageRankingService, $filter) {
                 $scope.page = {
                   title: 'Search Items',
                   subtitle: ''

                 };
                 //changes made by shalini 11/16/2015 regarding exact and normaal search using checkbox.
                 //changes made by Ronit on 3/25/2016 regarding Search on Tag.
                 $scope.selected_type = "";
                     //var $scope.matchPercent = '100%';
                 $scope.matchPercent = '100%';
                 $rootScope.layout = "tile";
                 $scope.searchItems = function (keyEvent) {

                   if (keyEvent.which === 13) {

                     //console.log($scope.searchItem);
                     $rootScope.isDashBoardDataLoading = true;
                     $rootScope.isDashboardData = false;
                     $rootScope.isDashBoardPageDataLoading = true;
                     $rootScope.isDashboardPageData = false;
                     $rootScope.isReportDataLoading = true;
                     $rootScope.isReportData = false;
                     $rootScope.reportDetails = [];

		     ////console.log("Select Type is "+$scope.selected_type);
		     if ($scope.selected_type==true)
			{ 
				$scope.matchPercent = '100%';
				//console.log("Made 100");
			} 
			else 
			{ 
				$scope.matchPercent= '10%'; 
				//console.log("Made Fifty");
			}

			//console.log("1st Search Type is "+$scope.matchPercent);
                     $http
                       .post(environment.apiUri + '/powerme/systems/_search ', {
                         "size": 5000,
                         "query": {
                           "multi_match": {
                             "query": $scope.searchItem,
                             "type": "most_fields",
                             "fields": ["applications/sites.group.dashboards.dashboard_name",
                                        "applications/sites.group.dashboards.dashboard_path",
                                        "applications/sites.group.dashboards.description",
                                        "applications/sites.group.subjectarea_name"],
                             "minimum_should_match": $scope.matchPercent
                           }
                         }
                       })
                       .success(function (data) {
                         $rootScope.query = {
                           "query": {
                             "bool": {
                               "should": [
                                 {
                                   "multi_match": {
                                     "query": $scope.searchItem,
                                     "type": "most_fields",
                                     "fields": [
                                       "dashboard_name",
                                       "dashboard_id"
                                     ],
                                     "minimum_should_match": $scope.matchPercent
                                   }
                                 },
                                 {
                                   "nested": {
                                     "path": "descriptions",
                                     "query": {
                                       "match_phrase": {
                                         "text": $scope.searchItem
                                       }
                                     }
                                   }
                                 }
                               ]
                             }

                           }
                         }
                         var dashboardDescData = averageRankingService(
                           environment.apiUri + '/powerme/dashboard_desc/_search');
                         dashboardDescData = JSON.parse(dashboardDescData);
                         var dbnames = [];
                         if (dashboardDescData.hits.total > 0) {
                           angular.forEach(dashboardDescData.hits.hits, function (desc) {
                             if ($filter('filter')(data.hits.hits, function (v, i, a) {
                                 return v._source["applications/sites"][0].group[0].dashboards[0].dashboard_id == desc._source.dashboard_id;
                               }).length <= 0) {
                               dbnames.push({
                                              "match_phrase": {
                                                "applications/sites.group.dashboards.dashboard_id": desc._source.dashboard_id
                                              }
                                            });
                             }
                           });
                         }
                         //console.log("Missing Dashboards : ", dbnames);

                         if (dbnames.length > 0) {
                           $rootScope.query = {
                             "query": {
                               "bool": {
                                 "should": dbnames
                               }
                             }
                           }
                           var dashboardDescData = averageRankingService(
                             environment.apiUri + '/powerme/systems/_search');
                           dashboardDescData = JSON.parse(dashboardDescData);

                           if (dashboardDescData.hits.total > 0 && data.hits.hits) {
                             data.hits.hits = data.hits.hits.concat(dashboardDescData.hits.hits);
                           }
                         }

                         $rootScope.dashBoardResults = data.hits.hits.length;
                         $rootScope.dashBoardDetails = [];
                         //$rootScope.dashboardPageInfo = [];
                         $rootScope.stagingDetails = [];
                         if (data.hits.hits.length != 0) {
                           for (var i = 0; i < data.hits.hits.length; i++) {

                             $rootScope.query = {"query": {"match_phrase": {"dashboardId": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id}}};

                             var averageRanking = 0;
                             var totalUsers = 0;
                             var commentsData = averageRankingService(
                               environment.apiUri + '/powerme/comments/_search');

                             ////console.log("Dashboard DB ID " + data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id);

                             commentsData = JSON.parse(commentsData);
                             var commentsDataRanking = [];

                             ////console.log("Comment Length" + commentsData.hits.hits.length);
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
                               //console.log("Average Rank" + averageRanking);
                             }

                             // kabir added these console.log("DB Name:"+data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name);
//                                           //console.log("DB Grp Name"+data.hits.hits[i]._source["applications/sites"][0]["application/site_id"]);
//                                                                                   //console.log("DB Grp Name"+data.hits.hits[i]._source["applications/sites"][0].group[0].dashboard_group_name);
//                                                                                                                           //console.log("SA is"+data.hits.hits[i]._source["applications/sites"][0].group[0].subjectarea_name);
                             //
//                                                                                                                                   // Below line added by Kabir add code for Application and Dashbpard group
                             //
                             //
                             $rootScope.query = {
                               "size": 0,
                               "query": {
                                 "bool": {
                                   "must": [
                                     {"match": {"application": data.hits.hits[i]._source["applications/sites"][0]["application/site_id"]}},
                                     {"match": {"subjectarea_name": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboard_group_name}},
                                     {
                                       "match_phrase": {
                                         "_dbname": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name.replace(
                                           "=\"",
                                           "").replace("\"",
                                                       "")
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
                             var usageData = averageRankingService(
                               environment.apiUri + '/powerme/statistics/_search');
                             //console.log(JSON.stringify($rootScope.query));
                             usageData = JSON.parse(usageData);

                             if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                               totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                             }

                             //$rootScope.dashBoardDetails.push({"appType": "dashboard","applicationName":data.hits.hits[i]._source.subjectArea,"department":data.hits.hits[i]._source.department,"dashboard":data.hits.hits[i]._source.dashBoard,"reportName":data.hits.hits[i]._source.reportName,"owner":data.hits.hits[i]._source.owner,"system":data.hits.hits[i]._source.system});
                             var dbDetails = {
                               "system": data.hits.hits[i]._source.system_name,
                               "application": data.hits.hits[i]._source["applications/sites"][0]["application/site_id"],
                               "dashboardGroupName": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboard_group_name,
                               "dashboard": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name.replace(
                                 "=\"",
                                 "").replace("\"",
                                             ""),
                               "owner": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_owner_friendly_name,
                               "createdDate": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_created_date_time,
                               "dashboardId": data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                               "averageRanking": averageRanking,
                               "totalUsers": totalUsers,
                               "totalCount": totalCount
                             };
                             $rootScope.dashBoardDetails.push(dbDetails);
                         //    dashboardPageSearch(dbDetails,
                           //                      data.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages);

                           }


                         }
                         //console.log( $rootScope.dashBoardDetails);

                       })
                       .error(function () {
                         console.log("error");
                       })
                       .finally(function () {
                         $rootScope.isDashBoardDataLoading = false;
                         $rootScope.isDashboardData = true;
                         $rootScope.isDashBoardPageDataLoading = false;
                         $rootScope.isDashboardPageData = true;
                       });


		// Dashboard Page Seacrh - Kabir Added 

                        $rootScope.dashboardPageInfo = [];
			//console.log("Search Item is "+$scope.searchItem);
			//console.log("Search Type is "+$scope.matchPercent);
                     $http
                       .post(environment.apiUri + '/powerme/systems/_search ', {
                         "size": 5000,
                         "query": {
                           "match_phrase": {
                                        "dashboard_page_name" : $scope.searchItem
                           }
                         }
                       })
                       .success(function (dataPg) {

			//console.log("Array Length is "+dataPg.hits.hits.length);
                         if (dataPg.hits.hits.length != 0) {
                           for (var i = 0; i < dataPg.hits.hits.length; i++) {


                             //console.log("DB ID " + dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id);

                             var dbDetails = {
                               "system": dataPg.hits.hits[i]._source.system_name,
                               "application": dataPg.hits.hits[i]._source["applications/sites"][0]["application/site_id"],
                               "dashboardGroupName": dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboard_group_name,
                               "dashboard": dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name.replace(
                                 "=\"",
                                 "").replace("\"",
                                             ""),
                               "owner": dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_owner_friendly_name,
                               "createdDate": dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_created_date_time,
                               "dashboardId": dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                             };
                             dashboardPageSearch(dbDetails,
                                                 dataPg.hits.hits[i]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages);

                           }


                         }
                         //console.log( $rootScope.dashBoardDetails);

                       })
                       .error(function () {
                         console.log("error");
                       })
                       .finally(function () {
                         $rootScope.isDashBoardDataLoading = false;
                         $rootScope.isDashboardData = true;
                         $rootScope.isDashBoardPageDataLoading = false;
                         $rootScope.isDashboardPageData = true;
                       });

                     //Tag Search

                     $rootScope.isTagDataLoading = true;
                     $rootScope.isTagData = false;
                     
                     if ($scope.selected_type===true){
                        
                         $http.post(environment.apiUri + '/powerme/tags/_search ', {
                          "query": { 
                                "bool": { 
                                  "must": [
                                    { "match": { "tag_name": $scope.searchItem}}  
                                  ]
                                }
                              }
                             }).success(function (data) {
                               $rootScope.isTagData = true;
                               $rootScope.tagData = data.hits.hits;
                             }).error(function (error) {
                               console.log(error);
                             }).finally(function () {
                               $rootScope.isTagDataLoading = false;
                             });
                     
                    }
                       else{
                            $http.post(environment.apiUri + '/powerme/tags/_search ', {
                            "query": {
                                "wildcard": {
                                    "tag_name": "*" + $scope.searchItem + "*" 
                                }
                            }
                         }).success(function (data) {
                           $rootScope.isTagData = true;
                           $rootScope.tagData = data.hits.hits;
                         }).error(function (error) {
                           console.log(error);
                         }).finally(function () {
                           $rootScope.isTagDataLoading = false;
                         });
                     
                       
                     
                       }
                     

                     var dashboardPageSearch = function (dashboard, dashboard_pages) {
                       var pages = $filter('fuzzyBy')(dashboard_pages, 'dashboard_page_name', $scope.searchItem);
			//console.log("Original Length: "+dashboard_pages.length+" New Length : "+pages.length);
                       for (var i = 0; i < pages.length; i++) {
                         var averageRanking = 0;
                         var totalUsers = 0;
                         $rootScope.query = {
                           "size": 20,
                           "query": {
                             "bool": {
                               "must": [{
                                 "match_phrase": {
                                   "dashboardPageId": pages[i].dashboard_page_id
                                 }
                               }]
                             }
                           }
                         };
                         var commentsData = averageRankingService(
                           environment.apiUri + '/powerme/comments/_search');
                         commentsData = JSON.parse(commentsData);
                         var commentsDataRanking = [];
                         if (commentsData.hits.hits.length != 0) {
                           for (var k = 0; k < commentsData.hits.hits.length; k++) {
                             if (commentsData.hits.hits[k]._source.message != undefined) {
                               totalUsers++;
                               commentsDataRanking = commentsData.hits.hits[k]._source.message.split("||");
                               if (commentsDataRanking.length > 1) {
                                 averageRanking = averageRanking + parseInt(commentsDataRanking[1]);
                               }
                             }
                           }
                           averageRanking = averageRanking / totalUsers;
                         }
                         //QUERY FOR USAGE COUNT [CARD] OF DASHBOARD PAGES IN A PARTICULAR DASHBOARD
                         $rootScope.query = {
                           "size": 0,
                           "query": {
                             "bool": {
                               "must": [{
                                 "match": {
                                   "repository_name": dashboard.system
                                 }
                               }, {
                                 "match": {
                                   "subjectarea_name": dashboard.dashboardGroupName
                                 }
                               }, {
                                 "match": {
                                   "_dbname": dashboard.dashboard
                                 }
                               }, {
                                 "match": {
                                   "_pgname": pages[i].dashboard_page_name
                                 }
                               }]
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
                         var usageData = averageRankingService(
                           environment.apiUri + '/powerme/statistics/_search');
                         //	console.log(JSON.stringify($rootScope.query));
                         usageData = JSON.parse(usageData);
                         if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                           totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                         }
                         $rootScope.dashboardPageInfo.push({
                                                             "system": dashboard.system,
                                                             "application": dashboard.application,
                                                             "dashboardGroupName": dashboard.dashboardGroupName,
                                                             "dashboard": dashboard.dashboard,
                                                             "dashboardPageName": pages[i].dashboard_page_name,
                                                             "dashboardPageId": pages[i].dashboard_page_id,
                                                             "dashboardPageOwnerName": pages[i].dashboard_page_owner_friendly_name,
                                                             "url": pages[i].dashboard_url,
                                                             "averageRanking": averageRanking,
                                                             "totalUsers": totalUsers,
                                                             "totalCount": totalCount
                                                           })
                       }
                     }

                     $state.go('app.search');
                   }
                 };
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


               }])
  .controller('searchDetailsCtrl',
              ['$scope', '$http', '$stateParams', '$state', '$rootScope', 'paginationService', '$modal',
               function ($scope, $http, $stateParams, $state, $rootScope, paginationService, $modal) {


                 $rootScope.sortedData = 'dashboard';
                 $scope.filterCriteria = "ALL";
                 $scope.options = {
                   searchResultCount: $rootScope.dashBoardResults
                 }

                 $scope.searchResultCount = function (instanceId) {
                   return paginationService.getCollectionLength(instanceId);
                 }

                 $scope.filterOptions = {
                   system: '',
                   applications: {}
                 }

                 //console.log($rootScope.dashBoardDetails);
                 $scope.getFilterTypes = function () {

                   $rootScope.filterInfo = [];
                   $scope.isApps = false;
                   $scope.filterDashboardData = "";


                   if ($scope.filterCriteria == "System") {
                     $scope.isApplications = false;
                     for (var key in  $rootScope.rootCache) {
                       $rootScope.filterInfo.push(key);
                     }

                   }
                   else if ($scope.filterCriteria == "Departments") {
                     $scope.isApplications = false;
                     for (var key in  $rootScope.rootCache) {

                       for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

                         for (var k in $rootScope.rootCache[key][i]) {

                           $rootScope.filterInfo.push(k);
                           $scope.filterOptions.applications[k] = true;
                         }

                       }
                     }

                   }
                   else if ($scope.filterCriteria == "Applications") {
                     $scope.isApplications = true;
                     for (var key in $rootScope.rootCache) {

                       for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

                         for (var k in $rootScope.rootCache[key][i]) {

                           for (var j = 0; j < $rootScope.rootCache[key][i][k].length; j++) {
                             $rootScope.filterInfo.push($rootScope.rootCache[key][i][k][j]);
                           }
                         }

                       }
                     }

                   }
                   else if ($scope.filterCriteria == "ALL") {
                     $scope.filterReportData = "";
                     $scope.filterDashboardData = "";
                     $scope.filterOptions.system = '';
                     $scope.filterOptions.applications = {};
                   }
                 };

                 $rootScope.filterByCriteria = function (value, index, array) {
                   var result = true;
                   switch ($scope.filterCriteria) {
                     case 'System':
                       result = $scope.filterOptions.system === '' || value.system == $scope.filterOptions.system;
                       break;
                     case 'Departments':
                       result = angular.isDefined(
                           $scope.filterOptions.applications[value.application]) && $scope.filterOptions.applications[value.application];
                       break;
                     default :
                       result = true;
                   }
                   return result;
                 }
                 $scope.getContent = function (type) {
                   $scope.filterDashboardData = type;
                 }
                 $scope.sortBookmarks = function (type) {
                   $rootScope.sortedData = type;
                 }

                 $scope.tagDetails = function (tag) {
                   var modalInstance = $modal.open({
                                                     templateUrl: '/views/tmpl/tagDetails.html',
                                                     controller: 'TagDetailsCtrl',
                                                     resolve: {
                                                       tag: function () {
                                                         return tag;
                                                       }
                                                     }
                                                   });
                 }

               }])
  .controller('searchTagDetailsCtrl',
              ['$scope', '$http', '$stateParams', '$state', '$rootScope', 'paginationService', 'tag',
               'averageRankingService',
               function ($scope, $http, $stateParams, $state, $rootScope, paginationService, tag,
                         averageRankingService) {

                 console.log("Tag : ", tag);
                 $scope.tag = tag.data;

                 $scope.sortedData = 'dashboard';

                 $scope.filterCriteria = "ALL";

                 $scope.options = {
                   searchResultCount: $rootScope.dashBoardResults
                 }

                 $scope.searchResultCount = function (instanceId) {
                   return paginationService.getCollectionLength(instanceId);
                 }

                 $scope.filterOptions = {
                   system: '',
                   applications: {}
                 }

                 $scope.getFilterTypes = function () {

                   $rootScope.filterInfo = [];
                   $scope.isApps = false;
                   $scope.filterDashboardData = "";


                   if ($scope.filterCriteria == "System") {
                     $scope.isApplications = false;
                     for (var key in  $rootScope.rootCache) {
                       $rootScope.filterInfo.push(key);
                     }

                   }
                   else if ($scope.filterCriteria == "Departments") {
                     $scope.isApplications = false;
                     for (var key in  $rootScope.rootCache) {

                       for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

                         for (var k in $rootScope.rootCache[key][i]) {

                           $rootScope.filterInfo.push(k);
                           $scope.filterOptions.applications[k] = true;
                         }

                       }
                     }

                   }
                   else if ($scope.filterCriteria == "Applications") {
                     $scope.isApplications = true;
                     for (var key in $rootScope.rootCache) {

                       for (var i = 0; i < $rootScope.rootCache[key].length; i++) {

                         for (var k in $rootScope.rootCache[key][i]) {

                           for (var j = 0; j < $rootScope.rootCache[key][i][k].length; j++) {
                             $rootScope.filterInfo.push($rootScope.rootCache[key][i][k][j]);
                           }
                         }

                       }
                     }

                   }
                   else if ($scope.filterCriteria == "ALL") {
                     $scope.filterReportData = "";
                     $scope.filterDashboardData = "";
                     $scope.filterOptions.system = '';
                     $scope.filterOptions.applications = {};
                   }
                 };

                 $scope.filterByCriteria = function (value, index, array) {
                   var result = true;
                   switch ($scope.filterCriteria) {
                     case 'System':
                       result = $scope.filterOptions.system === '' || value.system == $scope.filterOptions.system;
                       break;
                     case 'Departments':
                       result = angular.isDefined(
                           $scope.filterOptions.applications[value.application]) && $scope.filterOptions.applications[value.application];
                       break;
                     default :
                       result = true;
                   }
                   return result;
                 }
                 $scope.getContent = function (type) {
                   $scope.filterDashboardData = type;
                 }
                 $scope.sortBookmarks = function (type) {
                   $scope.sortedData = type;
                 }

                 $scope.dashBoardDetails = [];

                 if (tag.data._source.dashboards && tag.data._source.dashboards.length != 0) {
                   angular.forEach(tag.data._source.dashboards, function (dashboard) {
                     $rootScope.query = {
                       "query": {
                         "match_phrase": {
                           "dashboardId": dashboard.dashboard_id
                         }
                       }
                     };

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
                             {"match": {"application": dashboard.application}},
                             {"match": {"subjectarea_name": dashboard.dashboard_group}},
                             {
                               "match_phrase": {
                                 "_dbname": dashboard.dashboard_name.replace("=\"", "").replace("\"", "")
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
                     }

                     var totalCount = 0;
                     var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                     usageData = JSON.parse(usageData);

                     if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                       totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                     }

                     $scope.dashBoardDetails.push({
                                                    "system": dashboard.system,
                                                    "application": dashboard.application,
                                                    "dashboardGroupName": dashboard.dashboard_group,
                                                    "dashboard": dashboard.dashboard_name.replace("=\"", "").replace(
                                                      "\"", ""),
                                                    "dashboardId": dashboard.dashboard_id,
                                                    "averageRanking": averageRanking,
                                                    "createdDate": dashboard.dashboard_created_date_time,
                                                    "totalUsers": totalUsers,
                                                    "totalCount": totalCount
                                                  })

                   });
                 }
               }]);
