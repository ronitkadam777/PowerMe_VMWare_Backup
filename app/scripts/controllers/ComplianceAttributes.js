angular
    .module('powermeApp')
    .controller('ComplianceAttributesCtrl',function($scope, $moment, $rootScope, $http, averageRankingService, $moment, $cookieStore){
      $scope.spinnerOn = true;
      $scope.complianceType = "attribute";
      $http.get('http://localhost:8080/export/AttributeNavigator')
        .success(function(res){
            
            $scope.attributes = [];
            $scope.attributeNavigator = [];
            
            angular.forEach(res, function(obj,id){
                //var attribute_name = obj;

                $scope.attributes.push({name: id, ticked:false});
                angular.forEach(obj, function(obj1,id1){

                    $scope.attributeNavigator.push({
                        attribute_Name:id,
                        dashboard_key:id1,
                        dashboard_name:obj1
                    });
                });
            });
        })
        .error(function(err){
            console.log(err);
        }); 
    
    //Get All Date Aggregated Compliance Info for Charts
    $http.get('http://localhost:8080/export/complianceCharts')
        .success(function(res){
            $scope.compliance_Date_Aggregated = res;
        })
        .error(function(err){
            console.log(err);
        }); 
    
    //Get All User Aggregated Compliance Info for Charts
    $http.get('http://localhost:8080/export/complianceTable')
        .success(function(res){
            $scope.compliance_User_Aggregated = res;
            $scope.spinnerOn = false;
        })
        .error(function(err){
            console.log(err);
        }); 
    
    
    //Output of Key Asset PickList
    $scope.selectedAttributesClose = function(){
        $scope.dbKeys_of_selected_Attributes = [];
        for(var i=0; i< $scope.selectedAttributes.length; i++){
            for(var j=0; j< $scope.attributeNavigator.length; j++){
                if($scope.selectedAttributes[i].name === $scope.attributeNavigator[j].attribute_Name){
                    $scope.dbKeys_of_selected_Attributes.push($scope.attributeNavigator[j].dashboard_key);
                }
            }
        }
    
        console.log($scope.dbKeys_of_selected_Attributes);
        $scope.dataForAssetChart();
        $scope.dataForAssetTable();
    }  
    
    

    
    
    $scope.dataForAssetChart = function(){
        
        var Compliance_KeyAssets = [];
        for(var i=0; i< $scope.dbKeys_of_selected_Attributes.length; i++){
            var specificDashboardKey = $scope.dbKeys_of_selected_Attributes[i];
            var dashboard_key = $scope.compliance_Date_Aggregated[specificDashboardKey];
            var specificDashboardKey = $scope.dbKeys_of_selected_Attributes[i];
            var seperator = specificDashboardKey.indexOf("@");
            var specificDashboardKey = specificDashboardKey.substring(seperator+1,specificDashboardKey.length);
            var dataForVendorChart = [];
            var dataForFTEChart = [];
             angular.forEach(dashboard_key, function(obj1,id1){
                   var date = id1; 
                   var date8A = moment(date,"YYYY-M-DD").format("YYYY,M,DD");
                      date8A = date8A.split(',');
                      var month = date8A[1] - 1;
                      var dateFormat = Date.UTC(date8A[0], month, date8A[2]);
                   var dayAggregatedVendorCount = obj1.dayAggregatedVendorCount;
                   var dayAggregatedtotalFTECount = obj1.dayAggregatedtotalFTECount;
                   dataForVendorChart.push([
                       dateFormat,dayAggregatedVendorCount
                   ]);
                  dataForFTEChart.push([
                       dateFormat,dayAggregatedtotalFTECount
                   ]);
                 dataForVendorChart.sort(function(a,b){return a[0] > b[0]});
                 dataForFTEChart.sort(function(a,b){return a[0] > b[0]});
                });
            Compliance_KeyAssets.push({name:specificDashboardKey+" Vendor",data:dataForVendorChart});
            Compliance_KeyAssets.push({name:specificDashboardKey+" FTE",data:dataForFTEChart});     
        }
        
        angular
            .element('#ComplianceAttributesChart')
            .highcharts({
                          chart: {
                            zoomType: 'x'

                          },
                          title: {
                            text: 'Vendor v/s Leave Compliance Issues'
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
                            allowDecimals: false,
                            title: {
                              text: '# of Compliance Issues'
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
                          series: Compliance_KeyAssets
                        });

                };
    
    $scope.dataForAssetTable = function(){
        $scope.sortType = 'user_name';
        $scope.sortReverse = true;
        $scope.ComplianceTable_Attributes = [];
        for(var i=0; i< $scope.dbKeys_of_selected_Attributes.length; i++){
            var specificDashboardKey = $scope.dbKeys_of_selected_Attributes[i];
            var dashboard_key = $scope.compliance_User_Aggregated[specificDashboardKey];
            var specificDashboardKey = $scope.dbKeys_of_selected_Attributes[i];
            var primaryKey = specificDashboardKey;
            var seperator = specificDashboardKey.indexOf("@");
            var specificDashboardKey = specificDashboardKey.substring(seperator+1,specificDashboardKey.length);
            var application_Name = primaryKey.substring(0,seperator);
            //console.log("applicationName "+application_Name);
            if(application_Name.split("-")[1]!== undefined){
                var res = application_Name.split("-");
                //console.log(specificDashboardKey+" "+res[1]);
                application_Name = res[1];
            }
            else{
                //console.log(specificDashboardKey+" "+"Tableau");
                application_Name = "Tableau";
            }
            
            console.log(specificDashboardKey);
            angular.forEach(dashboard_key, function(obj1,id1){
                   var userTypeConcat = id1;
                    var seperator = userTypeConcat.split("@");
                    console.log(obj1.userTypeConcat);
                    var obj = obj1.timestampCount;
                    angular.forEach(obj, function(obj2,id2){
                        $scope.ComplianceTable_Attributes.push({
                            "dashboard_name": specificDashboardKey,
                            "application_Name": application_Name,
                            "user_name": seperator[0],
                            "type": seperator[1],
                            "date": id2,
                            "count": obj2
                        });
                    });
            });
        }
    };
        
});