'use strict';
/**
 * @ngdoc overview
 * @name powermeApp
 * @description
 * # powermeApp
 *
 * Main module of the application.
 */
angular.module('powermeApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngTouch',
    'picardy.fontawesome',
    'ui.bootstrap',
    'ui.router',
    'ui.utils',
    'angular-loading-bar',
    'angular-momentjs',
    'FBAngular',
    'lazyModel',
    'toastr',
    'angularBootstrapNavTree',
    'oc.lazyLoad',
    'ui.select',
    'ui.tree',
    'textAngular',
    'colorpicker.module',
    'angularFileUpload',
    'ngImgCrop',
    'datatables',
    'datatables.bootstrap',
    'datatables.colreorder',
    'datatables.colvis',
    'datatables.tabletools',
    'datatables.scroller',
    'datatables.columnfilter',
    'ui.grid',
    'ui.grid.resizeColumns',
    'ui.grid.edit',
    'ui.grid.moveColumns',
    'ngTable',
    'smart-table',
    'angular-flot',
    'angular-rickshaw',
    'easypiechart',
    'ui.calendar',
    'angularUtils.directives.dirPagination',
    'angular.filter',
    'isteven-multi-select',
    'treeControl',
    "template/tabs/tab.html", 
    "template/tabs/tabset.html",
    'ngTableToCsv',
    'checklist-model',
    'ngCsv',
    'angularSpinner',
    'ivh.treeview'
  ])
  .run(['$rootScope', '$state', '$stateParams', '$cookieStore',
        function ($rootScope, $state, $stateParams, $cookieStore) {
          $rootScope.options = {
              currState : ''
          }
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;
          $rootScope.$on('$stateChangeSuccess', function (event, toState) {
            event.targetScope.$watch('$viewContentLoaded', function () {
              angular.element('html, body, #content')
                .animate({
                  scrollTop: 0
                }, 200);
              setTimeout(function () {
                angular.element('#wrap')
                  .css('visibility', 'visible');
                if (!angular.element('.dropdown')
                    .hasClass('open')) {
                  angular.element('.dropdown')
                    .find('>ul')
                    .slideUp();
                }
              }, 200);
            });
            $rootScope.containerClass = toState.containerClass;
              
            if(toState.name === 'app.landing'){
                $rootScope.options.currState = 'landing';
            } else {
                $rootScope.options.currState = '';
            }
            
          });

          console.log("$cookieStore.get('currentUser')==>", $cookieStore.get('currentUser'));
          //console.log(es );
          if (!angular.isUndefined($cookieStore.get('currentUser'))) {
            $rootScope.currentUser = $cookieStore.get('currentUser');
            $rootScope.username = $rootScope.currentUser.username;
          } else {
            $state.go("app.landing");
          }
        }])
  .config(['uiSelectConfig', function (uiSelectConfig) {
    uiSelectConfig.theme = 'bootstrap';
  }])
  .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/app/landing');
    $stateProvider.state('app', {
        abstract: true,
        url: '/app',
        templateUrl: 'views/tmpl/app.html',
        resolve: {
          personas: ['Personas', function (Personas) {
            return Personas.all();
          }],
          currentUser: ['Auth', function (Auth) {
            return Auth.currentUser();
          }],
 universeList: ['Universe', function (Universe) {
            return Universe.fetchNames().$promise;
          }]
        },
        controller: ['personas', 'universeList', '$scope', '$rootScope',
                     function (personas, universeList, $scope, $rootScope) {
                       $scope.personas = personas;
                       $rootScope.universes = [];
                       angular.forEach(universeList.hits.hits, function (unv) {
                         this.push(unv._source);
                       }, $rootScope.universes);
                       //console.log("All Universes : ", $rootScope.universes);
        }]
      })
      //dashboard
    
      .state('app.dashboard', {
        url: '/dashboard',
        controller: 'DashboardCtrl',
        templateUrl: 'views/tmpl/dashboard.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/datatables/datatables.bootstrap.min.css'
            ]);
          }]
        }
      })

      .state('app.dashboardConsumer', {
        url: '/dashboardConsumer',
        controller: 'bookmarksCtrl',
        templateUrl: 'views/tmpl/dashboard_new_user.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/datatables/datatables.bootstrap.min.css'
            ]);
          }]
        }
      })
      //analysis
      .state('app.analysis', {
        url: '/analysis',
        controller: 'AnalysisCtrl',
        templateUrl: 'views/tmpl/analysis.html'
      })
      .state('app.dashboardCharts', {
        url: '/dashboardCharts',
        controller: 'DashboardChartsCtrl',
        templateUrl: 'views/tmpl/dashboardCharts.html'
      })
      //Compliance
      .state('app.compliance', {
        url: '/compliance',
        controller: 'ComplianceCtrl',
        templateUrl: 'views/tmpl/compliance.html',
        resolve: {
          compReport: ['Compliance', function (Compliance) {
            return Compliance.complianceReport(moment().subtract(6, 'month').startOf('month')
              .format("YYYY-MM-DD"), moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD"));
          }]
        }
      })

      //mail
      .state('app.mail', {
        abstract: true,
        url: '/mail',
        controller: 'MailCtrl',
        templateUrl: 'views/tmpl/mail/mail.html'
      })
      //mail/inbox
      .state('app.mail.inbox', {
        url: '/inbox',
        controller: 'MailInboxCtrl',
        templateUrl: 'views/tmpl/mail/inbox.html'
      })
      //mail/compose
      .state('app.mail.compose', {
        url: '/compose',
        controller: 'MailComposeCtrl',
        templateUrl: 'views/tmpl/mail/compose.html'
      })
      //mail/single
      .state('app.mail.single', {
        url: '/single',
        controller: 'MailSingleCtrl',
        templateUrl: 'views/tmpl/mail/single.html'
      })
      //ui
      .state('app.ui', {
        url: '/ui',
        template: '<div ui-view></div>'
      })
      .state('app.tagtiles', {
        url: '/tagtiles',
        controller: 'tagtilesCtrl',
        templateUrl: 'views/tmpl/tagtiles.html'
      })
      //ui/typography
      .state('app.ui.typography', {
        url: '/typography',
        controller: 'TypographyCtrl',
        templateUrl: 'views/tmpl/ui/typography.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/google-code-prettify/prettify.css',
              'scripts/vendor/google-code-prettify/sons-of-obsidian.css',
              'scripts/vendor/google-code-prettify/prettify.js'
            ]);
          }]
        }
      })
      //ui/lists
      .state('app.ui.lists', {
        url: '/lists',
        controller: 'ListsCtrl',
        templateUrl: 'views/tmpl/ui/lists.html'
      })
      //ui/buttons&icons
      .state('app.ui.buttons-icons', {
        url: '/buttons-icons',
        controller: 'ButtonsIconsCtrl',
        templateUrl: 'views/tmpl/ui/buttons-icons.html'
      })
      //ui/navs&accordions
      .state('app.ui.navs', {
        url: '/navs',
        controller: 'NavsCtrl',
        templateUrl: 'views/tmpl/ui/navs.html'
      })
      //ui/modals
      .state('app.ui.modals', {
        url: '/modals',
        controller: 'ModalsCtrl',
        templateUrl: 'views/tmpl/ui/modals.html'
      })
      //ui/tiles
      .state('app.ui.tiles', {
        url: '/tiles',
        controller: 'TilesCtrl',
        templateUrl: 'views/tmpl/ui/tiles.html'
      })
      //ui/portlets
      .state('app.ui.portlets', {
        url: '/portlets',
        controller: 'PortletsCtrl',
        templateUrl: 'views/tmpl/ui/portlets.html'
      })
      //ui/grid
      .state('app.ui.grid', {
        url: '/grid',
        controller: 'GridCtrl',
        templateUrl: 'views/tmpl/ui/grid.html'
      })
      //ui/widgets
      .state('app.ui.widgets', {
        url: '/widgets',
        controller: 'WidgetsCtrl',
        templateUrl: 'views/tmpl/ui/widgets.html'
      })
      //ui/alerts & notifications
      .state('app.ui.alerts', {
        url: '/alerts',
        controller: 'AlertsCtrl',
        templateUrl: 'views/tmpl/ui/alerts.html'
      })
      //ui/general
      .state('app.ui.general', {
        url: '/general',
        controller: 'GeneralCtrl',
        templateUrl: 'views/tmpl/ui/general.html'
      })
      //ui/tree
      .state('app.ui.tree', {
        url: '/tree',
        controller: 'TreeCtrl',
        templateUrl: 'views/tmpl/ui/tree.html'
      })
      //downloads
      .state('app.download', {
        url: '/download',
        controller: 'DownloadCtrl',
        templateUrl: 'views/tmpl/download.html'
      })
     //tables
      .state('app.tables', {
        url: '/tables',
        template: '<div ui-view></div>'
      })
      //tables/bootstrap
      .state('app.tables.bootstrap', {
        url: '/bootstrap',
        controller: 'TablesBootstrapCtrl',
        templateUrl: 'views/tmpl/tables/bootstrap.html'
      })
      //tables/datatables
      .state('app.tables.datatables', {
        url: '/datatables',
        controller: 'TablesDatatablesCtrl',
        templateUrl: 'views/tmpl/tables/datatables.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/datatables/ColReorder/css/dataTables.colReorder.min.css',
              'scripts/vendor/datatables/ColReorder/js/dataTables.colReorder.min.js',
              'scripts/vendor/datatables/Responsive/dataTables.responsive.css',
              'scripts/vendor/datatables/Responsive/dataTables.responsive.js',
              'scripts/vendor/datatables/ColVis/css/dataTables.colVis.min.css',
              'scripts/vendor/datatables/ColVis/js/dataTables.colVis.min.js',
              'scripts/vendor/datatables/TableTools/css/dataTables.tableTools.css',
              'scripts/vendor/datatables/TableTools/js/dataTables.tableTools.js',
              'scripts/vendor/datatables/datatables.bootstrap.min.css'
            ]);
          }]
        }
      })
      //tables/uiGrid
      .state('app.tables.ui-grid', {
        url: '/ui-grid',
        controller: 'TablesUiGridCtrl',
        templateUrl: 'views/tmpl/tables/ui-grid.html'
      })
      //tables/ngTable
      .state('app.tables.ng-table', {
        url: '/ng-table',
        controller: 'TablesNgTableCtrl',
        templateUrl: 'views/tmpl/tables/ng-table.html'
      })
      //tables/smartTable
      .state('app.tables.smart-table', {
        url: '/smart-table',
        controller: 'TablesSmartTableCtrl',
        templateUrl: 'views/tmpl/tables/smart-table.html'
      })
      //tables/fooTable
      .state('app.tables.footable', {
        url: '/footable',
        controller: 'TablesFootableCtrl',
        templateUrl: 'views/tmpl/tables/footable.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/footable/dist/footable.all.min.js',
              'scripts/vendor/footable/css/footable.core.min.css'
            ]);
          }]
        }
      })
      //charts
      .state('app.charts', {
        url: '/charts',
        controller: 'ChartsCtrl',
        templateUrl: 'views/tmpl/charts.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/flot/jquery.flot.resize.js',
              'scripts/vendor/flot/jquery.flot.orderBars.js',
              'scripts/vendor/flot/jquery.flot.stack.js',
              'scripts/vendor/flot/jquery.flot.pie.js',
              'scripts/vendor/gaugejs/gauge.min.js'
            ]);
          }]
        }
      })
      //layouts
      .state('app.layouts', {
        url: '/layouts',
        template: '<div ui-view></div>'
      })
      //layouts/boxed
      .state('app.layouts.boxed', {
        url: '/boxed',
        controller: 'BoxedlayoutCtrl',
        templateUrl: 'views/tmpl/layouts/boxed.html',
        containerClass: 'boxed-layout'
      })
      //layouts/fullwidth
      .state('app.layouts.fullwidth', {
        url: '/fullwidth',
        controller: 'FullwidthlayoutCtrl',
        templateUrl: 'views/tmpl/layouts/fullwidth.html'
      })
      //layouts/sidebar-sm
      .state('app.layouts.sidebar-sm', {
        url: '/sidebar-sm',
        controller: 'SidebarsmlayoutCtrl',
        templateUrl: 'views/tmpl/layouts/sidebar-sm.html',
        containerClass: 'sidebar-sm-forced sidebar-sm'
      })
      //layouts/sidebar-xs
      .state('app.layouts.sidebar-xs', {
        url: '/sidebar-xs',
        controller: 'SidebarxslayoutCtrl',
        templateUrl: 'views/tmpl/layouts/sidebar-xs.html',
        containerClass: 'sidebar-xs-forced sidebar-xs'
      })
      //layouts/offcanvas
      .state('app.layouts.offcanvas', {
        url: '/offcanvas',
        controller: 'OffcanvaslayoutCtrl',
        templateUrl: 'views/tmpl/layouts/offcanvas.html',
        containerClass: 'sidebar-offcanvas'
      })
      //layouts/hz-menu
      .state('app.layouts.hz-menu', {
        url: '/hz-menu',
        controller: 'HzmenuCtrl',
        templateUrl: 'views/tmpl/layouts/hz-menu.html',
        containerClass: 'hz-menu'
      })
      //layouts/rtl-layout
      .state('app.layouts.rtl', {
        url: '/rtl',
        controller: 'RtlCtrl',
        templateUrl: 'views/tmpl/layouts/rtl.html',
        containerClass: 'rtl'
      })
   
     //app core pages (errors, login,signup)
      .state('core', {
        abstract: true,
        url: '/core',
        template: '<div ui-view></div>'
        //,
        //resolve: {
        //  currentUser: ['Auth', function(Auth) {
        //    return Auth.currentUser();
        //  }]
        //}
      })
      //login
      .state('core.login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/tmpl/pages/login.html'
      })
      //signup
      .state('core.signup', {
        url: '/signup',
        controller: 'SignupCtrl',
        templateUrl: 'views/tmpl/pages/signup.html'
      })
      //forgot password
      .state('core.forgotpass', {
        url: '/forgotpass',
        controller: 'ForgotPasswordCtrl',
        templateUrl: 'views/tmpl/pages/forgotpass.html'
      })
      //page 404
      .state('core.page404', {
        url: '/page404',
        templateUrl: 'views/tmpl/pages/page404.html'
      })
      //page 500
      .state('core.page500', {
        url: '/page500',
        templateUrl: 'views/tmpl/pages/page500.html'
      })
      //page offline
      .state('core.page-offline', {
        url: '/page-offline',
        templateUrl: 'views/tmpl/pages/page-offline.html'
      })
      //locked screen
      .state('core.locked', {
        url: '/locked',
        templateUrl: 'views/tmpl/pages/locked.html'
      })
      //example pages
      .state('app.pages', {
        url: '/pages',
        template: '<div ui-view></div>'
      })
      //gallery page
      .state('app.pages.gallery', {
        url: '/gallery',
        controller: 'GalleryCtrl',
        templateUrl: 'views/tmpl/pages/gallery.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/mixitup/jquery.mixitup.js',
              'scripts/vendor/magnific/magnific-popup.css',
              'scripts/vendor/magnific/jquery.magnific-popup.min.js'
            ]);
          }]
        }
      })
      //timeline page
      .state('app.pages.timeline', {
        url: '/timeline',
        controller: 'TimelineCtrl',
        templateUrl: 'views/tmpl/pages/timeline.html'
      })
      //chat page
      .state('app.pages.chat', {
        url: '/chat',
        controller: 'ChatCtrl',
        templateUrl: 'views/tmpl/pages/chat.html'
      })
      //search results
      .state('app.pages.search-results', {
        url: '/search-results',
        controller: 'SearchResultsCtrl',
        templateUrl: 'views/tmpl/pages/search-results.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/slider/bootstrap-slider.js'
            ]);
          }]
        }
      })
      //profile page
      .state('app.pages.profile', {
        url: '/profile',
        controller: 'ProfileCtrl',
        templateUrl: 'views/tmpl/pages/profile.html',
        resolve: {
          plugins: ['$ocLazyLoad', function ($ocLazyLoad) {
            return $ocLazyLoad.load([
              'scripts/vendor/filestyle/bootstrap-filestyle.min.js'
            ]);
          }]
        }
      })
      .state('app.system', {
        url: '/Cataloge/:system',
        controller: 'systemCtrl',
        templateUrl: 'views/tmpl/system.html'
      })
      .state('app.application', {
        url: '/Cataloge/:system/application/:application',
        controller: 'applicationsCtrl',
        templateUrl: 'views/tmpl/applications.html'
      })
      .state('app.subjectarea', {
        url: '/Cataloge/:system/application/:application/subjectarea/:subjectArea',
        controller: 'subjectareasCtrl',
        templateUrl: 'views/tmpl/subjectareas.html'
      })
      .state('app.dashboardInfo', {
        url: '/Cataloge/:system/application/:application/subjectarea/:subjectArea/dashboard/:dashboard',
        controller: 'AppsCtrl',
        templateUrl: 'views/tmpl/appInfo.html'
      })
      .state('app.dashboardPageInfo', {
        url: '/Cataloge/:system/application/:application/subjectarea/:dashboardGroupName/dashboard/:dashboard/dashboardPageName/:dashboardPageName',
        controller: 'dashboardpageinfoCtrl',
        templateUrl: 'views/tmpl/dashboardpageinfo.html'
      })
      .state('app.reportDetail', {
        url: '/Cataloge/:system/application/:application/subjectarea/:dashboardGroupName/dashboard/:dashboard/dashboardPageName/:dashboardPageName/reportName/:reportName',
        controller: 'reportCtrl',
        templateUrl: 'views/tmpl/reportDetails.html'
      })
      .state('app.bookmark', {
        url: '/:system/bookMarks',
        controller: 'bookmarksCtrl',
        templateUrl: 'views/tmpl/bookmarks.html'
      })
      .state('app.tags', {
        url: '/tags',
        controller: 'tagsCtrl',
        templateUrl: 'views/tmpl/tags.html'
      })
      .state('app.search', {
        url: '/searchItems',
        controller: 'searchDetailsCtrl',
        templateUrl: 'views/tmpl/search.html'
      })
      .state('app.searchTags', {
        url: '/tag/:id',
        controller: 'searchTagDetailsCtrl',
        templateUrl: 'views/tmpl/searchTagDetails.html',
        resolve: {
          tag: ['$http', '$stateParams', function ($http, $stateParams) {
            return $http.get(environment.apiUri + '/powerme/tags/' + $stateParams.id);
          }]
        }
      })
      .state('app.persona', {
        url: '/persona',
        controller: 'personaCtrl',
        templateUrl: 'views/tmpl/persona.html',
        resolve: {
          users: ['Users', function (Users) {
            return Users.all().$promise;
          }]
        }
      })
      //documentation
      .state('app.help', {
        url: '/help',
        controller: 'HelpCtrl',
        templateUrl: 'views/tmpl/help.html'
      })
       .state('app.datadictionary', {
        url: '/datadictionary/:universeId',
        controller: 'DataDictionaryCtrl',
        templateUrl: 'views/tmpl/dataDictionary.html'
      })
      .state('app.univReports', {
        abstract: true,
        url: '/univReports/:universeId',
        template: '<ui-view></ui-view>',
        controller: function ($scope, $rootScope) {
          console.log("Projects controller");
        }
      })
      .state('app.univReports.list', {
        url: '',
        controller: 'UnivReportsCtrl',
        templateUrl: 'views/tmpl/univReports.html',
        resolve: {
          reports: ['Universe', '$stateParams', function (Universe, $stateParams) {
            return Universe.fetchReports({}, {
              "size": "100000",
              "query": {
                "match": {
                  "UNIVERSE_ID": $stateParams.universeId
                }
              }
            }).$promise;
          }]
        }
      })
      .state('app.univReports.reportDetails', {
        url: '/report/:reportId',
        controller: 'UnivReportDetailsCtrl',
        templateUrl: 'views/tmpl/univReportDetails.html',
        resolve: {
          report: ['Universe', '$stateParams', function (Universe, $stateParams) {
            return Universe.fetchReportById({id: $stateParams.reportId}).$promise;
          }]
        }
      })

	//landing
      .state('app.landing', {
        url: '/landing',
        controller: 'LandingCtrl',
        templateUrl: 'views/tmpl/Landing.html'
      })
      
      
	//instrumentPanel
      .state('app.instrumentPanel', {
        url: '/instrumentPanel',
        controller: 'instrumentPanel',
        templateUrl: 'views/tmpl/instrumentPanel.html'
      })
      
      //usageProfiling
      .state('app.usageProfiling',{
        url: '/usageProfiling',
        controller: 'usageProfilingCtrl',
        templateUrl: 'views/tmpl/usageProfiling.html'
      })
      //userLoginLogs
      .state('app.userLoginLogsCtrl',{
        url: '/userLoginLogsCtrl/:username',
        controller: 'userLoginLogsCtrl',
        templateUrl: 'views/tmpl/userLoginLogs.html'
      })
      //descriptionDownloads
      .state('app.descriptionDownloadsCtrl',{
        url: '/descriptionDownloads',
        controller: 'descriptionDownloadsCtrl',
        templateUrl: 'views/tmpl/descriptionDownloads.html'
      })
    //ComplianceKeyAssetStatistics
      .state('app.ComplianceKeyAssets',{
        url: '/ComplianceKeyAssets',
        controller: 'ComplianceKeyAssetsCtrl',
        templateUrl: 'views/tmpl/ComplianceKeyAssets.html'
      })
    //ComplianceAttributeStatistics
    .state('app.ComplianceAttributes',{
        url: '/ComplianceAttributes',
        controller: 'ComplianceAttributesCtrl',
        templateUrl: 'views/tmpl/ComplianceAttributes.html'
      })
    .state('app.ComplianceSettings',{
        url: '/ComplianceSettings',
        controller: 'ab',
        templateUrl: 'views/tmpl/ComplianceSettings.html'
      });
    /*ComplianceOverall
    .state('app.Compliance_Overall',{
        url: '/Compliance_Overall',
        controller: 'Compliance_OverallCtrl',
        templateUrl: 'views/tmpl/Compliance_Overall.html'
    });*/
  }]);
