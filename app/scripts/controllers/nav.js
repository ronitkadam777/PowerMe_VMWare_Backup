'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:NavCtrl
 * @description # NavCtrl Controller of the powermeApp
 */

angular
    .module('powermeApp')
    .filter('removeSpaces', [ function() {
      return function(string) {
        if (!angular.isString(string)) {
          return string;
        }
        return string.replace(/[\s]/g, '');
      };
    } ])
    .controller(
                'NavCtrl',
                function($scope, $http, $sce, $rootScope, $location, $window,
                         $state, $filter,averageRankingService) {
                  $rootScope.tag_names = [];
                  $rootScope.query = {"size": 0,"aggs": {"agg1": {"terms": {"field": "tag_name","size": 0}}}};
          		  var data = averageRankingService(environment.apiUri + '/powerme/tags/_search?sort=tag_name');
          		  data = JSON.parse(data);  
          		  for(var i=0; i<data.aggregations.agg1.buckets.length; i++){
          			  
          			  $rootScope.tag_names[i]=data.aggregations.agg1.buckets[i].key;
          		  }
                  $scope.catalog = false;
                  $scope.opencatalog = function() {
                    // $("#tree1").removeClass("dropdown submenu");
                    $("#tree1").toggle();
                  }

                  $scope.getNodedetails = function(event, level) {
                    // alert('selcted'+level);
                    // $location.path('/AppInfo///department/Entitlement');
                    if (level == 1) {
                      // $window.location.hash='#/app//AppInfo///department/'+event.node.name+'';

                      $state.go('app.system', {
                        'system' : event.node.name
                      });

                    }
                    if (level == 2) {
                      // $window.location.hash='#/app//AppInfo///department/'+event.node.name+'';
                      $state.go('app.application', {
                        'system' : event.node.parent.name,
                        'application' : event.node.name
                      });
                    }
                    if (level == 3) {
                      $state.go('app.subjectarea', {
                        'system' : event.node.parent.parent.name,
                        'application' : event.node.parent.name,
                        'subjectArea' : event.node.name
                      });

                    }
                    if (level == 4) {
                      $state.go('app.dashboardInfo', {
                        'system' : event.node.parent.parent.parent.name,
                        'application' : event.node.parent.parent.name,
                        'subjectArea' : event.node.parent.name,
                        'dashboard' : event.node.name
                      });

                    }

                  }

                  $scope.oneAtATime = false;
                  $scope.innerHTML = "";
                  $scope.status = {
                    isFirstOpen : true,
                    isSecondOpen : true,
                    isThirdOpen : true
                  };
                  $scope.navigationMenu = [];
                  $scope.changeImage = function(powerMeLogoDisplayType) {
                    switch (powerMeLogoDisplayType) {
                      case "ORIGINAL": {
                        $rootScope.powerMeLogoDisplayType = "ORIGINAL HALF";
                        break;
                      }

                      case "ORIGINAL HALF": {
                        $rootScope.powerMeLogoDisplayType = "SMALL";
                        break;
                      }

                      case "SMALL": {
                        $rootScope.powerMeLogoDisplayType = "ORIGINAL";
                        break;
                      }

                      default: {
                        console.log("DEFAULT");
                        break;
                      }

                    }

                  }
                  $http
                      .post(
                            environment.apiUri+'/powerme/systems/_search',
                            {
                              "size" : 12000,
                              "fields" : [
                                          "system_name",
                                          "applications/sites.application/site_id",
                                          "applications/sites.group.dashboard_group_name",
                                          "applications/sites.group.dashboards.dashboard_name" ]
                            })
                      .success(
                               function(data) {
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
                                    	 var applicationName = data.hits.hits[j].fields["applications/sites.application/site_id"][0];
                                    	 if(applicationName==='VMDASH')
                                    		 applicationName = 'VMDash';
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

                                         if (n != (dashLength - 1))
                                           jsonFormation += ',';
                                       }

                                       jsonFormation += "]";
                                       if (k != (subjLength - 1))
                                         jsonFormation += ',';
                                     }

                                     jsonFormation += '}]';
                                     if (j != (depLength - 1))
                                       jsonFormation += ',';
                                   }

                                   jsonFormation += '}]';
                                   if (i != (sysLength - 1))
                                     jsonFormation += ',';

                                 }

                                 jsonFormation += '}';

                                 $scope.localCache = JSON.parse(jsonFormation);
                                 $rootScope.rootCache = $scope.localCache;

                                 /*---------------------------------------------------------------------------------------*/
                                 // alert('success func');
                                 // console.log(data);
                                 var set = new StringSet();
                                 var jsonData = new StringSet();
                                 var jsonFormation = "";

                                 for (var i = 0; i < data.hits.hits.length; i++) {
                                   if (data.hits.hits[i].fields != undefined) {
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

                                 jsonFormation += '['; // Opening Scope ////

                                 var sysLength = set.values().length; // Count
                                                                      // of
                                                                      // various
                                                                      // Systems
                                                                      // types
                                 // console.log(set.values());

                                 for (var i = 0; i < sysLength; i++) {
                                   jsonFormation += '{"' + "label" + '"' + ":"
                                                    + '"' + set.values()[i]
                                                    + '","children":[{'; // DONE
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
                                         var applicationName = data.hits.hits[j].fields["applications/sites.application/site_id"][0];
                                         // console.log(applicationName);
                                         if (applicationName === 1) {
                                           applicationName = "Tableau Production";
                                         }
                                        
                                    		 
                                         jsonData.add(applicationName); // On
                                                                        // match,
                                                                        // adds
                                                                        // Department
                                                                        // per
                                                                        // System

                                       }
                                     }

                                   }

                                   var depLength = jsonData.values().length;

                                   var brack = '';
                                   for (var j = 0; j < depLength; j++) {
                                     jsonFormation += '' + brack + '"'
                                                      + "label" + '"' + ":"
                                                      + '"'
                                                      + jsonData.values()[j]
                                                      + '","children":[{'; // DONE
                                     brack = '{';
                                     // jsonFormation +=
                                      // '"'+jsonData.values()[j]+'":{';
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
                                     var brack1 = '';
                                     var subjLength = subjectSet.values().length;
                                     for (var k = 0; k < subjLength; k++) {
                                       jsonFormation += ''
                                                        + brack1
                                                        + '"'
                                                        + "label"
                                                        + '"'
                                                        + ":"
                                                        + '"'
                                                        + subjectSet.values()[k]
                                                        + '","children":[{'; // DONE
                                       brack1 = '{';
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
                                       var brack2 = '';
                                       var dashLength = dashBoard.values().length;
                                       for (var n = 0; n < dashLength; n++) {
                                         jsonFormation += ''
                                                          + brack2
                                                          + '"'
                                                          + "label"
                                                          + '"'
                                                          + ":"
                                                          + '"'
                                                          + dashBoard.values()[n]
                                                          + '"}'; // DONE
                                         brack2 = '{';
                                         if (n != (dashLength - 1))
                                           jsonFormation += ',';
                                       }

                                       jsonFormation += "]}";
                                       if (k != (subjLength - 1))
                                         jsonFormation += ',';
                                     }

                                     jsonFormation += ']}'; // DONE
                                     if (j != (depLength - 1))
                                       jsonFormation += ',';
                                   }

                                   jsonFormation += ']}'; // DONE
                                   if (i != (sysLength - 1))
                                     jsonFormation += ',';

                                 }

                                 jsonFormation += ']'; // DONE
                                 // console.log(jsonFormation);
                                 $scope.treeCache = JSON.parse(jsonFormation);
                                 recursiveSortByLabel($scope.treeCache);
                                 var $tree = $('#tree1');
                                 $('#tree1').tree({
                                   data : $scope.treeCache
                                 });

				 $rootScope.catalogData = angular.copy($scope.treeCache);
                                 $('#tree1')
                                     .bind(
                                           'tree.select',
                                           function(event) {
                                             // The clicked node is
                                              // 'event.node'
                                             // alert('in');
                                             var node = event.node;
                                             console.log(event);
                                             $scope.getNodedetails(event, node
                                                 .getLevel());

                                           });

                               }).error(function() {
                        // alert('error');
                        console.log("error");
                      });
                  function recursiveSortByLabel(obj) {
                    if (obj.length > 0) {
                      //console.log("Array before sort : ", obj);
                      angular.forEach(obj, function(nav) {
                        if (nav.children != undefined
                            && nav.children.length > 0) {
                          nav.children = recursiveSortByLabel(nav.children);
                        }
                      })
                      // for(var i in obj){
                      // if(obj[i].children!=undefined && obj[i].children.length
                      // > 0)
                      // recursiveSortByLabel(obj[i].children);
                      // console.log("Array to sort : ", obj);
                      // $filter('orderBy')(obj,'label', false);
                      // }
                      //console.log("Array after sort : ", $filter('orderBy')(obj, 'label', false));
                      return $filter('orderBy')(obj, 'label', false);
                    }
                    return obj;
                  }

                  function bubbleSortLabel(arr) {
                    for (var i = arr.length; i > 1; i--) {
                      for (var j = 0; j < i - 1; j++) {
                        if (arr[j].label > arr[j + 1].label)
                          swap(arr, j, j + 1);
                      }
                    }
                  }

                  function swap(arr, i, j) {
                    var tmp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = tmp;
                  }
                  var StringSet = function() {
                    var setObj = {}, val = {};

                    this.add = function(str) {
                      setObj[str] = val;
                    };

                    this.contains = function(str) {
                      return setObj[str] === val;
                    };

                    this.remove = function(str) {
                      delete setObj[str];
                    };

                    this.values = function() {
                      var values = [];
                      for ( var i in setObj) {
                        if (setObj[i] === val) {
                          values.push(i);
                        }
                      }
                      return values;
                    };
                  }
                });
