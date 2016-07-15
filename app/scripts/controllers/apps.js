'use strict';
/**
 *
 */

// JavaScript code for Dashboard Details page, Dashboard-Page page
angular.module('powermeApp')
  .service('averageRankingService', ['$rootScope', function ($rootScope) {
    var serviceMethod = function (url, methodType) {
      var request;
        if(!methodType){
            methodType = 'POST';
        }
      if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        request = new ActiveXObject("Microsoft.XMLHTTP");
      } else {
        throw new Error("Your browser don't support XMLHttpRequest");
      }
      request.open(methodType, url, false);
      //request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify($rootScope.query));
      if (request.status === 200) {
        return request.responseText;
      }
    };
    return serviceMethod;
  }])
  .controller('AppsCtrl', ['$scope', '$http', '$sce', '$state', '$window', '$stateParams', '$rootScope',
                           'averageRankingService', '$filter', 'Descriptions',
                           function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope,
                                     averageRankingService, $filter, Descriptions) {
                             $scope.page = {
                               title: $stateParams.system.charAt(0)
                                 .toUpperCase() + $stateParams.system.slice(1) + ' Details',
                               subtitle: decodeURIComponent($stateParams.dashboard.charAt(0)
                                 .toUpperCase() + $stateParams.dashboard.slice(1)),
                               //test: $stateParams.appName
                             };
                             
                             $scope.reportNames = [];
                             $scope.system = $stateParams.system;
                             $scope.applicationName = $stateParams.application.charAt(0)
                                 .toUpperCase() + $stateParams.application.slice(1);
                             $scope.department = $stateParams.subjectArea.charAt(0)
                                 .toUpperCase() + $stateParams.subjectArea.slice(1);
                             $scope.count = 0;
                             $scope.userNames = [];
                             $scope.dashboardPageChart_Dates = [];
                             $scope.dashboardPageChart_Count = [];
                             $scope.comments = [];
                             $scope.tags = [];
                             $scope.ratings = [];
                             $scope.commentsStatus = false;
                             $scope.keyAssetStatus = "Mark Asset";
                             $scope.onClickAsset = function(){
                                 $scope.keyAssetStatus = "Key Asset!"
                             }
                              $rootScope.query = {
                               "size": 20,
                               "query": {
                                 "bool": {
                                   "must": [{
                                     "match": {
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
                                   }, {
                                     "match": {
                                       "applications/sites.group.dashboards.dashboard_name": $stateParams.dashboard
                                     }
                                   }]
                                 }
                               }
                             };

                             $scope.dashboardPageData = averageRankingService(
                               environment.apiUri + '/powerme/systems/_search');
                             $scope.dashboardPageData = JSON.parse($scope.dashboardPageData);
                             console.log("$stateParams.system: "+$stateParams.system);
                             
                             if($stateParams.system == "TABLEAU"){
                            	 
                            	 $scope.GoToDashboardURL = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[0].dashboard_page_url;
                            	 console.log("TABLEAU URL -> "+$scope.GoToDashboardURL);
                             }
                             
                             else if($stateParams.system == "OBIEE"){
                            	 
                            	 var dashboard_path = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_path;
                            	 console.log("Path: "+dashboard_path);
				 //dashboard_path = dashboard_path.replace(/\s/g, '');
                            	 console.log("New Path: "+dashboard_path);
                            	 var index=dashboard_path.lastIndexOf('/');
                            	 dashboard_path = encodeURIComponent(dashboard_path.slice(0,index));
                            	 console.log("Newest Path: "+dashboard_path);
                            	 var applicationName_URL = "";
                            	 if($stateParams.application === "BU"){
                            		 $scope.GoToDashboardURL = "https://buflash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            		 }
                            	 else if($stateParams.application === "Entitlement"){
                            		 $scope.GoToDashboardURL = "https://entitlementbi" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            		 }
                            	 else if($stateParams.application === "MDM"){
                            		 $scope.GoToDashboardURL = "http://bi" + (environment.name === 'stg' ? '-uat' : '-prd') + "-mdm-a11:9704/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            	 }
                            	 else if($stateParams.application === "VMDash"){
                            		 $scope.GoToDashboardURL = "https://vmdash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            	 }
                            	 else if($stateParams.application === "Web-Flash"){
                            		 $scope.GoToDashboardURL = "https://webflash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            	 }
                            	 else if($stateParams.application === "Compass"){
                            		 $scope.GoToDashboardURL = "https://compass" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
                            	 }
                            	 else{
                            		 console.log("Check application name");
                            	 }
                            	 
                            	 $scope.GoToDashboardURL = $scope.GoToDashboardURL.toString();
                            	 console.log("OBIEE URL -> "+$scope.GoToDashboardURL);
                             }
                            
                             $rootScope.query = {};

                             var data = averageRankingService(environment.apiUri + '/powerme/tags/_search?size=1000&sort=tag_name');
                             data = JSON.parse(data);
                             $scope.tags = data.hits.hits;
                             console.log($scope.tags);
                             var selTags = $filter('filter')($scope.tags, function (value, index, array) {
                               if (angular.isDefined(value._source.dashboards)) {
                                 var dbPages = $filter('filter')(value._source.dashboards, {
                                   dashboard_id: $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                 });
                                 if (angular.isDefined(dbPages) && angular.isArray(dbPages) && dbPages.length > 0) {
                                   value.tagged_by = dbPages[0].tagged_by;
                                   value.tagged_on = dbPages[0].tagged_on;
                                   return true;
                                 }
                               }
                               return false;
                             });
                             var tags_Selected = [];
                             
                             $scope.multipleDemo = {
                               selectedTags: selTags
                             };
                             //kabir chnaged path to id
                             
                             $scope.enableTagging = function (){
                            	 $scope.desc.tag = true;
                            	 console.log("Tagging Enabled");
                            	 $scope.taggingDisabledBlocked = false;
                            	 
                             }
                             
                             $scope.disableTagging = function (){
                            	 $scope.desc.tag = false;
                            	 console.log("Tagging Disabled");
                            	 $scope.taggingDisabledBlocked = true; 
                            	 console.log("$scope.taggingDisabledBlocked "+$scope.taggingDisabledBlocked);
                             }
                             
                             $scope.onTag = function (item, model) {
                               if (tags_Selected.indexOf(item) == -1) {
                                 tags_Selected.push(item._source.tag_name);
                                 
                                 var taggingDocument = {
                                   "system": $stateParams.system,
                                   "application": $stateParams.application,
                                   "dashboard_group": $stateParams.subjectArea,
                                   "dashboard_id": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                   "dashboard_name": $stateParams.dashboard,
                                   "tagged_by": $rootScope.currentUser.username,
                                   "tagged_on": new Date()
                                 }
                                 item.tagged_by = $rootScope.currentUser.username;
                                 item.tagged_on = new Date();
                                 var existingDocuments = angular.isUndefined(item._source.dashboards) ? [] :
                                   item._source.dashboards;
                                 existingDocuments.push(taggingDocument);
                                 //console.log(existingDocuments);
                                 $http.post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                                     "doc": {
                                       "dashboards": existingDocuments
                                     }
                                   })
                                   .success(function (data) {
                                     console.log(data);
                                   })
                                   .error(function () {
                                     console.log("error");
                                   })
                               }
                             }
                             
                             $scope.onUntag = function (item, model) {
                               if (tags_Selected.indexOf(item) == -1) {
                                 tags_Selected.push(item._source.tag_name);
                                 var existingDocuments = item._source.dashboards;
                                 var newDocument = [];
                                 for (var i in existingDocuments) {
                                   if (existingDocuments[i].dashboard_name !== $stateParams.dashboard) {
                                     newDocument.push(existingDocuments[i]);
                                   } else {
                                     continue;
                                   }
                                 }
                                 $http.post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                                     "doc": {
                                       "dashboards": newDocument
                                     }
                                   })
                                   .success(function (data) {
                                     console.log(data);
                                   })
                                   .error(function () {
                                     console.log("error");
                                   })
                               }
                             }

                             //Ability to add descriptions

                             $scope.addDesc = function (text) {
                               $scope.desc.edit = false;
                               if ($scope.desc.descs.length <= 0) {
                                 $scope.desc.descs.unshift({
                                                             text: text,
                                                             added_by: $rootScope.currentUser.username,
                                                             added_on: new Date()
                                                           });
                               }

                               $scope.desc.text = '';

                               if (angular.isDefined($scope.desc.descType)) {
                                 //Update exsisting
                                 Descriptions.update({type: 'dashboard_desc', id: $scope.desc.descType._id}, {
                                   doc: {
                                     descriptions: $scope.desc.descs
                                   }
                                 });
                               } else {
                                 //Create new
                                 Descriptions.create({type: 'dashboard_desc'}, {
                                   dashboard_id: $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                   dashboard_name: $stateParams.dashboard,
                                   descriptions: $scope.desc.descs
                                 }, function (data) {
                                   console.log("After Create Success : ", data);
                                   $scope.desc.descType = data;
                                 }, function (error) {
                                   $scope.desc.descs.splice(0, 1);
                                 })
                               }
                             }

                             $scope.enableDescEdit = function (d) {
                               $scope.desc.oldText = d.text;
                               $scope.desc.edit = true;
                             }

                             $scope.resetDescEdit = function (d) {
                               d.text = $scope.desc.oldText;
                               $scope.desc.edit = false;
                             }

                             $scope.deleteDesc = function (index) {
                               var d = $scope.desc.descs[i];
                               $scope.desc.descs.splice(index, 1);
                               Descriptions.update({type: 'dashboard_desc', id: $scope.desc.descType._id}, {
                                 doc: {
                                   descriptions: $scope.desc.descs
                                 }
                               });
                             }

                             $scope.desc = {
                               descs: [],
                               edit: false
                             };

                             Descriptions.fetch({type: 'dashboard_desc'}, {
                                                  query: {
                                                    match_phrase: {
                                                      dashboard_id: $scope.dashboardPageData.hits.hits[0]._source['applications/sites'][0].group[0].dashboards[0].dashboard_id
                                                    }
                                                  }
                                                },
                                                function (data) {
                                                  if (data.hits.total > 0) {
                                                    $scope.desc.descs = data.hits.hits[0]._source.descriptions;
                                                    $scope.desc.descType = data.hits.hits[0];
                                                  }

                                                  console.log("Default Desc : ",
                                                              $scope.dashboardPageData.hits.hits[0]._source['applications/sites'][0].group[0].dashboards[0].description);

                                                  if ($scope.desc.descs.length <= 0) {
                                                    var d = $scope.dashboardPageData.hits.hits[0]._source['applications/sites'][0].group[0].dashboards[0].description;
                                                    $scope.addDesc(
                                                      angular.isUndefined(d) || d === '' || d.toUpperCase() === 'NA' ?
                                                        '' : d);
                                                  }
                                                  console.log("descs : ", $scope.desc.descs);
                                                  console.log("descType : ", $scope.desc.descType);
                                                }, function (error) {
                                 console.log("error : ", error);
                               });


                             //console.log($scope.multipleDemo.selectedTags);
                             /*console.log("SUBJECT_AREA "+$stateParams.subjectArea+"////"+"DASHBOARD_GROUP"+$stateParams.dashboardGroupName);
                              console.log("SYSTEM "+$scope.system);
                              console.log("APPLICATION "+$scope.applicationName);
                              console.log("DEPARTMENT "+$scope.department);
                              console.log("DASHBOARD NAME "+$stateParams.appName);*/
                             //Replace DASHBOARD_NAME on Line 9 and 22 with the Dashboard name selected
                             //Replace #SPECIFIC_DASHBOARD_CHART_ID on Line 36 with <div ID>
                             $scope.SpecificDashboardUsageStats = [];
                             $scope.dates = [];
                             //AJAX CALL FOR SPECIFIC DASHBOARDS USAGE
                             //Query gives the dates the particular dashboard page has been used
                             $scope.DailyUsageCount = [];
                             //AJAX CALL FOR SPECIFIC DASHBOARDS USAGE

                             $rootScope.query = {
                               "size": 0,
                               "query": {
                                 "bool": {
                                   "must": [{"match": {"repository_name": $stateParams.system}},
                                     {"match": {"application": $scope.applicationName}},
                                     {"match": {"subjectarea_name": $stateParams.subjectArea}},
                                     {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}}]
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


                             angular.element('#DashboardPageUsageChart')
                               .highcharts({
                                             chart: {
                                               zoomType: 'x'
                                             },
                                             title: {
                                               text: 'Dashboard Usage Analysis'
                                             },
                                             subtitle: {
                                               text: document.ontouchstart === undefined ?
                                                 'Click and drag in the plot area to zoom in' :
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
                                                 text: '# of Dashboard Hits',
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
                                               name: 'Dashboard Usage',
                                               data: $scope.DailyUsageCount
                                             }]
                                           }); //Graph Endpoint
                             //AJAX CALL FOR FREQUENT USERS

// Kabir >> query to match for every level
                             console.log("System " + $stateParams.system);
                             console.log("Application " + $stateParams.application);
                             console.log("DB Grp " + $stateParams.dashboardGroupName);
                             console.log("SA " + $stateParams.subjectArea);
                             console.log("DB Name " + $stateParams.dashboard);
                             console.log("Page Name " + $stateParams.dashboardPageName);

                             $scope.FrequentUserNames = [];
                             $scope.FrequentUserUsageCount = [];
                             $rootScope.query = {
                               "size": 0,
                               "query": {
                                 "bool": {
                                   "must": [

                                     {"match": {"repository_name": $stateParams.system}},
                                     {"match": {"application": $scope.applicationName}},
                                     {"match": {"subjectarea_name": $stateParams.subjectArea}},
                                     {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}}
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
                             var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                             data = JSON.parse(data);
                             for (var i = 0; i < data.aggregations.dashboard_names.buckets.length; i++) {
                               $scope.FrequentUserNames.push(data.aggregations.dashboard_names.buckets[i].key);
                               $scope.FrequentUserUsageCount.push(
                                 data.aggregations.dashboard_names.buckets[i].result.value);
                             }
                             //CARDS
                             $scope.dashboardPageInfo = [];
                             //QUERY FOR AVERAGE RANKING [CARD] OF DASHBOARD PAGES IN A PARTICULAR DASHBOARD


                             //Process Dashboard Data, Actual Fetch is moved at the top of function
                             for (var i = 0; i < $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages.length; i++) {
                               var averageRanking = 0;
                               var totalUsers = 0;
                               $rootScope.query = {
                                 "size": 20,
                                 "query": {
                                   "bool": {
                                     "must": [{
                                       "match_phrase": {
                                         "dashboardPageId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_id
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
                                         "repository_name": $stateParams.system
                                       }
                                     }, {
                                       "match": {
                                         "subjectarea_name": $stateParams.subjectArea
                                       }
                                     }, {
                                       "match": {
                                         "repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)
                                       }
                                     }, {
                                       "match": {
                                         "_pgname": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_name
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
                               $scope.dashboardPageInfo.push({
                                                               "system": $stateParams.system,
                                                               "application": $stateParams.application,
                                                               "dashboardGroupName": $stateParams.subjectArea,
                                                               "dashboard": $stateParams.dashboard,
                                                               "dashboardPageName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_name,
                                                               "dashboardPageId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_id,
                                                               "dashboardPageOwnerName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_owner_friendly_name,
                                                               "url": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_url,
                                                               "averageRanking": averageRanking,
                                                               "totalUsers": totalUsers,
                                                               "totalCount": totalCount
                                                             })
                             }
                             /*
                              console.log("system "+$stateParams.system);
                              console.log("application "+$stateParams.application);
                              console.log("dashboardGroupName "+$stateParams.subjectArea);
                              console.log("dashboard "+$stateParams.dashboard);
                              */
                             $scope.bookMarkStatus = function () {
                               $http.post(environment.apiUri + '/powerme/bookmark/_search ', {
                                   "size": 20,
                                   "query": {
                                     "bool": {
                                       "must": [{
                                         "match_phrase": {
                                           "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                         }
                                       }, {
                                         "match_phrase": {
                                           "userId": $rootScope.currentUser.username
                                         }
                                       }]
                                     }
                                   }
                                 })
                                 .success(function (data) {
                                   $scope.bookMarkStats = data.hits.hits.length;
                                   //console.log("$scope.bookMarkStats=="+$scope.bookMarkStats);
                                 })
                                 .error(function () {
                                   console.log("error");
                                 })
                             }
                             $scope.bookMarkIt = function (type) {
                               if (type == 'do') {
                                 $http.post(environment.apiUri + '/powerme/bookmark ', {
                                     "bookmarkName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_name,
                                     "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                     "userId": $rootScope.currentUser.username,
                                     "system": $stateParams.system,
                                     "application": $stateParams.application,
                                     "dashboardGroupName": $stateParams.subjectArea,
                                     "owner": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_owner_friendly_name,
                                     "createdDate": new Date()
                                   })
                                   .success(function (data) {
                                     setTimeout(function () {
                                       $scope.bookMarkStatus();
                                     }, 1000);
                                   })
                                   .error(function () {
                                     console.log("error");
                                   })
                               } else if (type == 'undo') {
                                 $http.post(environment.apiUri + '/powerme/bookmark/_search ', {
                                     "size": 20,
                                     "query": {
                                       "bool": {
                                         "must": [{
                                           "match_phrase": {
                                             "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                           }
                                         }]
                                       }
                                     }
                                   })
                                   .success(function (data) {
                                     $http.delete(environment.apiUri + '/powerme/bookmark/' + data.hits.hits[0]._id)
                                       .success(function (data) {
                                         setTimeout(function () {
                                           $scope.bookMarkStatus();
                                         }, 1000);
                                       })
                                       .error(function () {
                                         console.log("error");
                                       })
                                   })
                                   .error(function () {
                                     console.log("error");
                                   })
                               }
                             }
                             $scope.bookMarkStatus();
                             $scope.addTags = function () {
                               if ($stateParams.system == "TABLEAU") {
                                 $rootScope.query = {
                                   "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                   "taggingData": $scope.taggingData,
                                   "timing": new Date(),
                                   "userId": $rootScope.currentUser.username + "@vmware.com",
                                   "userName": $rootScope.currentUser.username
                                 };
                               } else {
                                 // kabir changed path to id
                                 $rootScope.query = {
                                   "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                   "taggingData": $scope.taggingData,
                                   "timing": new Date(),
                                   "userId": $rootScope.currentUser.username + "@vmware.com",
                                   "userName": $rootScope.currentUser.username
                                 };
                               }
                               /*var tagStatus= averageRankingService(environment.apiUri+'/powerme/comments');
                                $scope.tags="";
                                setTimeout(function(){$scope.getTags();}, 1000);
                                */
                               $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                                 .success(function (data) {
                                   $scope.tags = [];
                                   $scope.taggingData = "";
                                   setTimeout(function () {
                                     $scope.getTags();
                                   }, 1000);
                                 })
                                 .error(function () {
                                   console.log("error");
                                 })
                             }
                             $scope.getTags = function () {
                               if ($stateParams.system == "TABLEAU") {
                                 $rootScope.query = {
                                   "size": 20,
                                   "query": {
                                     "bool": {
                                       "must": [{
                                         "match_phrase": {
                                           "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                         }
                                       }]
                                     }
                                   }
                                 };
                               } else {
                                 /// changed path to id kabir
                                 $rootScope.query = {
                                   "size": 20,
                                   "query": {
                                     "bool": {
                                       "must": [{
                                         "match_phrase": {
                                           "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                         }
                                       }]
                                     }
                                   }
                                 };
                               }
                               $http.post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
                                 .success(function (data) {
                                   if (data.hits.hits.length != 0) {
                                     for (var i = 0; i < data.hits.hits.length; i++) {
                                       if (data.hits.hits[i]._source.taggingData != undefined) {
                                         $scope.tags.push({
                                                            "tagName": data.hits.hits[i]._source.taggingData,
                                                            "userName": data.hits.hits[i]._source.userName,
                                                            "timing": data.hits.hits[i]._source.timing
                                                          });
                                       }
                                     }
                                   }
                                 })
                                 .error(function () {
                                   console.log("error");
                                 })
                             }
                             $scope.getTags();
                             $scope.postComments = function () {
                               if ($scope.userComments != "" && $scope.userRating != "") {
                                 if ($scope.userComments == undefined) {
                                   //console.log($scope.userComments);
                                   if ($stateParams.system == "TABLEAU") {
                                     $rootScope.query = {
                                       "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                       "message": "NAS" + "||" + $scope.userRating,
                                       "timing": new Date(),
                                       "userId": $rootScope.currentUser.username + "@vmware.com",
                                       "userName": $rootScope.currentUser.username
                                     };
                                   } else {
                                     // changed path to id
                                     $rootScope.query = {
                                       "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                       "message": "NAS" + "||" + $scope.userRating,
                                       "timing": new Date(),
                                       "userId": $rootScope.currentUser.username + "@vmware.com",
                                       "userName": $rootScope.currentUser.username
                                     };
                                   }
                                   $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                                     .success(function (data) {
                                       $scope.comments = [];
                                       $scope.userComments = undefined;
                                       $scope.userRating = "";
                                       $scope.dashboardAverageRanking = 0;
                                       $scope.totalRatingUsers = 0;
                                       setTimeout(function () {
                                         $scope.getComments();
                                       }, 1000);
                                     })
                                     .error(function () {
                                       console.log("error");
                                     })
                                 } else {
                                   if ($stateParams.system == "TABLEAU") {
                                     $rootScope.query = {
                                       "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                       "message": $scope.userComments + "||" + $scope.userRating,
                                       "timing": new Date(),
                                       "userId": $rootScope.currentUser.username + "@vmware.com",
                                       "userName": $rootScope.currentUser.username
                                     };
                                   } else {
                                     //Kabir changed dashboard_path to dashboard_id
                                     $rootScope.query = {
                                       "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id,
                                       "message": $scope.userComments + "||" + $scope.userRating,
                                       "timing": new Date(),
                                       "userId": $rootScope.currentUser.username + "@vmware.com",
                                       "userName": $rootScope.currentUser.username
                                     };
                                   }
                                   $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                                     .success(function (data) {
                                       $scope.comments = [];
                                       $scope.userComments = undefined;
                                       $scope.userRating = "";
                                       $scope.dashboardAverageRanking = 0;
                                       $scope.totalRatingUsers = 0;
                                       setTimeout(function () {
                                         $scope.getComments();
                                       }, 1000);
                                     })
                                     .error(function () {
                                       console.log("error");
                                     })
                                 }
                               }
                             }
                             $scope.dashboardAverageRanking = 0;
                             $scope.totalRatingUsers = 0;
                             $scope.getComments = function () {
                               console.log(" $scope.userComments=>" + $scope.userComments);
                               if ($stateParams.system == "TABLEAU") {
                                 $rootScope.query = {
                                   "size": 20,
                                   "query": {
                                     "bool": {
                                       "must": [{
                                         "match_phrase": {
                                           "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                         }
                                       }]
                                     }
                                   }
                                 };
                               } else {
                                 // kabir changed path to id
                                 $rootScope.query = {
                                   "size": 20,
                                   "query": {
                                     "bool": {
                                       "must": [{
                                         "match_phrase": {
                                           "dashboardId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id
                                         }
                                       }]
                                     }
                                   }
                                 };
                               }
                               $http.post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
                                 .success(function (data) {
                                   if (data.hits.hits.length != 0) {
                                     $scope.commentsStatus = true;
                                     for (var i = 0; i < data.hits.hits.length; i++) {
                                       if (data.hits.hits[i]._source.message != undefined) {
                                         $scope.totalRatingUsers++;
                                         //console.log($scope.totalRatingUsers);
                                         if (data.hits.hits[i]._source.message.split("||")[0] != "NAS") {
                                           $scope.comments.push({
                                                                  "comments": data.hits.hits[i]._source.message.split(
                                                                    "||")[0],
                                                                  "ratings": data.hits.hits[i]._source.message.split(
                                                                    "||")[1],
                                                                  "userName": data.hits.hits[i]._source.userName
                                                                });
                                           $scope.dashboardAverageRanking += parseInt(
                                             data.hits.hits[i]._source.message.split("||")[1]);
                                         } else {
                                           $scope.comments.push({
                                                                  "comments": "",
                                                                  "ratings": data.hits.hits[i]._source.message.split(
                                                                    "||")[1],
                                                                  "userName": data.hits.hits[i]._source.userName
                                                                });
                                           $scope.dashboardAverageRanking += parseInt(
                                             data.hits.hits[i]._source.message.split("||")[1]);
                                         }
                                       }
                                     }
                                     //console.log($scope.dashboardAverageRanking);
                                     $scope.dashboardAverageRanking = $scope.dashboardAverageRanking / ($scope.totalRatingUsers);
                                     //console.log("$scope.dashboardAverageRanking=>"+$scope.dashboardAverageRanking);
                                     $scope.totalRatingUsers = $scope.totalRatingUsers;
                                     //console.log("$scope.totalRatingUsers==>"+$scope.totalRatingUsers);
                                   }
                                 })
                                 .error(function () {
                                   console.log("error");
                                 })
                             }
                             $scope.getComments();
                             /* $http
                              .post(environment.apiUri+'/powermeservice/system/_search', { "size": 20, "query": {"bool": {"must": [{"match_phrase": { "dashBoard": $stateParams.appName}},{"match": {"subjectArea":   $scope.applicationName}},{"match": {"department":  $scope.department}}]}}})
                              .success(function (data){

                              // console.log(data.hits.hits.length);
                              if(data.hits.hits.length!=0){
                              for(var i=0;i<data.hits.hits.length;i++){
                              var averageRanking=0;
                              $rootScope.query={"query": {"match": {"docId": data.hits.hits[i]._id}}};
                              var commentsData= averageRankingService(environment.apiUri+'/powermeservice/comments/_search');
                              commentsData =  JSON.parse(commentsData);

                              var commentsDataRanking =[];
                              if(commentsData.hits.hits.length!=0){
                              for(var k=0;k<commentsData.hits.hits.length;k++){
                              if(commentsData.hits.hits[k]._source.message!=undefined){
                              commentsDataRanking =commentsData.hits.hits[k]._source.message.split("||");
                              if(commentsDataRanking.length>1){
                              averageRanking=averageRanking+parseInt(commentsDataRanking[1]);

                              }
                              }

                              }

                              averageRanking=averageRanking/commentsData.hits.total;

                              }

                              $scope.reportNames.push({"system":data.hits.hits[i]._source.system,"owner":data.hits.hits[i]._source.owner,"usageCount":data.hits.hits[i]._source.usageCount,"reportName":data.hits.hits[i]._source.reportName,"averageRanking":averageRanking});
                              }

                              }

                              })
                              .error(function(){
                              console.log("error");
                              })*/
                             //console.log("$stateParams.appName"+$stateParams.appName);
                             //$http.post(environment.apiUri + '/powermeservice/usagegraph/_search', {
                             //  "size": 0,
                             //  "query": {
                             //    "bool": {
                             //      "must": [{
                             //        "match": {
                             //          "SAW_DASHBOARD": $stateParams.appName
                             //        }
                             //      }]
                             //    }
                             //  },
                             //  "aggs": {
                             //    "users": {
                             //      "terms": {
                             //        "field": "USER_NAME",
                             //        "size": 5
                             //      }
                             //    }
                             //  }
                             //})
                             //  .success(function (data) {
                             //             if (data.aggregations.users.buckets.length != 0) {
                             //               for (var i = 0; i < data.aggregations.users.buckets.length; i++) {
                             //                 $scope.userNames.push(data.aggregations.users.buckets[i].key);
                             //               }
                             //             }
                             //           })
                             //  .error(function () {
                             //           console.log("error");
                             //         })
                           }])
  //--------------------------DASHBOARD PAGE CODE -----------------------------------------------------------------
  //--------------------------DASHBOARD PAGE CODE -----------------------------------------------------------------
  //--------------------------DASHBOARD PAGE CODE -----------------------------------------------------------------
  .controller('dashboardpageinfoCtrl',
              ['$scope', '$http', '$sce', '$state', '$window', '$stateParams', '$rootScope', 'averageRankingService',
                '$filter', 'Descriptions', function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope,
                                                     averageRankingService,
                                                     $filter, Descriptions) {
                $scope.page = {
                  title: $stateParams.system.charAt(0)
                    .toUpperCase() + $stateParams.system.slice(1) + ' Details',
                  subtitle: $stateParams.dashboardPageName.charAt(0)
                    .toUpperCase() + $stateParams.dashboardPageName.slice(1),
                  //test: $stateParams.appName
                };
                $scope.reportNames = [];
                $scope.system = $stateParams.system;
                $scope.applicationName = $stateParams.application.charAt(0)
                    .toUpperCase() + $stateParams.application.slice(1);
                $scope.department = $stateParams.dashboardGroupName.charAt(0)
                    .toUpperCase() + $stateParams.dashboardGroupName.slice(1);
                $scope.dashboard = decodeURIComponent($stateParams.dashboard.charAt(0)
                    .toUpperCase() + $stateParams.dashboard.slice(1));
                $scope.count = 0;
                $scope.userNames = [];
                $scope.dashboardPageChart_Dates = [];
                $scope.dashboardPageChart_Count = [];
                $scope.comments = [];
                $scope.tags = [];
                $scope.ratings = [];
                $scope.commentsStatus = false;
                $scope.SpecificDashboardPageUsageStats = [];
                //////////////////////////////////////TAGS//////////////////////////////////////////////////////////////////////
                $rootScope.query = {
                  "size": 20,
                  "query": {
                    "bool": {
                      "must": [{
                        "match": {
                          "applications/sites.group.dashboard_group_name": $stateParams.dashboardGroupName
                        }
                      }, {
                        "match": {
                          "applications/sites.application/site_id": $stateParams.application
                        }
                      }, {
                        "match": {
                          "system_name": $stateParams.system
                        }
                      }, {
                        "match": {
                          "applications/sites.group.dashboards.dashboard_name": $stateParams.dashboard
                        }
                      }, , {
                        "match": {
                          "applications/sites.group.dashboards.dashboard_pages.dashboard_page_name": $stateParams.dashboardPageName
                        }
                      }]
                    }
                  }
                };

                $scope.dashboardPageData = averageRankingService(environment.apiUri + '/powerme/systems/_search');
                $scope.dashboardPageData = JSON.parse($scope.dashboardPageData);

                $scope.dashboardId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id;
               for (var z = 0; z < $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages.length; z++) {
                   if ($scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].dashboard_page_name == $stateParams.dashboardPageName) {
                     $scope.dashboardPageId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].dashboard_page_id; 
		}
		}
		//$scope.dashboardPageId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[0].dashboard_page_id;
             
		$scope.dashboardPageDescription = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[0].dashboard_page_description;

     $rootScope.query = {};
                $scope.GoToDashboardPageURL = "";
                if($stateParams.system == "TABLEAU"){
               	 
               	 $scope.GoToDashboardPageURL = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[0].dashboard_page_url;
               	 console.log("TABLEAU Page URL -> "+$scope.GoToDashboardPageURL);
                }
                
                else if($stateParams.system == "OBIEE"){
               	 
               	 var dashboard_path = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_path;
               	 //dashboard_path = dashboard_path.replace(/\s/g, '');
               	 var index=dashboard_path.lastIndexOf('/');
               	 dashboard_path = encodeURIComponent(dashboard_path.slice(0,index));
               	 var applicationName_URL = "";
               	 if($stateParams.application === "BU"){
               		 $scope.GoToDashboardPageURL = "https://buflash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
               		 }
               	 else if($stateParams.application === "Entitlement"){
               		 $scope.GoToDashboardPageURL = "https://entitlementbi" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
               		 }
               	 else if($stateParams.application === "MDM"){
               		 $scope.GoToDashboardPageURL = "http://bi" + (environment.name === 'stg' ? '-uat' : '-prd') + "-mdm-a11:9704/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
               	 }
               	 else if($stateParams.application === "VMDash"){
               		 $scope.GoToDashboardPageURL = "https://vmdash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
               	 }
               	 else if($stateParams.application === "Web-Flash"){
               		 $scope.GoToDashboardPageURL = "https://webflash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
               	 }
               	 else{
               		 console.log("Check application name");
               	 }
               	 
               	 $scope.GoToDashboardPageURL = $scope.GoToDashboardPageURL.toString();
               	 console.log("OBIEE URL -> "+$scope.GoToDashboardPageURL);
                }

                $rootScope.query = {};

                var data = averageRankingService(environment.apiUri + '/powerme/tags/_search?size=1000&sort=tag_name');
                data = JSON.parse(data);
                $scope.tags = data.hits.hits;
                console.log("Tags"+$scope.tags);
                if($stateParams.system == "OBIEE"){
                $scope.dashboardPageId = $scope.dashboardId + "/" +$stateParams.dashboardPageName;
		}
                var selTags = $filter('filter')($scope.tags, function (value, index, array) {
                  if (angular.isDefined(value._source.dashboard_page)) {
                    var dbPages = $filter('filter')(value._source.dashboard_page, {
                      dashboard_page_id: $scope.dashboardPageId
                    });
                    if (angular.isDefined(dbPages) && angular.isArray(dbPages) && dbPages.length > 0) {
                      value.tagged_by = dbPages[0].tagged_by;
                      value.tagged_on = dbPages[0].tagged_on;
                      return true;
                    }
                  }
                  return false;
                });

                var tags_Selected = [];
                $scope.multipleDemo = {
                  selectedTags: selTags
                };
                
                $scope.enableTagging = function (){
               	 $scope.desc.tag = true;
               	 console.log("Tagging Enabled");
               	 $scope.taggingDisabledBlocked = false;
               	 
                }
                
                $scope.disableTagging = function (){
               	 $scope.desc.tag = false;
               	 console.log("Tagging Disabled");
               	 $scope.taggingDisabledBlocked = true; 
               	 console.log("$scope.taggingDisabledBlocked "+$scope.taggingDisabledBlocked);
                }
                
                $scope.onTag = function (item, model) {
                  if (tags_Selected.indexOf(item) == -1) {
                    tags_Selected.push(item._source.tag_name);
                    var taggingDocument = {
                      "system": $stateParams.system,
                      "application": $stateParams.application,
                      "dashboard_group": $stateParams.dashboardGroupName,
                      "dashboard": $stateParams.dashboard,
                      "dashboard_page_name": $stateParams.dashboardPageName,
                      "dashboard_page_id": $scope.dashboardPageId,
                      "tagged_by": $rootScope.currentUser.username,
                      "tagged_on": new Date()
                    }
                    item.tagged_by = $rootScope.currentUser.username;
                    item.tagged_on = new Date();
                    var existingDocuments = angular.isUndefined(item._source.dashboard_page) ? [] :
                      item._source.dashboard_page;
                    existingDocuments.push(taggingDocument);
                    //console.log(existingDocuments);
                    $http.post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                        "doc": {
                          "dashboard_page": existingDocuments
                        }
                      })
                      .success(function (data) {
                        console.log(data);
                      })
                      .error(function () {
                        console.log("error");
                      })
                  }
                }
                $scope.onUntag = function (item, model) {
                  if (tags_Selected.indexOf(item) == -1) {
                    tags_Selected.push(item._source.tag_name);
                    var existingDocuments = item._source.dashboard_page;
                    var newDocument = [];
                    for (var i in existingDocuments) {
                      if (existingDocuments[i].dashboard_page_name !== $stateParams.dashboardPageName) {
                        newDocument.push(existingDocuments[i]);
                      } else {
                        continue;
                      }
                    }
                    $http.post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                        "doc": {
                          "dashboard_page": newDocument
                        }
                      })
                      .success(function (data) {
                        console.log(data);
                      })
                      .error(function () {
                        console.log("error");
                      })
                  }
                }

                $scope.addDesc = function (text) {
                  $scope.desc.edit = false;
                  if ($scope.desc.descs.length <= 0) {
                    $scope.desc.descs.unshift({
                                                text: text,
                                                added_by: $rootScope.currentUser.username,
                                                added_on: new Date()
                                              });
                  }

                  $scope.desc.text = '';

                  if (angular.isDefined($scope.desc.descType)) {
                    //Update exsisting
                    Descriptions.update({
                                          type: 'dashboard_page_desc', id: $scope.desc.descType._id
                                        }, {
                                          doc: {
                                            descriptions: $scope.desc.descs
                                          }
                                        });
                  } else {
                    //Create new
                    Descriptions.create({
                                          type: 'dashboard_page_desc'
                                        }, {
                                          dashboard_id: $scope.dashboardId,
                                          dashboard_name: $stateParams.dashboard,
                                          dashboard_page_name: $stateParams.dashboardPageName,
                                          dashboard_page_id: $scope.dashboardPageId,
                                          descriptions: $scope.desc.descs
                                        }, function (data) {
                      console.log("After Create Success : ", data);
                      $scope.desc.descType = data;
                    }, function (error) {
                      $scope.desc.descs.splice(0, 1);
                    })
                  }
                }

                $scope.enableDescEdit = function (d) {
                  $scope.desc.oldText = d.text;
                  $scope.desc.edit = true;
                }

                $scope.resetDescEdit = function (d) {
                  d.text = $scope.desc.oldText;
                  $scope.desc.edit = false;
                }

                $scope.deleteDesc = function (index) {
                  var d = $scope.desc.descs[i];
                  $scope.desc.descs.splice(index, 1);
                  Descriptions.update({
                                        type: 'dashboard_page_desc', id: $scope.desc.descType._id
                                      }, {
                                        doc: {
                                          descriptions: $scope.desc.descs
                                        }
                                      });
                }

                $scope.desc = {
                  descs: [],
                  edit: false
                };

                             Descriptions.fetch({type: 'dashboard_page_desc'}, {
                                                  query: {
                                                    match_phrase: {
                                                      dashboard_page_id: $scope.dashboardPageId
                                                    }
                                                  }
                                                },
                /*Descriptions.fetch({
                                     type: 'dashboard_page_desc'
                                   }, {
                                     query: {
                                       bool: {
                                         must: [
                                           {
                                             match: {
                                               dashboard_id : $scope.dashboardId 
                                             }
                                           },
                                           {
                                             match: {
                                               dashboard_page_id : $scope.dashboardPageId 
                                             }
                                           }
                                         ]
                                       }
                                     }
                                   },*/
                                   function (data) {
                                     if (data.hits.total > 0) {
                                       $scope.desc.descs = data.hits.hits[0]._source.descriptions;
                                       $scope.desc.descType = data.hits.hits[0];
                                     }

                                

                                     if ($scope.desc.descs.length <= 0) {
                                       var d = $scope.dashboardPageDescription;
                                       $scope.addDesc(
                                         angular.isUndefined(d) || d === '' || d.toUpperCase() === 'NA' ?
                                           '' : d);
                                     }
                                     console.log("descs : ", $scope.desc.descs);
                                     console.log("descType : ", $scope.desc.descType);
                                   }, function (error) {
                    console.log("error : ", error);
                  });

                //AJAX CALL FOR SPECIFIC DASHBOARDS PAGE USAGE
                //Query gives the dates the particular dashboard page has been used

                $rootScope.query = {
                  "size": 0,
                  "query": {
                    "bool": {
                      "must": [{"match": {"repository_name": $stateParams.system}},
                        {"match": {"application": $stateParams.application}},
                        {"match": {"subjectarea_name": $stateParams.dashboardGroupName}},
                        {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}},
                        {"match": {"_pgname": $stateParams.dashboardPageName}}]
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


                angular.element('#DashboardPageUsageChart')
                  .highcharts({
                                chart: {
                                  zoomType: 'x'
                                },
                                title: {
                                  text: 'Dashboard Page Usage Analysis'
                                },
                                subtitle: {
                                  text: document.ontouchstart === undefined ?
                                    'Click and drag in the plot area to zoom in' :
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
                                    text: '# of Dashboard Page Hits',
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
                                  name: 'Dashboard Page Usage',
                                  data: $scope.SpecificDashboardPageUsageStats
                                }]
                              }); //Graph Endpoint
                $scope.Names = [];
                var count = 0;
                $scope.FrequentUserNames = [];
                $scope.FrequentUserUsageCount = [];
                //AJAX CALL FOR FREQUENT DASBOARD PAGE USERS
                //Top 5 Users would be stored in $scope.FrequentUserNames
                //Their respective counts would be stored in $scope.FrequentUserUsageCount
                console.log("System " + $stateParams.system);
                console.log("Application " + $stateParams.application);
                console.log("DB Grp " + $stateParams.dashboardGroupName);
                console.log("DB Name " + $stateParams.dashboard);
                console.log("Page Name " + $stateParams.dashboardPageName);
// Kabir >> query to match for every level

                $rootScope.query = {
                  "size": 0,
                  "query": {
                    "bool": {
                      "must": [
                        {"match": {"repository_name": $stateParams.system}},
                        {"match": {"application": $scope.applicationName}},
                        {"match": {"subjectarea_name": $stateParams.dashboardGroupName}},
                        {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}}, {
                          "match": {
                            "_pgname": $stateParams.dashboardPageName
                          }
                        }]
                    }
                  },
                  "aggs": {
                    "dashboard_names": {
                      "terms": {
                        // Kabir >>"field": "repositories.applications.subject-areas.dashboards.users._name",
                        "field": "repositories.applications.subject-areas.dashboards.dashboard_pages.users._name",
                        "order": {
                          "result.value": "desc"
                        },
                        "size": 10
                      },
                      "aggs": {
                        "result": {
                          "sum": {
                            "field": "repositories.applications.subject-areas.dashboards.dashboard_pages.users._count"
                          }
                        }
                      }
                    }
                  }
                };
                var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                data = JSON.parse(data);
                for (var i = 0; i < data.aggregations.dashboard_names.buckets.length; i++) {
                  $scope.FrequentUserNames.push(data.aggregations.dashboard_names.buckets[i].key);
                  $scope.FrequentUserUsageCount.push(data.aggregations.dashboard_names.buckets[i].result.value);
                }
                $scope.reportsInfo = [];


                if ($stateParams.system == "TABLEAU") {
                  $scope.dashboardId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id;
                } else {
                  // changed path to id
                  $scope.dashboardId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id;
                }
                for (var i = 0; i < $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages.length; i++) {
                  if ($scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_name === $stateParams.dashboardPageName) {
                    $scope.dashboardPageId = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_id;
                    $scope.dashboardPageName = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_name;
                    $scope.dashboardPageOwner = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_owner_friendly_name;
                    $scope.dashboardPageDescription = $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_description;
                    if ($scope.dashboardPageDescription === "NA") {
                      $scope.dashboardPageDescription = "";
                    }
                    for (var j = 0; j < $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports.length; j++) {
                      var averageRanking = 0;
                      var totalUsers = 0;
                      $rootScope.query = {
                        "size": 20,
                        "query": {
                          "bool": {
                            "must": [{
                              "match_phrase": {
                                "reportId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports[j].report_id
                              }
                            }]
                          }
                        }
                      };
                      var commentsData = averageRankingService(environment.apiUri + '/powerme/comments/_search');
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
                      $scope.reportsInfo.push({
                                                "system": $stateParams.system,
                                                "application": $stateParams.application,
                                                "dashboardGroupName": $stateParams.dashboardGroupName,
                                                "dashboard": $stateParams.dashboard,
                                                "dashboardPageName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].dashboard_page_name,
                                                "reportName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports[j].report_name,
                                                "reportId": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports[j].report_id,
                                                "reportOwnerName": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports[j].report_owner_friendly_name,
                                                "description": $scope.dashboardPageData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[i].reports[j].report_description,
                                                "averageRanking": averageRanking,
                                                "totalUsers": totalUsers
                                              });
                    }
                  }
                }
                $scope.bookMarkStatus = function () {
                  $http.post(environment.apiUri + '/powerme/bookmark/_search ', {
                      "size": 20,
                      "query": {
                        "bool": {
                          "must": [{
                            "match_phrase": {
                              "dashboardPageId": $scope.dashboardPageId
                            }
                          }, {
                            "match_phrase": {
                              "userId": $rootScope.currentUser.username
                            }
                          }]
                        }
                      }
                    })
                    .success(function (data) {
                      $scope.bookMarkStats = data.hits.hits.length;
                      //console.log("$scope.bookMarkStats=="+$scope.bookMarkStats);
                    })
                    .error(function () {
                      console.log("error");
                    })
                }
                $scope.bookMarkIt = function (type) {
                  if (type == 'do') {
                    $http.post(environment.apiUri + '/powerme/bookmark ', {
                        "bookmarkName": $scope.dashboardPageName,
                        "dashboardPageId": $scope.dashboardPageId,
                        "userId": $rootScope.currentUser.username,
                        "system": $stateParams.system,
                        "application": $stateParams.application,
                        "dashboardGroupName": $stateParams.dashboardGroupName,
                        "owner": $scope.dashboardPageOwner,
                        "dashboard": $stateParams.dashboard,
                        "createdDate": new Date()
                      })
                      .success(function (data) {
                        setTimeout(function () {
                          $scope.bookMarkStatus();
                        }, 1000);
                      })
                      .error(function () {
                        console.log("error");
                      })
                  } else if (type == 'undo') {
                    $http.post(environment.apiUri + '/powerme/bookmark/_search ', {
                        "size": 20,
                        "query": {
                          "bool": {
                            "must": [{
                              "match": {
                                "dashboardPageId": $scope.dashboardPageId
                              }
                            }]
                          }
                        }
                      })
                      .success(function (data) {
                        $http.delete(environment.apiUri + '/powerme/bookmark/' + data.hits.hits[0]._id)
                          .success(function (data) {
                            setTimeout(function () {
                              $scope.bookMarkStatus();
                            }, 1000);
                          })
                          .error(function () {
                            console.log("error");
                          })
                      })
                      .error(function () {
                        console.log("error");
                      })
                  }
                }
                $scope.bookMarkStatus();
                $scope.addTags = function () {
                  $rootScope.query = {
                    "dashboardPageId": $scope.dashboardPageId,
                    "taggingData": $scope.taggingData,
                    "timing": new Date(),
                    "userId": $rootScope.currentUser.username + "@vmware.com",
                    "userName": $rootScope.currentUser.username
                  };
                  /*var tagStatus= averageRankingService(environment.apiUri+'/powerme/comments');
                   $scope.tags="";
                   setTimeout(function(){$scope.getTags();}, 1000);
                   */
                  $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                    .success(function (data) {
                      $scope.tags = [];
                      $scope.taggingData = "";
                      setTimeout(function () {
                        $scope.getTags();
                      }, 1000);
                    })
                    .error(function () {
                      console.log("error");
                    })
                }
                $scope.getTags = function () {
                  $rootScope.query = {
                    "size": 20,
                    "query": {
                      "bool": {
                        "must": [{
                          "match_phrase": {
                            "dashboardId": $scope.dashboardId
                          }
                        }]
                      }
                    }
                  };
                  $http.post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
                    .success(function (data) {
                      if (data.hits.hits.length != 0) {
                        for (var i = 0; i < data.hits.hits.length; i++) {
                          if (data.hits.hits[i]._source.taggingData != undefined) {
                            $scope.tags.push({
                                               "tagName": data.hits.hits[i]._source.taggingData,
                                               "userName": data.hits.hits[i]._source.userName,
                                               "timing": data.hits.hits[i]._source.timing
                                             });
                          }
                        }
                      }
                    })
                    .error(function () {
                      console.log("error");
                    })
                  $rootScope.query = {
                    "size": 20,
                    "query": {
                      "bool": {
                        "must": [{
                          "match_phrase": {
                            "dashboardPageId": $scope.dashboardPageId
                          }
                        }]
                      }
                    }
                  };
                  $http.post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
                    .success(function (data) {
                      if (data.hits.hits.length != 0) {
                        for (var i = 0; i < data.hits.hits.length; i++) {
                          if (data.hits.hits[i]._source.taggingData != undefined) {
                            $scope.tags.push({
                                               "tagName": data.hits.hits[i]._source.taggingData,
                                               "userName": data.hits.hits[i]._source.userName,
                                               "timing": data.hits.hits[i]._source.timing
                                             });
                          }
                        }
                      }
                    })
                    .error(function () {
                      console.log("error");
                    })
                }
                $scope.getTags();
                $scope.postComments = function () {
                  if ($scope.userComments != "" && $scope.userRating != "") {
                    if ($scope.userComments == undefined) {
                      // console.log($scope.userComments);
                      $rootScope.query = {
                        "dashboardPageId": $scope.dashboardPageId,
                        "message": "NAS" + "||" + $scope.userRating,
                        "timing": new Date(),
                        "userId": $rootScope.currentUser.username + "@vmware.com",
                        "userName": $rootScope.currentUser.username
                      };
                      $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                        .success(function (data) {
                          $scope.comments = [];
                          $scope.userComments = undefined;
                          $scope.userRating = "";
                          $scope.totalRatingUsers = 0;
                          $scope.dashboardAverageRanking = 0;
                          setTimeout(function () {
                            $scope.getComments();
                          }, 1000);
                        })
                        .error(function () {
                          console.log("error");
                        })
                    } else {
                      $rootScope.query = {
                        "dashboardPageId": $scope.dashboardPageId,
                        "message": $scope.userComments + "||" + $scope.userRating,
                        "timing": new Date(),
                        "userId": $rootScope.currentUser.username + "@vmware.com",
                        "userName": $rootScope.currentUser.username
                      };
                      $http.post(environment.apiUri + '/powerme/comments', $rootScope.query)
                        .success(function (data) {
                          $scope.comments = [];
                          $scope.userComments = undefined;
                          $scope.userRating = "";
                          $scope.totalRatingUsers = 0;
                          $scope.dashboardAverageRanking = 0;
                          setTimeout(function () {
                            $scope.getComments();
                          }, 1000);
                        })
                        .error(function () {
                          console.log("error");
                        })
                    }
                  }
                }
                $scope.dashboardAverageRanking = 0;
                $scope.totalRatingUsers = 0;
                $scope.getComments = function () {
                  $rootScope.query = {
                    "size": 20,
                    "query": {
                      "bool": {
                        "must": [{
                          "match_phrase": {
                            "dashboardPageId": $scope.dashboardPageId
                          }
                        }]
                      }
                    }
                  };
                  //console.log(JSON.stringify( $rootScope.query));
                  $http.post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
                    .success(function (data) {
                      //console.log(data.hits.hits.length);
                      if (data.hits.hits.length != 0) {
                        $scope.commentsStatus = true;
                        for (var i = 0; i < data.hits.hits.length; i++) {
                          if (data.hits.hits[i]._source.message != undefined) {
                            $scope.totalRatingUsers++;
                            if (data.hits.hits[i]._source.message.split("||")[0] != "NAS") {
                              $scope.comments.push({
                                                     "comments": data.hits.hits[i]._source.message.split("||")[0],
                                                     "ratings": data.hits.hits[i]._source.message.split("||")[1],
                                                     "userName": data.hits.hits[i]._source.userName
                                                   });
                              $scope.dashboardAverageRanking += parseInt(
                                data.hits.hits[i]._source.message.split("||")[1]);
                            } else {
                              $scope.comments.push({
                                                     "comments": "",
                                                     "ratings": data.hits.hits[i]._source.message.split("||")[1],
                                                     "userName": data.hits.hits[i]._source.userName
                                                   });
                              $scope.dashboardAverageRanking += parseInt(
                                data.hits.hits[i]._source.message.split("||")[1]);
                            }
                          }
                        }
                        //console.log("$scope.dashboardAverageRanking==>"+$scope.dashboardAverageRanking);
                        //console.log("$scope.totalRatingUsers==>"+$scope.totalRatingUsers);
                        $scope.dashboardAverageRanking = $scope.dashboardAverageRanking / $scope.totalRatingUsers;
                        //console.log($scope.dashboardAverageRanking);
                      }
                    })
                    .error(function () {
                      console.log("error");
                    })
                }
                $scope.getComments();
                /* $http
                 .post(environment.apiUri+'/powermeservice/system/_search', { "size": 20, "query": {"bool": {"must": [{"match_phrase": { "dashBoard": $stateParams.appName}},{"match": {"subjectArea":   $scope.applicationName}},{"match": {"department":  $scope.department}}]}}})
                 .success(function (data){

                 // console.log(data.hits.hits.length);
                 if(data.hits.hits.length!=0){
                 for(var i=0;i<data.hits.hits.length;i++){
                 var averageRanking=0;
                 $rootScope.query={"query": {"match": {"docId": data.hits.hits[i]._id}}};
                 var commentsData= averageRankingService(environment.apiUri+'/powermeservice/comments/_search');
                 commentsData =  JSON.parse(commentsData);

                 var commentsDataRanking =[];
                 if(commentsData.hits.hits.length!=0){
                 for(var k=0;k<commentsData.hits.hits.length;k++){
                 if(commentsData.hits.hits[k]._source.message!=undefined){
                 commentsDataRanking =commentsData.hits.hits[k]._source.message.split("||");
                 if(commentsDataRanking.length>1){
                 averageRanking=averageRanking+parseInt(commentsDataRanking[1]);

                 }
                 }

                 }

                 averageRanking=averageRanking/commentsData.hits.total;

                 }

                 $scope.reportNames.push({"system":data.hits.hits[i]._source.system,"owner":data.hits.hits[i]._source.owner,"usageCount":data.hits.hits[i]._source.usageCount,"reportName":data.hits.hits[i]._source.reportName,"averageRanking":averageRanking});
                 }

                 }

                 })
                 .error(function(){
                 console.log("error");
                 })*/
                //console.log("$stateParams.appName"+$stateParams.appName);
                //$http.post(environment.apiUri + '/powermeservice/usagegraph/_search', {
                //  "size": 0,
                //  "query": {
                //    "bool": {
                //      "must": [{
                //        "match": {
                //          "SAW_DASHBOARD": $stateParams.appName
                //        }
                //      }]
                //    }
                //  },
                //  "aggs": {
                //    "users": {
                //      "terms": {
                //        "field": "USER_NAME",
                //        "size": 5
                //      }
                //    }
                //  }
                //})
                //  .success(function (data) {
                //             if (data.aggregations.users.buckets.length != 0) {
                //               for (var i = 0; i < data.aggregations.users.buckets.length; i++) {
                //                 $scope.userNames.push(data.aggregations.users.buckets[i].key);
                //               }
                //             }
                //           })
                //  .error(function () {
                //           console.log("error");
                //         })
              }]);
