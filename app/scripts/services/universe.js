/**
 * Created by tapathan on 11/16/2015.
 */

angular.module('powermeApp')
  .factory('Universe', ['$resource', '$log', function ($resource, $log) {
    "use strict";
    return $resource(environment.apiUri + '/powerme/DataDictionaryBO_Unv', {}, {
      fetchNames: {
        method: 'GET',
        url: environment.apiUri + '/powerme/DataDictionaryBO_Unv_List/_search?size=100'
      },
      fetch: {
        method: 'POST',
        url: environment.apiUri + '/powerme/DataDictionaryBO_Unv/_search'
      },
      fetchReports: {
        method: 'POST',
        url: environment.apiUri + '/powerme/DataDictionaryBO_Report/_search'
      },
      fetchReportById: {
        method: 'GET',
        url: environment.apiUri + '/powerme/DataDictionaryBO_Report/:id',
        params: {
          id: '@id'
        }
      }
    });
  }])
  .factory('UniverseList', ['$http', '$log', '$q', '$rootScope', function ($http, $log, $q, $rootScope) {
    "use strict";
    var _def_unv_list = $q.defer();

    $http.get(environment.apiUri + '/powerme/DataDictionaryBO_Unv_List/_search')
      .success(function (data) {
        var d = JSON.parse(data);
        $log.debug("All Personas From ES : ", d.hits.hits);

        _def_unv_list.resolve(d.hits.hits);
      })
      .error(function (error) {
        $log.error("Error retriving all personas : ", error);
        _def_unv_list.reject(error);
      });

    return {
      all: function() {
        _def_unv_list.promise;
      }
    }
  }]);
