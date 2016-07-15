var app = angular.module('powermeApp');

    app.config(function(ivhTreeviewOptionsProvider) {
         ivhTreeviewOptionsProvider.set({
           defaultSelectedState: false,
           validate: true,
           // Twisties can be images, custom html, or plain text
           twistieCollapsedTpl: '(+)',
           twistieExpandedTpl: '(-)',
           twistieLeafTpl: ''
        });
    });
   
    

    app.controller('DashboardCtrl',function($scope, $moment, $rootScope, $http, averageRankingService, $moment, $cookieStore, ivhTreeviewOptions, ivhTreeviewMgr){
    /*
    if(angular.isUndefined($cookieStore.get('loggedIn'))){
       
       $cookieStore.put('loggedIn','logInto');
        var date = new Date();
        var usageProfile = {
         username: $rootScope.currentUser.username,
         timestamp: date,
         fileSource: 'app'
       };
       $http
         .post(environment.apiUri + '/powerme/usageProfiling', usageProfile)
         .success(function (data) {
                    data._source = usageProfile;
                  })
         .error(function () {
                  console.log("error");
                });   
       
    }
    */
    
    //Populates the assets checkboxes
    $rootScope.query = { "size": 0, "aggs": { "system_names": { "terms": { "field": "system_name", "size": 0 }, "aggs": { "application_names": { "terms": { "field": "applications/sites.application/site_id", "size": 0 } } } } }};
    var system_applications = averageRankingService(environment.apiUri+'/powerme/systems/_search');
    system_applications = JSON.parse(system_applications);
        
    var treeStructure = [];
    
    $scope.new_selectedSystems = [];
    $scope.new_selectedApplications = [];    
        
    for(var i=0; i< system_applications.aggregations.system_names.buckets.length; i++){
        
        treeStructure.push(
        {
            label: system_applications.aggregations.system_names.buckets[i].key.toUpperCase(),
            value: system_applications.aggregations.system_names.buckets[i].key.toUpperCase(),
            selected: true,
            children: []
        });
        
        $scope.new_selectedSystems.push(system_applications.aggregations.system_names.buckets[i].key.toUpperCase());
        var children_length = system_applications.aggregations.system_names.buckets[i].application_names.buckets.length;
        for(j =0; j < children_length; j++){
            treeStructure[i].children.push({
                label: system_applications.aggregations.system_names.buckets[i].application_names.buckets[j].key,
                value: system_applications.aggregations.system_names.buckets[i].application_names.buckets[j].key,
                selected: true
            
            });
            $scope.new_selectedApplications.push(system_applications.aggregations.system_names.buckets[i].application_names.buckets[j].key);
        }
    }
    
    $scope.filterAssets = treeStructure;
   
     //Executed everytime a new selection is made  
     $scope.onToggle = function(node){
         
         $scope.new_selectedSystems = [];
         $scope.new_selectedApplications = [];
        //console.log("node "+JSON.stringify(node)+" has been made ");
        
         for(var i=0; i< node.length; i++){
            if(node[i].selected === true){
                 $scope.new_selectedSystems.push(node[i].label);
                //console.log(node[i].label); 
             }
             if(node[i].children.length > 0){
                 for(var j=0; j< node[i].children.length; j++){
                     if(node[i].children[j].selected === true){
                        //console.log(node[i].children[j].label);    
                        $scope.new_selectedApplications.push(node[i].children[j].label); 
                     }
                 }
              }
         }
    };    
        
         /*
         console.log("--------------------");
         console.log($scope.new_selectedSystems);
         console.log($scope.new_selectedApplications);
         */

//On Plot Button Click 
$scope.plot = function(){
  
    $scope.chartPlot($scope.new_selectedSystems,$scope.new_selectedApplications,$rootScope.selectedDate);
    $('#myModal').modal('toggle');
}

//Define All Charts here !
$scope.chartPlot = function(systems, applications, dates){
        
         //First time load, or when no selection is made in the timeline filter
         if($rootScope.selectedDate === undefined){
            var dates = ["2010-01-1","2016-07-31"];
        }
    
        var startDate = "";
        var endDate = "";
        var systemsLowerCase = [];
       
            startDate = dates[0];
            endDate = dates[1];
        
        for(var i=0; i<systems.length; i++){
            systemsLowerCase.push(systems[i].toLowerCase());
        }
    
    //Card 1
   
    $rootScope.query = { "size": 0, "aggs": { "genres": { "terms": { "field": "applications/sites.group.dashboard_group_name","size":0 } } } };
    var data = averageRankingService(environment.apiUri+'/powerme/systems/_search');
    data = JSON.parse(data);
    $scope.SubjectAreaCount = data.aggregations.genres.buckets.length;
    
    
    //Card 2
    $scope.applicationCount = applications.length;
    
    
    //Card 3
    $rootScope.query = { "size": 0, "aggs": { "genres": { "terms": { "field": "applications/sites.group.dashboards.dashboard_id","size":0 } } } };
    var data = averageRankingService(environment.apiUri+'/powerme/systems/_search');
    data = JSON.parse(data);
    
    $scope.dashboardCount = data.aggregations.genres.buckets.length;
    
    
    
    //Card 4
    
    $rootScope.query = { "size": 0, "aggs": { "genres": { "terms": { "field": "applications/sites.group.dashboards.dashboard_pages.reports.report_id","size":0 } } } };
    var data = averageRankingService(environment.apiUri+'/powerme/systems/_search');
    data = JSON.parse(data);
    
    $scope.reportCount = data.aggregations.genres.buckets.length;
    
    
    
    
        $scope.chart1_names = [];
        $scope.chart1_count = [];
        $rootScope.query = { "size": 0, "query": { "bool": { "must" : [ { "range": { "date": { "gte": startDate } } }, { "range": { "date": { "lte": endDate } } }, { "bool" : { "should" : [ { "terms" : {"repository_name" : systems}}, { "terms" : {"application" : applications}} ] }} ], "must_not": [ { "terms": { "_dbname": [ "NA", "", "Welcome", "1. Welcome", "SSI-IB" ] } } ] } }, "aggs": { "dashboard_names": { "terms": { "field": "repositories.applications.subject-areas.dashboards._dbname", "order": { "result.value": "desc" }, "size": 10 }, "aggs": { "result": { "sum": { "field": "repositories.applications.subject-areas.dashboards._dbcount" } } } } }};
        var data = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
        data = JSON.parse(data);
                for (var i = 0; i < data.aggregations.dashboard_names.buckets.length; i++) {
                    $scope.chart1_names.push(data.aggregations.dashboard_names.buckets[i].key);
                    $scope.chart1_count.push(data.aggregations.dashboard_names.buckets[i].result.value);                        }
        angular
            .element('#Chart1')
            .highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Top 10 Dashboards by Number of Hits',
                    style: {
                         display: 'none'
                    }
                },

                xAxis: {
                    categories: $scope.chart1_names,

                	crosshair: true,
                	labels: {
                		//autoRotation: false
                        rotation: 0
                	},
                	offset: 0
                    
                },
                legend: {

                    enabled: false
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: '# of Dashboard Hits',
                        align: 'low'
                    },
                	
                	labels: {
                		autoRotation: false
                	},
                	offset: 0
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">Dashboard Hits: </td>' + '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                     coloumn: {
                        datalabels:{
                        	enabled:true
                        }
                    }
                },
                credits:{
                  enabled: false  
                },
                series: [{
                    name: 'Dashboards',
                    data: $scope.chart1_count,
                    color: '#7CB5EC',
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y}', // one decimal
                        x: 0, // 10 pixels down from the top
                        style: {
                            fontSize: '10px',
                            textShadow: false, 
                            fontFamily: '"Tahoma", sans-serif'
                        }
                    }

                }]
            });
    
    
        $scope.chart2_names = [];
        $scope.chart2_count = [];
        $rootScope.query = { "size": 0, "aggs": { "fl": { "filter": { "bool": { "must" : [ { "range": { "date": { "gte": startDate } } }, { "range": { "date": { "lte": endDate } } }, { "bool" : { "should" : [ { "terms" : {"repository_name" : systems}}, { "terms" : {"application" : applications}} ] }} ], "must_not": [ { "terms": { "_dbname": [ "NA", "", "Welcome", "SSI-IB", "1. Welcome" ] } } ] } }, "aggs": { "db": { "terms": { "field": "_dbname", "size": 10, "order": { "users.value": "desc" } }, "aggs": { "users": { "cardinality": { "field": "_name", "precision_threshold": 40000 } } } } } } }};
        var data = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
        data = JSON.parse(data);
                for (var i = 0; i < data.aggregations.fl.db.buckets.length; i++) {

		        	$scope.chart2_names.push(data.aggregations.fl.db.buckets[i].key);
		            $scope.chart2_count.push(data.aggregations.fl.db.buckets[i].users.value);

                }

     angular
            .element('#Chart2')
            .highcharts({
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Top 10 Dashboards by Number of Hits',
                    style: {
                         display: 'none'
                    }
                },

                xAxis: {
                    categories: $scope.chart2_names,

                	crosshair: true,
                	labels: {
                		//autoRotation: false
                        rotation: 0
                	},
                	offset: 0
                    
                },
                legend: {

                    enabled: false
                },

                yAxis: {
                    min: 0,
                    title: {
                        text: '# of Unique Users',
                        align: 'low'
                    },
                	
                	labels: {
                		autoRotation: false
                	},
                	offset: 0
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">Dashboard Hits: </td>' + '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                     coloumn: {
                        datalabels:{
                        	enabled:true
                        }
                    }
                },
                credits:{
                  enabled: false  
                },
                series: [{
                    name: 'Dashboards',
                    data: $scope.chart2_count,
                    color: '#7CB5EC',
                    dataLabels: {
                        enabled: true,
                        rotation: 0,
                        color: '#FFFFFF',
                        align: 'right',
                        format: '{point.y}', // one decimal
                        x: 0, // 10 pixels down from the top
                        style: {
                            fontSize: '10px',
                            textShadow: false, 
                            fontFamily: '"Tahoma", sans-serif'
                        }
                    }

                }]
            });
    
    $scope.chart3_names = [];
    $scope.chart3_count = [];
    $scope.Chart3_FinalData = [];
    var colorArray = ['#B3B7AF','#89CBDF', '#6F736B', '#3F4E62', '#C2CD23', '#3A7C2C', '#6DB33F'];
    
    for(var i=0; i< applications.length; i++){
        
        $rootScope.query = { "size": 0, "query": { "bool": { "must" : [ { "range": { "date": { "gte": startDate } } }, { "range": { "date": { "lte": endDate } } }, { "bool" : { "should" : [ { "terms" : {"application" : [applications[i]]}} ] }} ], "must_not": [ { "terms": { "_dbname": [ "NA", "", "Welcome", "1. Welcome", "SSI-IB" ] } } ] } }, "aggs": { "group_by_dbname": { "date_histogram": { "field": "date", "interval": "week" }, "aggs": { "sum_of_dbcount": { "terms": { "field": "_name", "size": 0 }}}}}};
        var chart3_usageHits = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
	    chart3_usageHits = JSON.parse(chart3_usageHits);
	    var dateFormat = [];
	   for (var j = 0; j < chart3_usageHits.aggregations.group_by_dbname.buckets.length; j++) {
            var date1 = moment(chart3_usageHits.aggregations.group_by_dbname.buckets[j].key_as_string,"YYYY-M-DD").format("YYYY,M,DD");
	            date1 = date1.split(',');
                var month = date1[1] - 1;
	            var date = Date.UTC(date1[0], month, date1[2]);    
                dateFormat.push([date,chart3_usageHits.aggregations.group_by_dbname.buckets[j].sum_of_dbcount.buckets.length]);
	       }
	                    		
	   $scope.Chart3_FinalData.push({
	        	name: applications[i] + " User Hits",
	        	data: dateFormat,
                color: colorArray[i]
	   });
        
    
    $rootScope.query = { "size": 0, "query": { "bool": { "must": [ { "range": { "date": { "gte": startDate } } }, { "range": { "date": { "lte": endDate } } }, { "bool": { "should": [ { "terms": { "application": [applications[i]] } } ] } } ], "must_not": [ { "terms": { "_dbname": [ "NA", "", "Welcome", "1. Welcome", "SSI-IB" ] } } ] } }, "aggs": { "group_by_dbname": { "date_histogram": { "field": "date", "interval": "week" }, "aggs": { "sum_of_dbcount": { "sum": { "field": "_dbcount" } } } } }};
        var chart3_dashboardHits = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
        chart3_dashboardHits = JSON.parse(chart3_dashboardHits);
        
	   	var dateFormat = [];
	   	for (var j = 0; j < chart3_dashboardHits.aggregations.group_by_dbname.buckets.length; j++) {
            var date1 = moment(chart3_dashboardHits.aggregations.group_by_dbname.buckets[j].key_as_string,"YYYY-M-DD").format("YYYY,M,DD");
	       date1 = date1.split(',');
	       var month = date1[1] - 1;
           var date = Date.UTC(date1[0], month, date1[2]);
	       dateFormat.push([date,chart3_dashboardHits.aggregations.group_by_dbname.buckets[j].sum_of_dbcount.value]);
          }

        $scope.Chart3_FinalData.push({
	          	name: applications[i]+" Dashboard Usage",
	          	data: dateFormat,
	          	color: colorArray[i]
        });

    }
    
     angular
         .element('#Chart3')
         .highcharts({
            chart: {
             zoomType: 'x',
             type: 'line'
            },
         title: {
            text: 'Compares Dashboard Hits & User Counts across Applications',
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

}

//On Page Load [Checks all Systems and Applications and plots a chart of the same]
    $scope.chartPlot($scope.new_selectedSystems,$scope.new_selectedApplications,$scope.selectedDate);
});
    