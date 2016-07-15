'use strict';

/**
 * @ngdoc function
 * @name sankeyTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sankeyTestApp
 */
angular.module('powermeApp')
  .controller("DataDictionaryCtrl",
              ['$scope', '$rootScope', '$http', '$location', '$filter', '$stateParams', 'ngTableParams', 'Universe',
               function ($scope, $rootScope, $http, $location, $filter, $stateParams, ngTableParams, Universe) {

             	 $scope.showBinaryTree = false;
            	 $scope.showChartBtns = false;
            	 $scope.showTable = false;
            	 $scope.bubbleView = true;
            	 
                 $scope.universe = {
                   nodeMap: {},
                   nodes: [],
                   links: [],
                   chart: 'bubble'
                 }
                 $scope.treeData = {};

                 var n = d3.select('div.popup').style("opacity", 0);

                 var d = function () {
                   n.transition().duration(500).style("opacity", 0);
                 }

                 var c = function (a) {
                   n.transition().duration(200).style("opacity", .95);
                   a.node_type = a.node_type || 'Class';
                   var html = '<div class="popup-title">' + a.node_type +
                     '</div><form><div class="form-group"><label class="control-label">Name</label><p>' +
                     a.name + '</p></div>';
                   if (a.node_type == 'Universe') {
                     html += '<div class="form-group"><label class="control-label">Universe Path</label><p>' + a.univ_path + '</p></div><div class="form-group"><label class="control-label">Classes</label><p>' + a.classes + '</p></div>'
                   } else if (a.node_type == 'Class') {
                     html += '<div class="form-group"><label class="control-label">Parent Class</label><p>' + a.parent_class + '</p></div><div class="form-group"><label class="control-label">Description</label><p>' + a.description + '</p></div>'
                   }
                   html += '</form>';
                   n.html(html).style("left",
                                      ($scope.universe.chart === 'bubble' ? a.x + a.parent.x :
                                        a.x) + 15 + "px")
                     .style("top", d3.event.pageY - 28 + "px");
                 }

                 $scope.filterBy = $rootScope.globalSearch;
                 $scope.universe.data = $filter('filter')($rootScope.universes,
                                                          {Universe_Id: $stateParams.universeId})[0];
                 ;

                 $scope.tableParams = new ngTableParams({
                   count: 10,           // count per page
                   sorting: {
                     Class_Name: 'asc'
                   }
                 }, {
                   counts: [],
                   getData: function ($defer, params) {
                     var orderedData = $scope.filterBy ?
                       $filter('filter')($scope.universe.data.Classes, $scope.filterBy) : $scope.universe.data.Classes;
                     orderedData = params.sorting() ?
                       $filter('orderBy')(orderedData, params.orderBy()) :
                       orderedData;
                     params.total(orderedData.length);
                     $defer.resolve(orderedData.slice((params.page() - 1) * params.count(),
                                                      params.page() * params.count()));
                   }
                 });

                 //TODO : enable this for bubble
                 //bubble();

                 //$http.get('scripts/jsons/Universe.json')
                 //  .success(function (data) {
                 //    angular.extend($scope.universe, {
                 //      data: data
                 //    });
                 //    bubble();
                 //  });

                 $scope.filterChange = function () {
                     $scope.showBinaryTree = false;
                	 $scope.showTable = false;
                	 $scope.showChartBtns = false;
                	 
                     //bubble();
                     d3.select('#sankey').style("display", "none");
                     d3.select('.bubble').style("display", "");
                     $scope.tableParams.reload();
                 }
                 
                 function bubbleOrTableView() {
                	 
                 }

                 function bubble() {
                     //d3.select('.sankey').style("display", "none");
                     d3.select('#sankey').style("display", "none");
                   d3.select('.bubble').style("display", "");
                   $scope.universe.chart = 'bubble';
                   
                   
                   
                   var container = d3.select("#bubble");
                   var width = 960, height = 960,
                     format = d3.format(",d"),
                     color = d3.scale.category20();
                   
                   var bubble = d3.layout.pack()
                     .sort(null)
                     .size([width, height])
                     .padding(1.5);
                   
                   var root = {
                     name: $scope.universe.data.Universe_Name,
                     children: $scope.filterBy ?
                       $filter('filter')($scope.universe.data.Classes,
                                         function (elm, index, array) {
                                           var b = angular.lowercase(elm.Class_Name).indexOf(
                                               angular.lowercase($scope.filterBy)) != -1
                                             || $filter('filter')(elm.Objects,
                                                                  {'Object_Name': $scope.filterBy}).length > 0;
                                           if (!b) {
                                             angular.forEach(elm.Objects, function (obj) {
                                               b = $filter('filter')(obj.Tables,
                                                                     {'Table_Name': $scope.filterBy}).length > 0;
                                               if (!b) {
                                                 angular.forEach(elm.Tables, function (obj) {
                                                   b = $filter('filter')(obj.Columns,
                                                                         {'Column_Name': $scope.filterBy}).length > 0;
                                                 })
                                               }
                                             })
                                           }
                                           return b;
                                         }, $scope.filterBy) :
                       $scope.universe.data.Classes
                   }
                   
                   d3.select("svg").remove();
                   var svg = d3.select("#bubble").append("svg")
                     .attr("width", width)
                     .attr("height", height)
                     .attr("class", "bubble");
                   
                   angular.forEach(root.children, function (clz) {
                     clz.value = clz.Objects ? clz.Objects.length : 0.1;
                     clz.name = clz.Class_Name;
                   });
                   
                   var node = svg.selectAll(".node")
                     .data(bubble.nodes(root))
                     .enter().append("g")
                     .attr("class", "node")
                     .attr("transform", function (d) {
                       return "translate(" + d.x + "," + d.y + ")";
                     })
                     .on("mouseover", function (a) {
                       if (!a.children) {
                         c(a);
                       }
                     })
                     .on("mouseout", function (a) {
                       d(a);
                     })
                     .on("click", function (a) {
                       if (!a.children) {
                         sankey(a);
                       }
                     });
                   
                   node.append("circle")
                     .attr("r", function (d) {
                       return d.r;
                     })
                     .style("fill", function (d) {
                       return d.color = (d.children ? '#eeeeee' : color(d.name));
                     });
                   
                   node.append("text")
                     .attr("dy", ".3em")
                     .style("text-anchor", "middle")
                     .style("fill", function (d) {
                       return d3.rgb(d.color).darker(1);
                     })
                     .text(function (d) {
                       return d.children ? '' : d.value;
                     });
                 }

                 $scope.showSankey = function (cls) {
                   $scope.cls = cls;
                   $scope.showChartBtns = true;
                   sankey(cls);
                 }
                 
                 ////////////////JPPPP starttttttttttttt
                 
                 

                 $scope.tableView = function () {

                 	 $scope.showBinaryTree = false;
                     d3.select('.bubble').style("display", "none");
                     d3.select('#sankey').style("display", "none");
                	 $scope.showTable = true;
                	 
                	 $scope.treedata = processData($scope.treeData);
                	 //$scope.treedata = $scope.expandViewData;
                	 $scope.expandedNodes = [$scope.treedata.children[0]];

		             $scope.showSelected = function(sel) {
		                 $scope.selectedNode = sel;
		             };
             	   
		             //$scope.selectNodeHead();
                 }

                 $scope.loadSankey = function () {
                   $scope.showChartBtns = true;
                   sankey($scope.cls);
                 }
                 
                 $scope.binaryTreeView = function () {                	 
                	 $scope.showTable = false;
                     d3.select('.bubble').style("display", "none");
                     d3.select('#sankey').style("display", "none");
                	 $scope.showBinaryTree = true;

                     var data = processData($scope.treeData);
                     $scope.loadTree(data);
                 }
                 

                 $scope.loadTree = function(data) {
                	 var vHeight = $scope.universe.countForHeight*15; 
                	 console.log(vHeight + ' : vHeight : '+$scope.universe.countForHeight*15)
                	 var m = [20, 120, 20, 120],
             	    	 w = 1280 - m[1] - m[3],
                	 	 h = Math.max(vHeight, 800) - m[0] - m[2];
                 	     //h = 800 - m[0] - m[2];
                	 $scope.i = 0;

                	$scope.tree = d3.layout.tree()
                	    .size([h, w]);

                	$scope.diagonal = d3.svg.diagonal()
                	    .projection(function(d) { return [d.y, d.x]; });
                	d3.select("#collapsibleTree svg").remove();

                	$scope.vis = d3.select("#collapsibleTree").append("svg:svg")
                	    .attr("width", w + m[1] + m[3])
                	    .attr("height", h + m[0] + m[2])
                	  .append("svg:g")
                	    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");
                	
                     	  var root = data;
                     	  root.x0 = h / 2;
                     	  root.y0 = 0;

                     	  function toggleAll(d) {
                     	    if (d.children) {
                     	      d.children.forEach(toggleAll);
                     	      toggle(d);
                     	    }
                     	  }

                     	  // Initialize the display to show a few nodes.
                     	  root.children.forEach(toggleAll);

                     	  toggle(root.children[0]);
                     	  for(var ic in root.children[0].children){
                     	  	toggle(root.children[0].children[ic]);
                     	  }
                     	  toggle(root.children[0].children[0].children[0]);
                     	  /*toggle(root.children[1]);
                     	  toggle(root.children[1].children[2]);
                     	  toggle(root.children[9]);
                     	  toggle(root.children[9].children[0]);*/

                     	 $scope.rootValue = root;
                     	 update(root);

                 }
                 
                 

                 function update(source) {
                   var duration = d3.event && d3.event.altKey ? 5000 : 500;

                   // Compute the new tree layout.
                   var nodes = $scope.tree.nodes($scope.rootValue).reverse();

                   // Normalize for fixed-depth.
                   nodes.forEach(function(d) { d.y = d.depth * 180; });

                   // Update the nodes…
                   var node = $scope.vis.selectAll("g.node")
                       .data(nodes, function(d) { return d.id || (d.id = ++$scope.i); });

                   // Enter any new nodes at the parent's previous position.
                   var nodeEnter = node.enter().append("svg:g")
                       .attr("class", "node")
                       .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                       .on("click", function(d) { toggle(d); update(d); });

                   nodeEnter.append("svg:circle")
                       .attr("r", 1e-6)
                       .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                   nodeEnter.append("svg:text")
                       .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
                       .attr("dy", ".35em")
                       .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
                       .text(function(d) { return d.name; })
                       .style("fill-opacity", 1e-6);

                   nodeEnter.append("svg:title")
                   .text(function(d) {
                     return d.name + '\n' + d.type;
                   });
                   
                   // Transition nodes to their new position.
                   var nodeUpdate = node.transition()
                       .duration(duration)
                       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

                   nodeUpdate.select("circle")
                       .attr("r", 4.5)
                       .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

                   nodeUpdate.select("text")
                       .style("fill-opacity", 1);

                   // Transition exiting nodes to the parent's new position.
                   var nodeExit = node.exit().transition()
                       .duration(duration)
                       .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
                       .remove();

                   nodeExit.select("circle")
                       .attr("r", 1e-6);

                   nodeExit.select("text")
                       .style("fill-opacity", 1e-6);

                   // Update the links…
                   var link = $scope.vis.selectAll("path.link")
                       .data($scope.tree.links(nodes), function(d) { return d.target.id; });

                   // Enter any new links at the parent's previous position.
                   link.enter().insert("svg:path", "g")
                       .attr("class", "link")
                       .attr("d", function(d) {
                         var o = {x: source.x0, y: source.y0};
                         return $scope.diagonal({source: o, target: o});
                       })
                     .transition()
                       .duration(duration)
                       .attr("d", $scope.diagonal);

                   // Transition links to their new position.
                   link.transition()
                       .duration(duration)
                       .attr("d", $scope.diagonal);

                   // Transition exiting nodes to the parent's new position.
                   link.exit().transition()
                       .duration(duration)
                       .attr("d", function(d) {
                         var o = {x: source.x, y: source.y};
                         return $scope.diagonal({source: o, target: o});
                       })
                       .remove();

                   // Stash the old positions for transition.
                   nodes.forEach(function(d) {
                     d.x0 = d.x;
                     d.y0 = d.y;
                   });
                 }



              // Toggle children.
              function toggle(d) {
                if (d.children) {
                  d._children = d.children;
                  d.children = null;
                } else {
                  d.children = d._children;
                  d._children = null;
                }
              }
              

              function processData(json) {
              	var root = {};
              	//Universe_Name
              	root.name = json.hits.hits[0]._source.Universe_Name;
              	root.children = [];
              	root.children[0] = {};
              	
              	var classObj = json.hits.hits[0]._source.Classes[0];
              	root.children[0].name = classObj.Class_Name;
              	root.children[0].type = 'Class';
              	root.children[0].children = [];
              	for(var i in classObj.Objects) {
              		root.children[0].children[i] = {};
              		root.children[0].children[i].name = classObj.Objects[i].Object_Name;
              		root.children[0].children[i].type = 'Object';
              		root.children[0].children[i].children = [];
              		for(var j in classObj.Objects[i].Tables) {
              			root.children[0].children[i].children[j] = {};
              			root.children[0].children[i].children[j].name = classObj.Objects[i].Tables[j].Table_Name;
              			root.children[0].children[i].children[j].type = 'Table';
              			root.children[0].children[i].children[j].children = [];
              			for(var k in classObj.Objects[i].Tables[j].Columns) {
              				root.children[0].children[i].children[j].children[k] = {};
              				root.children[0].children[i].children[j].children[k].name = classObj.Objects[i].Tables[j].Columns[k].Column_Name;
              				root.children[0].children[i].children[j].children[k].type = 'Column';
              			} 
              		}
              	}
              	
              	return root;
              } 
              

              
              //////////JPPPPPPPPPPPPPP Enddddddddd
                 
                 function sankey(cls) {
                   d3.select('.bubble').style("display", "none");
                   d3.select('#sankey').style("display", "");
                   $scope.showBinaryTree = false;
                   $scope.showTable = false;
              	   $scope.showChartBtns = true;
                   
                   $scope.universe.chart = 'sankey';
                   var un = {
                     name: $scope.universe.data.Universe_Name,
                     node_type: 'Universe',
                     univ_path: $scope.universe.data.Universe_Full_Path,
                     univ_conn: $scope.universe.data.Universe_Connection,
                     univ_owner: $scope.universe.data.Universe_Current_Owner,
                     classes: $scope.universe.data.Number_Of_Classes,
                     objects: $scope.universe.data.Number_Of_Objects,
                     conditions: $scope.universe.data.Number_Of_Conditions,
                     tables: $scope.universe.data.Number_Of_Tables_Including_Alias,
                     joins: $scope.universe.data.Number_Of_Joins,
                     contexts: $scope.universe.data.Number_Of_Contexts
                   }
                   angular.extend($scope.universe, {
                     nodeMap: {},
                     nodes: [],
                     links: []
                   });
                   console.log("Root Node : ", un);
                   $scope.universe.nodeMap[un.node_type + '|' + un.name] = un;
                   $scope.universe.nodes.push(
                     $scope.universe.nodeMap[un.node_type + '|' + un.name]);

                   var cl = {
                     name: cls.Class_Name,
                     node_type: 'Class',
                     parent_class: cls.Parent_Class,
                     description: cls.Class_Description
                   }
                   $scope.universe.nodeMap[cl.node_type + '|' + cl.name] = cl;
                   $scope.universe.nodes.push(
                     $scope.universe.nodeMap[cl.node_type + '|' + cl.name]);
                   $scope.universe.links.push({
                                                source: $scope.universe.nodeMap[un.node_type + '|' + un.name],
                                                target: $scope.universe.nodeMap[cl.node_type + '|' + cl.name],
                                                value: 1
                                              });

                   var objCnt = 0;
                   var tableCnt = 0;
                   var colCnt = 0;

                   //Fetch Class Document

                   Universe.fetch({}, {
                     "query": {
                       "bool": {
                         "must": [
                           {
                             "match": {
                               "Universe_Id": $stateParams.universeId
                             }
                           },
                           {
                             "match": {
                               "Classes.Class_Id": cls.Class_Id
                             }
                           }
                         ]
                       }
                     }
                   }, function (data) {
                	 
                	 $scope.treeData = data;
                	 
                     console.log("Class : ", data);
                     var clz = data.hits.hits[0]._source.Classes[0];
                     angular.forEach(clz['Objects'], function (obj) {
                       var ob = {
                         name: obj.Object_Name,
                         node_type: 'Object',
                         select: obj.Select
                       }
                       if (angular.isUndefined(this.nodeMap[ob.node_type + '|' + ob.name])) {
                         objCnt++;
                       }
                       this.nodeMap[ob.node_type + '|' + ob.name] = ob;
                       this.nodes.push(this.nodeMap[ob.node_type + '|' + ob.name]);
                       this.links.push({
                                         source: this.nodeMap[cl.node_type + '|' + cl.name],
                                         target: this.nodeMap[ob.node_type + '|' + ob.name],
                                         value: 1
                                       });

                       angular.forEach(obj['Tables'], function (tbl) {
                         var tb = {
                           name: tbl.Table_Name,
                           node_type: 'Table'
                         }
                         if (angular.isUndefined(this.nodeMap[tb.node_type + '|' + tb.name])) {
                           tableCnt++;
                         }
                         this.nodeMap[tb.node_type + '|' + tb.name] = tb;
                         this.nodes.push(this.nodeMap[tb.node_type + '|' + tb.name]);
                         this.links.push({
                                           source: this.nodeMap[ob.node_type + '|' + ob.name],
                                           target: this.nodeMap[tb.node_type + '|' + tb.name],
                                           value: 1
                                         });

                         angular.forEach(tbl['Columns'], function (col) {
                           var clm = {
                             name: col.Column_Name,
                             node_type: 'Column'
                           }
                           if (angular.isUndefined(this.nodeMap[clm.node_type + '|' + clm.name])) {
                             colCnt++;
                           }
                           this.nodeMap[clm.node_type + '|' + clm.name] = clm;
                           this.nodes.push(this.nodeMap[clm.node_type + '|' + clm.name]);
                           this.links.push({
                                             source: this.nodeMap[tb.node_type + '|' + tb.name],
                                             target: this.nodeMap[clm.node_type + '|' + clm.name],
                                             value: 1
                                           });
                         }, this);
                       }, this);
                     }, $scope.universe);

                     $scope.universe.countForHeight = Math.max(objCnt, tableCnt, colCnt);
                     $scope.initFunction($scope.universe.nodes, $scope.universe.links,
                                         $scope.universe.countForHeight * 15);
                     unify($scope.sankey.nodes()[0], $scope.universe);
                     $scope.refreshSankey();

                   }, function (error) {
                     console.error("Error while fetching class data")
                   })
                 }

                 function unify(a, g) {
                   g.nodes = [];
                   g.links = [];
                   angular.forEach(a.targetLinks, function (l) {
                     if (l.source.targetLinks.length > 0) {
                       angular.forEach(l.source.targetLinks, function (l1) {
                         if (l1.source.targetLinks.length > 0) {
                           angular.forEach(l1.source.targetLinks, function (l2) {
                             if (l2.source.targetLinks.length > 0) {
                               angular.forEach(l2.source.targetLinks, function (l3) {
                                 if (l3.source.targetLinks.length > 0) {
                                   angular.forEach(l3.source.targetLinks, function (l4) {
                                     this.nodes.push(
                                       $scope.universe.nodeMap[l4.source.node_type + '|' + l4.source.name]);
                                     this.links.push({
                                                       source: $scope.universe.nodeMap[l4.source.node_type + '|' + l4.source.name],
                                                       target: $scope.universe.nodeMap[l3.source.node_type + '|' + l3.source.name],
                                                       value: 1
                                                     });
                                   }, this);
                                 }
                                 this.nodes.push(
                                   $scope.universe.nodeMap[l3.source.node_type + '|' + l3.source.name]);
                                 this.links.push({
                                                   source: $scope.universe.nodeMap[l3.source.node_type + '|' + l3.source.name],
                                                   target: $scope.universe.nodeMap[l2.source.node_type + '|' + l2.source.name],
                                                   value: 1
                                                 });
                               }, this);
                             }
                             this.nodes.push(
                               $scope.universe.nodeMap[l2.source.node_type + '|' + l2.source.name]);
                             this.links.push({
                                               source: $scope.universe.nodeMap[l2.source.node_type + '|' + l2.source.name],
                                               target: $scope.universe.nodeMap[l1.source.node_type + '|' + l1.source.name],
                                               value: 1
                                             });
                           }, this);
                         }
                         this.nodes.push(
                           $scope.universe.nodeMap[l1.source.node_type + '|' + l1.source.name]);
                         this.links.push({
                                           source: $scope.universe.nodeMap[l1.source.node_type + '|' + l1.source.name],
                                           target: $scope.universe.nodeMap[l.source.node_type + '|' + l.source.name],
                                           value: 1
                                         });
                       }, this);
                     }
                     this.nodes.push(
                       $scope.universe.nodeMap[l.source.node_type + '|' + l.source.name]);
                     this.links.push({
                                       source: $scope.universe.nodeMap[l.source.node_type + '|' + l.source.name],
                                       target: $scope.universe.nodeMap[a.node_type + '|' + a.name],
                                       value: 1
                                     });
                   }, g);

                   g.nodes.push($scope.universe.nodeMap[a.node_type + '|' + a.name]);

                   if (a.sourceLinks.length > 0) {
                     angular.forEach(a.sourceLinks, function (l) {
                       this.nodes.push(
                         $scope.universe.nodeMap[l.target.node_type + '|' + l.target.name]);
                       this.links.push({
                                         source: $scope.universe.nodeMap[a.node_type + '|' + a.name],
                                         target: $scope.universe.nodeMap[l.target.node_type + '|' + l.target.name],
                                         value: 1
                                       });
                       if (l.target.sourceLinks.length > 0) {
                         angular.forEach(l.target.sourceLinks, function (l1) {
                           this.nodes.push(
                             $scope.universe.nodeMap[l1.target.node_type + '|' + l1.target.name]);
                           this.links.push({
                                             source: $scope.universe.nodeMap[l.target.node_type + '|' + l.target.name],
                                             target: $scope.universe.nodeMap[l1.target.node_type + '|' + l1.target.name],
                                             value: 1
                                           });
                           if (l1.target.sourceLinks.length > 0) {
                             angular.forEach(l1.target.sourceLinks, function (l2) {
                               this.nodes.push(
                                 $scope.universe.nodeMap[l2.target.node_type + '|' + l2.target.name]);
                               this.links.push({
                                                 source: $scope.universe.nodeMap[l1.target.node_type + '|' + l1.target.name],
                                                 target: $scope.universe.nodeMap[l2.target.node_type + '|' + l2.target.name],
                                                 value: 1
                                               });
                               if (l2.target.sourceLinks.length > 0) {
                                 angular.forEach(l2.target.sourceLinks, function (l3) {
                                   this.nodes.push(
                                     $scope.universe.nodeMap[l3.target.node_type + '|' + l3.target.name]);
                                   this.links.push({
                                                     source: $scope.universe.nodeMap[l2.target.node_type + '|' + l2.target.name],
                                                     target: $scope.universe.nodeMap[l3.target.node_type + '|' + l3.target.name],
                                                     value: 1
                                                   });
                                   if (l3.target.sourceLinks.length > 0) {
                                     angular.forEach(l3.target.sourceLinks, function (l4) {
                                       this.nodes.push(
                                         $scope.universe.nodeMap[l4.target.node_type + '|' + l4.target.name]);
                                       this.links.push({
                                                         source: $scope.universe.nodeMap[l3.target.node_type + '|' + l3.target.name],
                                                         target: $scope.universe.nodeMap[l4.target.node_type + '|' + l4.target.name],
                                                         value: 1
                                                       });
                                     }, this);
                                   }
                                 }, this);
                               }
                             }, this);
                           }
                         }, this);
                       }
                     }, g);
                   }

                   g.nodes = d3.keys(d3.nest()
                                       .key(function (d) {
                                         return d.node_type + '|' + d.name;
                                       })
                                       .map(g.nodes));
                   g.nodes = g.nodes.map(function (n) {
                     return $scope.universe.nodeMap[n];
                   });
                   var lks = {};
                   g.links = d3.keys(d3.nest()
                                       .key(function (l) {
                                         lks[l.source.node_type + '|' + l.source.name + '~' + l.target.node_type + '|' + l.target.name] = l;
                                         return l.source.node_type + '|' + l.source.name + '~' + l.target.node_type + '|' + l.target.name;
                                       })
                                       .map(g.links)).map(function (lk) {
                     return lks[lk];
                   });
                 }

                 $scope.refresh = function () {
                   //bubble();
                 }

                 $scope.refreshSankey = function () {

                 	 $scope.showBinaryTree = false;
                	 $scope.showTable = false;
                	 
                	 d3.select('#sankey').style("display", "block");
                	 $scope.showBinaryTree = false;
                   $scope.initFunction($scope.universe.nodes, $scope.universe.links,
                                       $scope.universe.countForHeight * 15);
                 }

                 $scope.initFunction = function (nodes, links, dynamicHeight) {

                   var units = "nodes";
                   var container = d3.select("#sankey");

                   var margin = {top: 10, right: 10, bottom: 10, left: 10},
                     width = container.property('clientWidth') - margin.left - margin.right - 20,
                     height = Math.max(dynamicHeight, 200) - margin.top - margin.bottom;

                   var formatNumber = d3.format(",.0f"),    // zero decimal places
                     format = function (d) {
                       return formatNumber(d) + " ";
                     },
                     color = d3.scale.category20()

// append the svg canvas to the page
                   d3.select("svg").remove();
                   var svg = d3.select("#sankey svg");
                   if (svg == '') {
                     svg = d3.select("#sankey").append("svg")
                       .attr("width", width + margin.left + margin.right)
                       .attr("height", height + margin.top + margin.bottom)
                       .append("g")
                       .attr("transform",
                             "translate(" + margin.left + "," + margin.top + ")");
                   }
                   //console.log("SVG : ", svg);
// Set the sankey diagram properties
                   $scope.sankey = d3.sankey()
                     .nodeWidth(10)
                     .nodePadding(10)
                     .size([width, height]);

                   var path = $scope.sankey.link();

                   //console.log(nodes);

                   $scope.sankey
                     .nodes(nodes)
                     .links(links)
                     .layout(64);

// add in the links
                   var link = svg.append("g").selectAll(".link")
                     .data(links)
                     .enter().append("path")
                     .attr("class", "link")
                     .attr("d", path)
                     .style("stroke-width", function (d) {
                       return Math.max(1, d.dy);
                     })
                     .sort(function (a, b) {
                       return b.dy - a.dy;
                     });

// add the link titles
                   link.append("title")
                     .text(function (d) {
                       return d.source.name + " → " +
                         d.target.name + "\n" + format(d.value);
                     });

// add in the nodes
                   var node = svg.append("g").selectAll(".node")
                     .data(nodes)
                     .enter().append("g")
                     .attr("class", "node")
                     .attr("transform", function (d) {
                       return "translate(" + d.x + "," + d.y + ")";
                     })
                     .call(d3.behavior.drag()
                             .origin(function (d) {
                               return d;
                             })
                             .on("dragstart", function () {
                               this.parentNode.appendChild(this);
                             })
                             .on("drag", function (d) {
                               d3.select(this).attr("transform",
                                                    "translate(" + (
                                                      d.x = Math.max(0, Math.min(width - d.dx,
                                                                                 d3.event.x))
                                                    ) + "," + (
                                                      d.y = Math.max(0, Math.min(height - d.dy,
                                                                                 d3.event.y))
                                                    ) + ")");
                               $scope.sankey.relayout();
                               link.attr("d", path);
                             }))
                     .on("mouseover", function (a) {
                       c(a);
                     })
                     .on("mouseout", function (a) {
                       d(a);
                     })
                     .on("click", function (a) {
                           var g = {
                             nodes: [],
                             links: []
                           }

                           var height = 800;
                           switch (a.node_type) {
                             case 'Object':
                               height = a.sourceLinks[0].target.sourceLinks.length * 15;
                               break;
                             case 'Class':
                             case 'Table':
                               height = 15 * a.sourceLinks.length;
                               break;
                             default:
                               height = 200;
                           }

                           if (a.targetLinks.length > 0) {
                             unify(a, g);
                           }

                           $scope.initFunction(g.nodes, g.links, height);
                         }
                     )
                     ;

// add the rectangles for the nodes
                   node.append("rect")
                     .attr("height", function (d) {
                       return d.dy;
                     })
                     .attr("width", $scope.sankey.nodeWidth())
                     .style("fill", function (d) {
                       return d.color = color(d.node_type.replace(/ .*/, ""));
                     })
                     .style("stroke", function (d) {
                       return d3.rgb(d.color).darker(2);
                     })
                     .append("title")
                     .text(function (d) {
                       return d.name + "\n" + format(d.value);
                     });

// add in the title for the nodes
                   node.append("text")
                     .attr("x", -6)
                     .attr("y", function (d) {
                       return d.dy / 2;
                     })
                     .attr("dy", ".35em")
                     .attr("text-anchor", "end")
                     .attr("transform", null)
                     .text(function (d) {

                       var length = d.name.length;
                       return d.name;

                     })
                     .filter(function (d) {
                       return d.x < width / 2;
                     })
                     .attr("x", 6 + $scope.sankey.nodeWidth())
                     .attr("text-anchor", "start");


                 };
               }
              ])
  .controller("UnivReportsCtrl",
              ['$scope', '$http', '$location', '$filter', 'reports', '$state', '$stateParams', 'paginationService',
               function ($scope, $http, $location, $filter, reports, $state, $stateParams, paginationService) {
                 $scope.searchResultCount = function (instanceId) {
                   return paginationService.getCollectionLength(instanceId);
                 }

                 $scope.universe = {
                   universeId : $stateParams.universeId,
                   reports: reports.hits.hits
                 }
               }])
  .controller("UnivReportDetailsCtrl",
              ['$scope', '$http', '$location', '$filter', 'report', '$state', '$stateParams',
               function ($scope, $http, $location, $filter, report, $state, $stateParams) {
                 $scope.report = report;
                // console.log(report);
               }]);
               





