angular
    .module('powermeApp')
    .controller('ab',function($scope,$rootScope,averageRankingService,$http,ngTableParams){
   

    
    $scope.keyAssets = [{
        "dashboard_name": "Deal Analytics Landing Page",
        "application_Name": "Tableau",
    },{
        "dashboard_name": "Pricing Analytics What If",
        "application_Name": "Tableau",
    },{
        "dashboard_name": "Match between lead id and opportunity id",
        "application_Name": "Compass",
    },{
        "dashboard_name": "EUC Dashboard",
        "application_Name": "Tableau",
    },{
        "dashboard_name": "Users by Group and Data Sources by Project",
        "application_Name": "Tableau",
    },{
        "dashboard_name": "Decomission",
        "application_Name": "Tableau",
    }];
    
    $scope.spliceOut = function(item){
        $scope.keyAssets.splice(item,1);
    }
    
});