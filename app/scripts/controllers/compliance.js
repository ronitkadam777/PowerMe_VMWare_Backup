"use strict";
/**
 * Created by tapathan on 2/28/2016.
 */
angular.module('powermeApp')
  .controller('ComplianceCtrl', ['$scope', '$rootScope', 'ngTableParams', '$filter', 'Compliance', 'compReport',
    function ($scope, $rootScope, ngTableParams, $filter, Compliance, compReport) {
      "use strict";
      console.log("Compliance Report ", compReport);
      $scope.range = {

      }

      function cb(start, end) {
        angular.element('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        $scope.range.from = moment(start,"DD-MMM-YYYY").format("YYYY-MM-DD");
        $scope.range.to = moment(end,"DD-MMM-YYYY").format("YYYY-MM-DD");
      }

      cb(moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month'));

      angular.element('#reportrange').daterangepicker({
        startDate: moment().subtract(6, 'month').startOf('month'),
        endDate: moment().subtract(1, 'month').endOf('month'),
        ranges: {
          'Today': [moment(), moment()],
          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
          'Last 6 Month': [moment().subtract(6, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
      }, cb);

      $scope.refreshReport = function() {
        Compliance.complianceReport($scope.range.from, $scope.range.to).then(function(data) {
          console.log("Data : ", data);
          $scope.options.empData = data.employeeReport;
          $scope.options.venData = compReport.vendorReport;
          $scope.filterPersona();
        })
      }

      $scope.options = {
        empData: compReport.employeeReport,
        venData: compReport.vendorReport
      }

      $scope.filterPersona = function () {
        $scope.tables.empTableParams.tableParams.reload();
        $scope.tables.venTableParams.tableParams.reload();
      }

      var tableOptions = {
        page: 1,            // show first page
        count: 10,           // count per page
        sorting: {
          accessed_on: 'desc',
          accessed_by: 'asc'
        }
      };

      var tableDataFn = function($defer, params, data) {
        var users = $scope.filterData ?
          $filter('filterBy')($scope.filterData) : data;
        users = params.sorting() ? $filter('orderBy')(users, params.orderBy()) : users;
        params.total(users.length);
        $defer.resolve(users.slice((params.page() - 1) * params.count(),
          params.page() * params.count()));
      }

      $scope.tables = {};

      $scope.tables.empTableParams = {
        title: 'Employee Report',
        tableParams: new ngTableParams(tableOptions, {
          total: $scope.options.empData.length, // length of data
          counts: [],
          getData: function ($defer, params) {
            tableDataFn($defer, params, $scope.options.empData)
          }
        })
      }

      $scope.tables.venTableParams = {
        title: 'Vendor Report',
        tableParams: new ngTableParams(tableOptions, {
          total: $scope.options.venData.length, // length of data
          counts: [],
          getData: function ($defer, params) {
            tableDataFn($defer, params, $scope.options.venData)
          }
        })
      }
    }]);