//Tree view / expandable view code

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
};
function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
        return entityMap[s];
    });
}
var nonSpace = /\S/;
function trimIndent(content) {
    var lines = content.split("\n");
    var begin = 0;
    var end = lines.length-1;
    while ((nonSpace.exec(lines[begin]) == null) && (begin < lines.length))
        begin = begin + 1;
    while ((nonSpace.exec(lines[end]) == null) && end >= begin)
        end = end - 1;
    var ident = nonSpace.exec(lines[begin]).index;
    var formatted = "";
    for (var i = begin; i <= end; i++) {
        formatted = formatted + lines[i].slice(ident-1) + ((i < end)?"\n":"");
    }
    return formatted;
}

angular.module("powermeApp")
                .factory("$savedContent", function() {
                    return [];
                })
                .directive("saveContent", function($savedContent) {
                    return {
                        restrict: "A",
                        compile: function($element, $attrs) {
                            var content = $element.html();
                            $savedContent[$attrs.saveContent] = content;
                        }
                    }
                })
                .directive("applyContent", function($savedContent) {
                    return {
                        restrict: "EAC",
                        compile: function($element, $attrs) {
                            return function($scope, $element, $attrs) {
                                var content = $savedContent[$attrs.applyContent];
                                var lang = $attrs.highlightLang;
                                if (lang == "html")
                                    content = escapeHtml(content);
                                content = trimIndent(content);
                                var pre = prettyPrintOne(content, lang);
                                $element.html(pre);
                            }
                        }
                    }
                })
                .directive("nav", function() {
                    return {
                        restrict: "A",
                        compile: function($element) {
                            var sections = $("section");
                            angular.forEach(sections, function(section) {
                                var $section = $(section);
                                var id = $section.attr('id');
                                var titleHtml = $section.find("h1").html();
                                titleHtml = titleHtml.slice(0, titleHtml.indexOf("<")).trim();
                                $element.append("<li><a href='#"+id+"'>"+titleHtml+"</a></li>")
                            })
                        }
                    }
                })
        ;
