/**
 * Created by tapathan on 9/17/2015.
 */

angular.module('powermeApp')
  .factory('Descriptions', ['$resource', '$log', function ($resource, $log) {
    "use strict";
    return $resource(environment.apiUri + '/powerme/dashboard_desc', {}, {
      fetch: {
        method: 'POST',
        url: environment.apiUri + '/powerme/:type/_search'
      },
      update: {
        method: 'POST',
        url: environment.apiUri + '/powerme/:type/:id/_update'
      },
      create: {
        method: 'POST',
        url: environment.apiUri + '/powerme/:type'
      }
    });
  }]);
