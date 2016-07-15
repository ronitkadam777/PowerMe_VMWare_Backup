angular
    .module('powermeApp')
    .controller('InstrumentPanelCalender',function($scope, $moment, $rootScope, $http, averageRankingService){
    
    
   /* 
    angular.element('#timelineFilter').daterangepicker({
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
            'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month':[moment().subtract(1,'month').startOf('month'),moment().subtract(1,'month').endOf('month')]
            },
       opens: 'right',
       drops: 'down',
       buttonClasses: ['btn', 'btn-sm'],
       applyClass: 'btn-primary',
       autoUpdateInput: true,
       cancelClass: 'btn-default',
       separator: ' to ',
      
   }, function(start, end, label) {
        console.log(start.format('D-MMM-YYYY') , end.format('D-MMM-YYYY'), label);
    
       $rootScope.getDates(start.format('D-MMM-YYYY'),end.format('D-MMM-YYYY'),label);

       $('#timelineFilter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
     
       $('#timelineFilter span').on('click', function(){
            daterangepicker.attr('value', '');
            daterangepicker.datepicker( "option" , {
                minDate: null,
                maxDate: null} );
});
   });*/
    
        $(function() {
            function cb(start, end) {
            $('#timelineFilter span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            console.log(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            

        }
        cb(moment().subtract(29, 'days'), moment());

        $('#timelineFilter').daterangepicker({
        ranges: {
            'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month':[moment().subtract(1,'month').startOf('month'),moment().subtract(1,'month').endOf('month')]
            },
        opens: 'right',
        drops: 'down',
        buttonClasses: ['btn', 'btn-sm'],
        applyClass: 'btn-primary',
        autoUpdateInput: true,
        cancelClass: 'btn-danger',
        separator: ' to '

        }, cb);
        }); 
});