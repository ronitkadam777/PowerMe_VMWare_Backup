'use strict';
/**
 *
 */
angular.module('powermeApp')
  .controller('reportCtrl',
              ['$scope', '$http', '$sce', '$state', '$window', '$stateParams', '$rootScope', 'averageRankingService',
               '$filter', 'Descriptions',
               function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService,
                         $filter, Descriptions) {

                 $scope.page = {
                   title: 'Report Details',
                   subtitle: $stateParams.reportName.charAt(0).toUpperCase() + $stateParams.reportName.slice(1)
                 };
                 $scope.system = $stateParams.system;
                 $scope.presentationTables = "";
                 $scope.presentationColumns = "";
                 $scope.logicalTableSource = "";
                 $scope.logicalTable = "";
                 $scope.logicalColumn = "";
                 $scope.physicalTable = "";
                 $scope.physicalColumn = "";
                 $scope.alias = "";
                 $scope.formula = "";
                 $scope.docId = "";
                 $scope.dateCategories = [];
                 $scope.dataLabels = [];
                 $scope.comments = [];
                 $scope.tags = [];
                 $scope.ratings = [];
                 $scope.commentsStatus = false;
                 $scope.userNames = [];
                 $scope.completeMatching = [];
                 $scope.shouldMatching = [];
                 $scope.patternMatching = [];
                 $scope.similarMatching = [];
                 $scope.reportsInfo = [];

                 console.log("repository_name" + $stateParams.system)
                 console.log("application" + $stateParams.application);
                 console.log("subjectarea_name" + $stateParams.dashboardGroupName);
                 console.log("_dbname" + $stateParams.dashboard);
                 console.log("_pgname" + $stateParams.dashboardPageName);
                 console.log("_repname" + $stateParams.reportName);

                 $rootScope.query = {
                   "size": 20,
                   "query": {
                     "bool": {
                       "must": [{"match": {"applications/sites.group.dashboard_group_name": $stateParams.dashboardGroupName}},
                         {"match": {"applications/sites.application/site_id": $stateParams.application}},
                         {"match": {"system_name": $stateParams.system}},
                         {"match": {"applications/sites.group.dashboards.dashboard_name": $stateParams.dashboard}},
                         {"match": {"applications/sites.group.dashboards.dashboard_pages.dashboard_page_name": $stateParams.dashboardPageName}},
                         {"match": {"applications/sites.group.dashboards.dashboard_pages.reports.report_name": $stateParams.reportName}}]
                     }
                   }
                 };
                 var reportData = averageRankingService(environment.apiUri + '/powerme/systems/_search');

                 reportData = JSON.parse(reportData);
                 console.log(
                   "DB ID:" + reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id);
                 console.log(
                   "DB Pages #:" + reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages.length);


$scope.GoToDashboardURL = "";
                 if($stateParams.system == "TABLEAU"){
                	 
                	 $scope.GoToDashboardURL = reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[0].dashboard_page_url;
                	 console.log("TABLEAU URL -> "+$scope.GoToDashboardURL);
                 }
                 
                 else if($stateParams.system == "OBIEE"){
                	 
                	 var dashboard_path = reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_path;
                	 var index=dashboard_path.lastIndexOf('/');
                	 dashboard_path = encodeURIComponent(dashboard_path.slice(0,index));
                	 var applicationName_URL = "";
                	 if($stateParams.application === "BU"){
                		 $scope.GoToDashboardURL = " https://buflash" + (environment.name === 'stg' ? '-stg' : '-sso') + ".vmware.com/analytics/saw.dll?Dashboard&PortalPath="+dashboard_path;
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
                	 else{
                		 console.log("Check application name");
                	 }
                	 
                	 $scope.GoToDashboardURL = $scope.GoToDashboardURL.toString();
                	 console.log("OBIEE URL -> "+$scope.GoToDashboardURL);
                 }



                 if ($stateParams.system == "TABLEAU") {
                   $scope.dashboardId = reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id;
                 } else {
                   $scope.dashboardId = reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_id;
                 }

                 for (var z = 0; z < reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages.length; z++) {
                   if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].dashboard_page_name == $stateParams.dashboardPageName) {
                     $scope.dashboardPageId = reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].dashboard_page_id;
                     for (var i = 0; i < reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports.length; i++) {
                       if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_name === $stateParams.reportName) {

                         $scope.reportsInfo.push({
                                                   "system": $stateParams.system,
                                                   "application": $stateParams.application,
                                                   "dashboardGroupName": $stateParams.dashboardGroupName,
                                                   "dashboard": decodeURIComponent($stateParams.dashboard),
                                                   "dashboardPageName": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].dashboard_page_name,
                                                   "reportName": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_name,
                                                   "reportId": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_id,
                                                   "reportOwnerName": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_owner_friendly_name,
                                                   "description": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_description,
                                                   "reportPath": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_path,
                                                   "createdDate": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_created_date_time,
                                                   "updatedDate": reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].report_updated_date_time
                                                 });
                         for (var j = 0; j < reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables.length; j++) {
                           if (j < (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables.length - 1)) {

                             if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name != undefined) {
                               $scope.presentationTables += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name + " <BR> ";
                             }
                             if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].logical_table_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].logical_table_name != undefined) {
                               $scope.logicalTable += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].logical_table_name + " <BR> ";
                             }
                             if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name != undefined) {
                               $scope.physicalTable += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name + " <BR> ";
                               $scope.logicalTableSource += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name + " <BR> ";
                             }
                           }
                           else {
                             if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name != undefined) {
                               $scope.presentationTables += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].presentation_table_name;
                             }
                             $scope.logicalTable += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].logical_table_name;

                             if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name != undefined) {
                               $scope.physicalTable += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name;
                               $scope.logicalTableSource += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].physical_table_name;

                             }
                           }
                           if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns) {
                             $scope.physicalSchema = "";
                             for (var k = 0; k < reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns.length; k++) {

                               if (k < (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns.length - 1)) {

                                 if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].presentation_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].presentation_name != undefined) {
                                   $scope.presentationColumns += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].presentation_name + " <BR> ";
                                 }
                                 if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].logical_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].logical_name != undefined) {
                                   $scope.logicalColumn += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].logical_name + " <BR> ";
                                 }
                                 if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name != "NA" && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name != undefined) {
                                   $scope.physicalColumn += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name + " <BR> ";
                                 }

                               } else {
                                 $scope.presentationColumns += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].presentation_name;
                                 $scope.logicalColumn += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].logical_name;
                                 if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name != "NA") {
                                   $scope.physicalColumn += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].columns[k].physical_name;
                                 }

                               }
                             }
                           }
                           // Start Formula Filling
                           if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas) {
                             for (var l = 0; l < reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas.length; l++) {

                               if (l < (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas.length - 1)) {

                                 if (reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas[l].formula != '' && reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas[l].formula != undefined) {
                                   $scope.formula += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas[l].formula + " <BR> ";
                                 }
                               }
                               else {

                                 $scope.formula += reportData.hits.hits[0]._source["applications/sites"][0].group[0].dashboards[0].dashboard_pages[z].reports[i].tables[j].formulas[l].formula;
                               }
                             }
                           } // End of Formula Filling
                         }

                       }

                     }
                   }
                 }
                 console.log("repository_name" + $stateParams.system)
                 console.log("application" + $stateParams.application);
                 console.log("subjectarea_name" + $stateParams.dashboardGroupName);
                 console.log("_dbname" + $stateParams.dashboard);
                 console.log("_pgname" + $stateParams.dashboardPageName);
                 console.log("_repname" + $stateParams.reportName);

                 //Replace DASHBOARD_PAGE_NAME on Line 9 and 22 with the Dashboard name selected
                 //Replace #SPECIFIC_DASHBOARD_PAGE_CHART_ID on Line 36 with <div ID>


                 ////////////////////////////////////////////////////////TAGS//////////////////////////////////////////////////////////////////////


                 $rootScope.query = {};
                 var data = averageRankingService(environment.apiUri + '/powerme/tags/_search?size=100');
                 data = JSON.parse(data);
                 $scope.tags = data.hits.hits;
                 var selTags = $filter('filter')($scope.tags, function (value, index, array) {
                   if (angular.isDefined(value._source.report)) {
                     var dbPages = $filter('filter')(value._source.report, {
                       report_id: $scope.reportsInfo[0].reportId
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
           
                   var taggingDocument = {
                     "system": $stateParams.system,
                     "application": $stateParams.application,
                     "dashboard_group": $stateParams.dashboardGroupName,
                     "dashboard": $stateParams.dashboard,
                     "dashboard_page_name": $stateParams.dashboardPageName,
                     "report_id": $scope.reportsInfo[0].reportId,
                     "report_name": $stateParams.reportName,
                     "tagged_by": $rootScope.currentUser.username,
                     "tagged_on": new Date()
                   }
                   item.tagged_by = $rootScope.currentUser.username;
                   item.tagged_on = new Date();
                   var existingDocuments = angular.isUndefined(item._source.report) ? [] : 
                	   item._source.report;
                   existingDocuments.push(taggingDocument);
                   $http
                     .post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                       "doc": {
                         "report": existingDocuments
                       }
                     })
                     .success(function (data) {
                       console.log(data);
                     })
                     .error(function () {
                       console.log("error");
                     })
                 }
                 $scope.onUntag = function (item, model) {
                   var existingDocuments = item._source.report;
                   var newDocument = [];
                   for (var i in existingDocuments) {
                     if (existingDocuments[i].report_name !== $stateParams.reportName) {
                       newDocument.push(existingDocuments[i]);
                     }
                     else {
                       continue;
                     }
                   }
                   $http.post(environment.apiUri + '/powerme/tags/' + item._id + '/_update', {
                       "doc": {
                         "report": newDocument
                       }
                     })
                     .success(function (data) {
                       console.log(data);
                     })
                     .error(function () {
                       console.log("error");
                     })
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
                                           type: 'report_desc', id: $scope.desc.descType._id
                                         }, {
                                           doc: {
                                             descriptions: $scope.desc.descs
                                           }
                                         });
                   } else {
                     //Create new
                     Descriptions.create({
                                           type: 'report_desc'
                                         }, {
                                           dashboard_id: $scope.dashboardId,
                                           dashboard_name: $stateParams.dashboard,
                                           dashboard_page_name: $stateParams.dashboardPageName,
                                           dashboard_page_id: $scope.dashboardPageId,
                                           report_id: $scope.reportsInfo[0].reportId,
                                           report_name: $stateParams.reportName,
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
                                         type: 'report_desc', id: $scope.desc.descType._id
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

                 Descriptions.fetch({
                                      type: 'report_desc'
                                    }, {
                                      query: {
                                        bool: {
                                          must: [
                                            {
                                              match_phrase: {
                                                dashboard_id: $scope.dashboardId
                                              }
                                            },
                                            {
                                              match_phrase: {
                                                dashboard_page_id: $scope.dashboardPageId
                                              }
                                            },
                                            {
                                              match_phrase: {
                                                report_id: $scope.reportsInfo[0].reportId
                                              }
                                            }
                                          ]
                                        }
                                      }
                                    },
                                    function (data) {
                                      if (data.hits.total > 0) {
                                        $scope.desc.descs = data.hits.hits[0]._source.descriptions;
                                        $scope.desc.descType = data.hits.hits[0];
                                      }

                                      console.log("Default Desc : ", $scope.reportsInfo[0].description);

                                      if ($scope.desc.descs.length <= 0) {
                                        var d = $scope.reportsInfo[0].description;
                                        $scope.addDesc(
                                          angular.isUndefined(d) || d === '' || d.toUpperCase() === 'NA' ?
                                            '' : d);
                                      }
                                      console.log("descs : ", $scope.desc.descs);
                                      console.log("descType : ", $scope.desc.descType);
                                    }, function (error) {
                     console.log("error : ", error);
                   });

                 //AJAX CALL FOR SPECIFIC REPORT USAGE
                 //Query gives the dates the particular report page has been used

                 $scope.SpecificReportStats = [];

                 //AJAX CALL FOR TOP DASHBOARDS USAGE

                 if ($stateParams.application != "Tableau-Production") {

                   $rootScope.query = {
                     "size": 0,
                     "query": {
                       "bool": {
                         "must": [{"match": {"repository_name": $stateParams.system}},
                           {"match": {"application": $stateParams.application}},
                           {"match": {"subjectarea_name": $stateParams.dashboardGroupName}},
                           {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}},
                           {"match": {"_pgname": $stateParams.dashboardPageName}},
                           {"match": {"_repname": $stateParams.reportName}}]
                       }
                     },
                     "aggs": {
                       "group_by_dbname": {
                         "date_histogram": {"field": "date", "interval": "week"},
                         "aggs": {"sum_of_dbcount": {"sum": {"field": "_repcount"}}}
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
                     $scope.SpecificReportStats.push([dateFormat,
                                                      data.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                   }


                 }

                 else {

                   $rootScope.query = {
                     "size": 0,
                     "query": {
                       "bool": {
                         "must": [{"match": {"repository_name": $stateParams.system}}, {"match": {"application": "1"}},
                           {"match": {"subjectarea_name": $stateParams.dashboardGroupName}},
                           {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}},
                           {"match": {"_pgname": $stateParams.dashboardPageName}},
                           {"match": {"_repname": $stateParams.reportName}}]
                       }
                     },
                     "aggs": {
                       "group_by_dbname": {
                         "date_histogram": {"field": "date", "interval": "week"},
                         "aggs": {"sum_of_dbcount": {"sum": {"field": "_repcount"}}}
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
                     $scope.SpecificReportStats.push([dateFormat,
                                                      data.aggregations.group_by_dbname.buckets[i].sum_of_dbcount.value]);
                   }


                 }


                 angular.element('#lineChartTop10UsageReport').highcharts({
                                                                            chart: {
                                                                              zoomType: 'x'
                                                                            },
                                                                            title: {
                                                                              text: 'Report Usage Analysis'
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
                                                                                text: '# of Report Hits',
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
                                                                              name: 'Report Usage',
                                                                              data: $scope.SpecificReportStats
                                                                            }]

                                                                          }); //Graph Endpoint


                 console.log("System " + $stateParams.system);
                 console.log("Application " + $stateParams.application);
                 console.log("DB Grp " + $stateParams.dashboardGroupName);
                 console.log("DB SA " + $stateParams.subjectArea);
                 console.log("DB Name " + $stateParams.dashboard);
                 console.log("Page Name " + $stateParams.dashboardPageName);
                 console.log("Report Name " + $stateParams.reportName);

                 $scope.FrequentUserNames = [];
                 $scope.FrequentUserUsageCount = [];

                 //AJAX CALL FOR FREQUENT DASBOARD PAGE USERS
                 //All Users of particular report
//Kabir comments
                 $rootScope.query = {
                   "size": 0,
                   "query": {
                     "bool": {
                       "must": [
                         {"match": {"repository_name": $stateParams.system}},
                         {"match": {"application": $stateParams.application}},
                         {"match": {"subjectarea_name": $stateParams.dashboardGroupName}},
                         {"match": {"repositories.applications.subject-areas.dashboards._dbname": decodeURIComponent($stateParams.dashboard)}}, {
                           "match": {
                             "_pgname": $stateParams.dashboardPageName
                           }
                         }, {"match": {"_repname": $stateParams.reportName}}]
                     }
                   },
                   "aggs": {
                     "dashboard_names": {
                       "terms": {
                         "field": "repositories.applications.subject-areas.dashboards.dashboard_pages.reports.users._name",
                         "order": {"result.value": "desc"},
                         "size": 10
                       },
                       "aggs": {"result": {"sum": {"field": "repositories.applications.subject-areas.dashboards.dashboard_pages.reports.users._count"}}}
                     }
                   }
                 };

                 var data = averageRankingService(environment.apiUri + '/powerme/statistics/_search');

                 data = JSON.parse(data);


                 for (var i = 0; i < data.aggregations.dashboard_names.buckets.length; i++) {

                   $scope.FrequentUserNames.push(data.aggregations.dashboard_names.buckets[i].key);
                   $scope.FrequentUserUsageCount.push(data.aggregations.dashboard_names.buckets[i].result.value);

                 }

                 /*$scope.bookMarkStatus=function(){

                  $http
                  .post(environment.apiUri+'/powerme/bookmark/_search ', { "size": 20, "query": {"bool": {"must": [{"match": { "reportId":   $scope.reportsInfo[0].reportPath+"||"+$scope.reportsInfo[0].reportId}}]}}})
                  .success(function (data){
                  $scope.bookMarkStats=data.hits.hits.length;
                  console.log("$scope.bookMarkStats=="+$scope.bookMarkStats);

                  })
                  .error(function(){
                  console.log("error");
                  })


                  }
                  $scope.bookMarkIt=function(type){


                  if(type=='do'){

                  $http
                  .post(environment.apiUri+'/powerme/bookmark ', {"bookmarkName": $scope.reportsInfo[0].reportName,"reportId":$scope.reportsInfo[0].reportPath+"||"+$scope.reportsInfo[0].reportId,"userId": "gvictor"})
                  .success(function (data){

                  setTimeout(function(){ $scope.bookMarkStatus(); }, 1000);

                  })
                  .error(function(){
                  console.log("error");
                  })
                  }else if(type=='undo'){

                  $http
                  .post(environment.apiUri+'/powerme/bookmark/_search ', { "size": 20, "query": {"bool": {"must": [{"match": { "reportId":$scope.reportsInfo[0].reportPath+"||"+$scope.reportsInfo[0].reportId}}]}}})
                  .success(function (data){

                  $http
                  .delete(environment.apiUri+'/powerme/bookmark/'+data.hits.hits[0]._id)
                  .success(function (data){
                  setTimeout(function(){ $scope.bookMarkStatus(); }, 1000);
                  })
                  .error(function(){
                  console.log("error");
                  })

                  })
                  .error(function(){
                  console.log("error");
                  })

                  }

                  }
                  $scope.bookMarkStatus();*/
                 $scope.addTags = function () {

                   $http
                     .post(environment.apiUri + '/powerme/comments', {
                       "reportId": $scope.reportsInfo[0].reportId,
                       "taggingData": $scope.taggingData,
                       "timing": new Date(),
                       "userId": $rootScope.currentUser.username + "@vmware.com",
                       "userName": $rootScope.currentUser.username
                     })
                     .success(function (data) {
                       $scope.tags = [];
                       setTimeout(function () {
                         $scope.getTags();
                       }, 1000);
                       $scope.taggingData = "";
                     })
                     .error(function () {
                       console.log("error");
                     })


                 }

                 $scope.getTags = function () {

                   $rootScope.query = {
                     "size": 20,
                     "query": {"bool": {"must": [{"match_phrase": {"dashboardId": $scope.dashboardId}}]}}
                   };


                   $http
                     .post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
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
                     "query": {"bool": {"must": [{"match_phrase": {"dashboardPageId": $scope.dashboardPageId}}]}}
                   };


                   $http
                     .post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
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
                   if ($scope.reportsInfo[0] != undefined) {
                     $rootScope.query = {
                       "size": 20,
                       "query": {"bool": {"must": [{"match_phrase": {"reportId": $scope.reportsInfo[0].reportId}}]}}
                     };
                   }
                   $http
                     .post(environment.apiUri + '/powerme/comments/_search ', $rootScope.query)
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
                   var reportId = "";
                   if ($scope.reportsInfo[0] != undefined) {
                     reportId = $scope.reportsInfo[0].reportId;
                   }

                   if ($scope.userComments != "" && $scope.userRating != "") {

                     if ($scope.userComments == undefined) {

                       $http
                         .post(environment.apiUri + '/powerme/comments', {
                           "reportId": reportId,
                           "message": "NAS" + "||" + $scope.userRating,
                           "timing": new Date(),
                           "userId": $rootScope.currentUser.username + "@vmware.com",
                           "userName": $rootScope.currentUser.username
                         })
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
                       $http
                         .post(environment.apiUri + '/powerme/comments', {
                           "reportId": reportId,
                           "message": $scope.userComments + "||" + $scope.userRating,
                           "timing": new Date(),
                           "userId": $rootScope.currentUser.username + "@vmware.com",
                           "userName": $rootScope.currentUser.username
                         })
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
                   var reportId = "";
                   if ($scope.reportsInfo[0] != undefined) {
                     reportId = $scope.reportsInfo[0].reportId;
                   }
                   $http
                     .post(environment.apiUri + '/powerme/comments/_search ',
                           {"size": 20, "query": {"bool": {"must": [{"match_phrase": {"reportId": reportId}}]}}})
                     .success(function (data) {
                       console.log("length==>" + data.hits.hits.length);
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
                             }

                             else {
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
                         console.log($scope.dashboardAverageRanking);

                         $scope.dashboardAverageRanking = $scope.dashboardAverageRanking / $scope.totalRatingUsers;
                         console.log($scope.dashboardAverageRanking);

                       }
                     })
                     .error(function () {
                       console.log("error");
                     })
                 }
                 $scope.getComments();
               }]);
