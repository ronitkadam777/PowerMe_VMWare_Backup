'use strict';
angular.module('powermeApp')
.controller('tagtilesCtrl', ['$scope', '$http', '$sce', '$state', '$window', '$stateParams', '$rootScope', 'averageRankingService','ngTableParams', '$modal',   function ($scope, $http, $sce, $state, $window, $stateParams, $rootScope, averageRankingService, ngTableParams, $modal) {
	  
	$rootScope.tagSelected = "Tag Name"; 
	$scope.tag_name_selected = function(index){
			
		$rootScope.tagSelected = index;
		$rootScope.tag_dashboard = [];
        $rootScope.tag_dashboardPg = [];
        $rootScope.tag_report = [];
        $rootScope.sortedData = 'dashboard';
        $rootScope.changeSort = function (type) {
            console.log(type);
            $rootScope.sortedData = type;
          }
        
		$rootScope.query = {"query": {"bool": {"must": [{"match": {"tag_name": $rootScope.tagSelected}}]}}};
		var tagData = averageRankingService(environment.apiUri + '/powerme/tags/_search?size=1000');
		tagData = JSON.parse(tagData);  
		
		var term="";
		
		 if (tagData.hits.hits[0]._source.dashboards != undefined) {
             $scope.results = tagData.hits.hits[0]._source.dashboards.length;
             for(var i=0; i< $scope.results; i++){
            	 	 
            	     $rootScope.query = {"query": {"match_phrase": {"dashboardId": tagData.hits.hits[0]._source.dashboards[i].dashboard_id}}};
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
                     
                     $rootScope.query = {"size": 0,"query": {"bool": {"must": [{"match_phrase": {"_dbname": tagData.hits.hits[0]._source.dashboards[i].dashboard_name}}]}},"aggs": {"group_by_state": {"terms": {"field": "repositories.applications.subject-areas.dashboards._dbname"},"aggs": {"total_count": {"sum": {"field": "repositories.applications.subject-areas.dashboards._dbcount"}}}}}};
                     var totalCount = 0;
                     var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                     usageData = JSON.parse(usageData);
                     if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                       totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                     }

                     $scope.tag_dashboard.push({
                       "id": tagData.hits.hits[0]._source.dashboards[i].dashboard_id,
                       "system": tagData.hits.hits[0]._source.dashboards[i].system,
                       "application": tagData.hits.hits[0]._source.dashboards[i].application,
                       "dashboardGroupName": tagData.hits.hits[0]._source.dashboards[i].dashboard_group,
                       "dashboard": tagData.hits.hits[0]._source.dashboards[i].dashboard_name,
                       "averageRanking": averageRanking,
                       "totalUsers": totalUsers,
                       "totalCount": totalCount
                     });
                    }
             }
		 
		 if (tagData.hits.hits[0]._source.dashboard_page != undefined) {
             
			 
			 $scope.results = tagData.hits.hits[0]._source.dashboard_page.length;
             for(var i=0; i< $scope.results; i++){
            	 	 
            	     $rootScope.query = {"query": {"match_phrase": {"dashboardPageId": tagData.hits.hits[0]._source.dashboard_page[i].dashboard_page_id}}};
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
                     
                     $rootScope.query = {"size": 0,"query": {"bool": {"must": [{"match_phrase": {"_pgname": tagData.hits.hits[0]._source.dashboard_page[i].dashboard_page_name}}]}},"aggs": {"group_by_state": {"terms": {"field": "repositories.applications.subject-areas.dashboards.dashboard_pages._pgname"},"aggs": {"total_count": {"sum": {"field": "repositories.applications.subject-areas.dashboards.dashboard_pages._pgcount"}}}}}};
                     var totalCount = 0;
                     var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                     usageData = JSON.parse(usageData);
                     if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                       totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                     }

                     $rootScope.tag_dashboardPg.push({
                       "id": tagData.hits.hits[0]._source.dashboard_page[i].dashboard_page_id,
                       "system": tagData.hits.hits[0]._source.dashboard_page[i].system,
                       "application": tagData.hits.hits[0]._source.dashboard_page[i].application,
                       "dashboardGroupName": tagData.hits.hits[0]._source.dashboard_page[i].dashboard_group,
                       "dashboard": tagData.hits.hits[0]._source.dashboard_page[i].dashboard,
                       "dashboardPageName": tagData.hits.hits[0]._source.dashboard_page[i].dashboard_page_name,
                       "averageRanking": averageRanking,
                       "totalUsers": totalUsers,
                       "totalCount": totalCount
                     });
                     
                    }
             
			 
			 
			 
			 
		 }
		 
		 if(tagData.hits.hits[0]._source.report != undefined){

             
			 
			 $scope.results = tagData.hits.hits[0]._source.report.length;
             for(var i=0; i< $scope.results; i++){
            	 	 
            	     $rootScope.query = {"query": {"match_phrase": {"reportId": tagData.hits.hits[0]._source.report[i].report_id}}};
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
                     
                     $rootScope.query = {"size": 0,"query": {"bool": {"must": [{"match_phrase": {"_repname": tagData.hits.hits[0]._source.report[i].report_name}}]}},"aggs": {"group_by_state": {"terms": {"field": "repositories.applications.subject-areas.dashboards.dashboard_pages.reports._repname"},"aggs": {"total_count": {"sum": {"field": "repositories.applications.subject-areas.dashboards.dashboard_pages..reports._repcount"}}}}}};
                     var totalCount = 0;
                     var usageData = averageRankingService(environment.apiUri + '/powerme/statistics/_search');
                     usageData = JSON.parse(usageData);
                     if (usageData.aggregations.group_by_state.buckets[0] != undefined) {
                       totalCount = usageData.aggregations.group_by_state.buckets[0].total_count.value;
                     }

                     $rootScope.tag_report.push({
                       "id": tagData.hits.hits[0]._source.report[i].report_id,
                       "system": tagData.hits.hits[0]._source.report[i].system,
                       "application": tagData.hits.hits[0]._source.report[i].application,
                       "dashboardGroupName": tagData.hits.hits[0]._source.report[i].dashboard_group,
                       "dashboard": tagData.hits.hits[0]._source.report[i].dashboard,
                       "dashboardPageName": tagData.hits.hits[0]._source.report[i].dashboard_page_name,
                       "reportName": tagData.hits.hits[0]._source.report[i].report_name,
                       "averageRanking": averageRanking,
                       "totalUsers": totalUsers,
                       "totalCount": totalCount
                     });
                     
                    }
          }
		}
	
		
  }]);
