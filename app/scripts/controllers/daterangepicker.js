'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:DaterangepickerCtrl
 * @description
 * # DaterangepickerCtrl
 * Controller of the powermeApp
 */


angular.module('powermeApp')
  .controller('DaterangepickerCtrl', function ($scope, $moment, $rootScope) {
   
    
    
    angular.element('#timelineFilter span').html(moment().subtract(1,'years').format('MMMM D, YYYY')+' - '+moment().subtract(1,'month').format('MMMM D, YYYY'));

    angular.element('#timelineFilter').daterangepicker({
       startDate: $moment().subtract(1,'years').format('MM/DD/YYYY'),
        endDate: $moment().subtract(1,'days').format('MM/DD/YYYY'),
       ranges: {
           'All Time': [$moment().subtract(16, 'years'), moment()],
           'Today': [moment(), moment()],
            'Q3-15': ['07/01/2015', '09/30/2015'],
            'Q4-15': ['10/01/2015', '12/31/2015'],
            'Q1-16': ['01/01/2016', '03/31/2016'],
            'Q2-16': ['04/01/2016', '06/30/2016'],
        },
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        autoUpdateInput: true,
        cancelClass: 'btn-danger',
        separator: ' to '
        
        }, function(start, end, label) {
            var dateParams = [start.format('YYYY-M-D'),end.format('YYYY-M-D'),label];
            $rootScope.selectedDate = dateParams;
            $('#timelineFilter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
   });

     
 angular.element('#reportrange span').html(moment().subtract(29, 'days').format('MMMM D, YYYY') + ' - ' + moment().format('MMMM D, YYYY'));


    
/*
 angular.element('#reportrange').daterangepicker({
       format: 'MM/DD/YYYY',
       startDate: $moment().subtract(31, 'days').format('MM/DD/YYYY'),
       endDate: $moment().subtract(1, 'days').format('MM/DD/YYYY'),
       minDate: '01/01/2012',
       maxDate: $moment().add(30, 'days').format('MM/DD/YYYY'),
       //dateLimit: { days: 180 },
       showDropdowns: false,
       showWeekNumbers: false,
       timePicker: false,
       timePickerIncrement: 1,
       timePicker12Hour: true,
       ranges: {
         'All Time' : [$moment().subtract(16, 'years'), moment()],
         'Q1-15': ['01/01/2015', '03/31/2015'],
         'Q2-15': ['04/01/2015', '06/30/2015'],
         'Q3-15': ['07/01/2015', '09/30/2015'],
         'Q4-15': ['10/01/2015', '12/31/2015']
       },
       opens: 'right',
       drops: 'down',
       buttonClasses: ['btn', 'btn-sm'],
       applyClass: 'btn-primary',
       cancelClass: 'btn-default',
       separator: ' to ',
      
   }, function(start, end, label) {

       $rootScope.getDates(start.format('D-MMM-YYYY'),end.format('D-MMM-YYYY'),label);
       $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
   });*/

  });
