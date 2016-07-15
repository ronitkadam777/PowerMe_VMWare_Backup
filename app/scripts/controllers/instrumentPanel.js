angular
    .module('powermeApp')
    .controller('instrumentPanel',function($scope, $moment, $rootScope, $http, averageRankingService, $moment){
    
    $scope.selectedSystems = [];
    $scope.selectedApplications = [];
    $scope.selectedDate = [];
    var obiee_checker = document.getElementById('OBIEE');
    
    $scope.filterSystem = function(select){
        $scope.selectedSystems = select;
        
        if(($scope.selectedSystems.indexOf("OBIEE") !== -1) && ($scope.selectedSystems.indexOf("TABLEAU") === -1)){
            $scope.options.applicationNames = ["VMDash", "Compass", "Entitlement", "BU", "MDM", "Web-Flash"];
            $scope.filterApplication($scope.options.applicationNames);
        }
        if(($scope.selectedSystems.indexOf("OBIEE") === -1) && ($scope.selectedSystems.indexOf("TABLEAU") !== -1)){
            $scope.options.applicationNames = ["Tableau-Production"];
            $scope.filterApplication($scope.options.applicationNames);
        }
        if(($scope.selectedSystems.indexOf("OBIEE") === -1) && ($scope.selectedSystems.indexOf("TABLEAU") === -1)){
            $scope.options.applicationNames = [];
            $scope.filterApplication($scope.options.applicationNames);
        }
        if(($scope.selectedSystems.indexOf("OBIEE") !== -1) && ($scope.selectedSystems.indexOf("TABLEAU") !== -1)){
            $scope.options.applicationNames = ["VMDash", "Compass", "Entitlement", "BU", "MDM", "Web-Flash","Tableau-Production"];
            $scope.filterApplication($scope.options.applicationNames);
        }
        
    };
    
    $scope.filterApplication = function(select){
        $scope.selectedApplications = select;
    };
    
    $rootScope.selectedDate = function(dateParams){
        $scope.selectedDate = dateParams;
    }
    
    //System Checkboxes
    $rootScope.query = {"size": 0, "aggs" : { "System_Names" : { "terms" : { "field" : "repository_name", "size":0 }}}};
    var systemNames = averageRankingService(environment.apiUri+'/powerme/statistics/_search');
    systemNames = JSON.parse(systemNames);
    $scope.systemNames = [];
    $scope.systems = "";
    
    for(var i=0; i< systemNames.aggregations.System_Names.buckets.length; i++){
        $scope.systemNames[i] = systemNames.aggregations.System_Names.buckets[i].key;
        if(i < systemNames.aggregations.System_Names.buckets.length - 1){
            $scope.systems += '"'+$scope.systemNames[i]+'",';    
        }
        else {
            $scope.systems += '"'+$scope.systemNames[i]+'"';    
        }
    }
    
    $scope.options = {
        systemNames: []
    };

   
  //On Page Load
  //$scope.filterSystem($scope.options.systemNames);
  
  //On All-Click
  $scope.checkAllSystems = function() {
    $scope.options.systemNames = angular.copy($scope.systemNames);
      $scope.filterSystem($scope.options.systemNames);
  };
  //On All-Unclick
  $scope.uncheckAllSystems = function() {
    $scope.options.systemNames = [];
      $scope.filterSystem($scope.options.systemNames);
  };
    
  //Application Checkboxes
    $rootScope.query = {"size": 0, "aggs" : { "Application_Names" : { "terms" : { "field" : "applications/sites.application/site_id", "size":0 }}}};
    var applicationNames = averageRankingService(environment.apiUri+'/powerme/systems/_search');
    applicationNames = JSON.parse(applicationNames);
    $scope.applicationNames = [];
    $scope.applications = "";
    
    for(var i=0; i< applicationNames.aggregations.Application_Names.buckets.length; i++){
        $scope.applicationNames[i] = applicationNames.aggregations.Application_Names.buckets[i].key;
        if(i < applicationNames.aggregations.Application_Names.buckets.length - 1){
            $scope.applications += '"'+$scope.applicationNames[i]+'",';    
        }
        else {
            $scope.applications += '"'+$scope.applicationNames[i]+'"';    
        }
    }
    
    $scope.options = {
        applicationNames: []
    };

  //On Page Load
  //$scope.filterApplication($scope.options.applicationNames);
  //On All-Click
  $scope.checkAllApplications = function() {
    $scope.options.applicationNames = angular.copy($scope.applicationNames);
      $scope.filterApplication($scope.options.applicationNames);
      
  };
  //On All-Unclick
  $scope.uncheckAllApplications = function() {
    $scope.options.applicationNames = [];
      $scope.filterApplication($scope.options.applicationNames);
  };
    
//On Plot Button Click 
$scope.plot = function(){
    $scope.chartPlot($scope.selectedSystems,$scope.selectedApplications,$scope.selectedDate);
    $('#myModal').modal('toggle');
}

//Define All Charts here !
$scope.chartPlot = function(systems, applications, dates){
    
        var startDate = "";
        var endDate = "";
        var systemsLowerCase = [];
    
        if(dates === "" && (systems.length !== 0 || applications.length !== 0)){
            startDate = "2005-1-01";
            endDate = $moment().format('D-MMM-YYYY');
        }
    
        if(dates !== "" && systems.length === 0 && applications.length === 0){
            $scope.checkAllSystems();
            systems = $scope.options.systemNames;
            startDate = dates[0];
            endDate = dates[1];
        }
    
        else{
            
            startDate = dates[0];
            endDate = dates[1];
        }
        
        for(var i=0; i<systems.length; i++){
            systemsLowerCase.push(systems[i].toLowerCase());
        }
    
    //Card 1
    $rootScope.query = { "size": 10000, "query": { "bool": { "should": [ { "terms": { "applications/sites.application/site_id": applications }},{ "terms": { "system_name": systemsLowerCase } } ] } }, "fields": [ "applications/sites.group.dashboard_group_name" ]};
       var data1 = averageRankingService(environment.apiUri+'/powerme/systems/_search');
       data1 = JSON.parse(data1);
        var Dashboard_Group_Count_Card = 0;
        var Dashboard_Group_Names = [];
        for(var i=0; i<data1.hits.hits.length;i++){
        	var Test_Name = data1.hits.hits[i].fields['applications/sites.group.dashboard_group_name'][0];
            	if((Dashboard_Group_Names.indexOf(Test_Name))=== -1){
                		Dashboard_Group_Names.push(Test_Name);
            	}else{
            		continue;
                	}
            }
        $scope.SubjectAreaCount = Dashboard_Group_Names.length;
    
    
    //Card 2
    $scope.applicationCount = applications.length;
    
    
    //Card 3
    $rootScope.query = { "size": 10000, "query": { "bool": { "should": [ { "terms": { "applications/sites.application/site_id": applications }},{ "terms": { "system_name": systemsLowerCase } } ] } }, "fields": [ "applications/sites.group.dashboards.dashboard_id" ]};
       var data1 = averageRankingService(environment.apiUri+'/powerme/systems/_search');
       data1 = JSON.parse(data1);
        var Dashboard_Count_Card = 0;
        var Dashboard_Names = [];
        for(var i=0; i<data1.hits.hits.length;i++){
        	var Test_Name = data1.hits.hits[i].fields['applications/sites.group.dashboards.dashboard_id'][0];
            	if((Dashboard_Names.indexOf(Test_Name))=== -1){
                		Dashboard_Names.push(Test_Name);
            	}else{
            		continue;
                	}
            }
        $scope.dashboardCount = Dashboard_Names.length;
    
    //Card 4
    $rootScope.query = { "size": 10000, "query": { "bool": { "should": [ { "terms": { "applications/sites.application/site_id": applications }},{ "terms": { "system_name": systemsLowerCase } } ] } }, "fields": [ "applications/sites.group.dashboards.dashboard_pages.reports.report_id" ]};
       var data1 = averageRankingService(environment.apiUri+'/powerme/systems/_search');
       data1 = JSON.parse(data1);
        var Reports_Card = 0;
        var Reports_Names = [];
        for(var i=0; i<= data1.hits.hits.length; i++){
		                  	  if(data1.hits.hits[i]!=undefined){
		                  		  if(data1.hits.hits[i].fields!=undefined){
		                  			  Reports_Card += data1.hits.hits[i].fields["applications/sites.group.dashboards.dashboard_pages.reports.report_id"].length;
		                        	}
		                  	  }
		                  }
     
        $scope.reportCount = Reports_Card;
    
    
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
    $scope.checkAllSystems();
    $scope.checkAllApplications();
    $scope.chartPlot($scope.selectedSystems,$scope.selectedApplications,$scope.selectedDate);
});

//Create a function to combine all 3 filter fields and form a JSON and store it as a $scope.variable
//onclick of Plot, pass this $scope.variable {query} to another function that will chart
