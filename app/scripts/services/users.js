/**
 * Created by tapathan on 9/7/2015.
 */
angular.module('powermeApp')
  .factory('Users', ['$resource', '$log', function ($resource, $log) {
    "use strict";
    return $resource(environment.apiUri + '/powerme/user/:user_name', {
      user_name: '@user_name'
    }, {
      all: {
        url: environment.apiUri + '/powerme/user/_search?size=1000'
      }
    })
  }])
