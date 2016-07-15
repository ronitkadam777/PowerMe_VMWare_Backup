'user strict';

angular.module('powermeApp')
  .factory('Personas', ['$resource', '$q', '$http', '$log', function ($resource, $q, $http, $log) {
    var _def_personas = $q.defer();

    $http.get(environment.apiUri + '/powerme/role/_search')
      .success(function (data) {
                 $log.debug("All Personas : ", data.hits.hits);
                 _def_personas.resolve(data.hits.hits);
               })
      .error(function (error) {
               $log.error("Error retriving all personas : ", error);
               _def_personas.reject(error);
             });

    return {
      all: function () {
        return _def_personas.promise;
      },
      persona: $resource(environment.apiUri + '/powerme/role/:role_id', {
        role_id: '@role_id'
      })
    }
  }]);
