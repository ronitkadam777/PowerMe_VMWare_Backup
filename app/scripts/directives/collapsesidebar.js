'use strict';

/**
 * @ngdoc directive
 * @name powermeApp.directive:collapseSidebarSm
 * @description
 * # collapseSidebarSm
 */
angular.module('powermeApp')
  .directive('collapseSidebar', function ($rootScope) {
    return {
      restrict: 'A',
      link: function postLink(scope, element) {
        $rootScope.powerMeLogoDisplayType="ORIGINAL";
        var app = angular.element('#minovate'),
            $window = angular.element(window),
            width = $window.width();

        var removeRipple = function() {
          angular.element('#sidebar').find('.ink').remove();
        };

        var collapse = function() {

          width = $window.width();

          if (width < 992) {
            app.addClass('sidebar-sm');
          } else {
            app.removeClass('sidebar-sm sidebar-xs');
          }

          if (width < 768) {
            app.removeClass('sidebar-sm').addClass('sidebar-xs');
          } else if (width > 992){
            app.removeClass('sidebar-sm sidebar-xs');
          } else {
            app.removeClass('sidebar-xs').addClass('sidebar-sm');
          }

          if (app.hasClass('sidebar-sm-forced')) {
            app.addClass('sidebar-sm');
          }

          if (app.hasClass('sidebar-xs-forced')) {
            app.addClass('sidebar-xs');
          }

        };

        collapse();

        $window.resize(function() {
          if(width !== $window.width()) {
            var t;
            clearTimeout(t);
            t = setTimeout(collapse, 300);
            removeRipple();
          }
        });

        element.on('click', function(e) {
        
          if (app.hasClass('sidebar-sm')) 
          {
        	$rootScope.powerMeLogoDisplayType="SMALL";
        	app.removeClass('sidebar-sm').addClass('sidebar-xs');
          }
          else if (app.hasClass('sidebar-xs')) 
          {
        	  $rootScope.powerMeLogoDisplayType="ORIGINAL";
              app.removeClass('sidebar-xs');
          }
          else 
          {
        	  $rootScope.powerMeLogoDisplayType="ORIGINAL HALF";
        	  app.addClass('sidebar-sm');
          }

          app.removeClass('sidebar-sm-forced sidebar-xs-forced');
          app.parent().removeClass('sidebar-sm sidebar-xs');
          removeRipple();
          e.preventDefault();
        });
      }
    };
  });
