"use strict";
/**
 * Created by tapathan on 2/29/2016.
 */
angular.module('powermeApp')
  .factory("Compliance", ["$resource", "$rootScope", "$http", "$q", "$log", function ($resource, $rootScope, $http, $q, $log) {
    var key_assets = [];
    var vendors = [];
    var on_leave = [];
    var _deferred = $q.defer();
    $http.post(environment.apiUri + "/powerme/statistics/_search", {
        "size": 0,
        "query": {"bool": {"must_not": [{"terms": {"_dbname": ["NA", "", "Welcome", "1. Welcome", "SSI-IB"]}}]}},
        "aggs": {
          "dashboard_names": {
            "terms": {
              "field": "repositories.applications.subject-areas.dashboards.dashboard_id",
              "order": {"result.value": "desc"},
              "size": 10
            }, "aggs": {"result": {"sum": {"field": "repositories.applications.subject-areas.dashboards._dbcount"}}}
          }
        }
      })
      .success(function (data) {
        $log.log("Top 10 Dashboards : ", data);
        if (data.aggregations.dashboard_names.buckets.length <= 0) {
          return;
        }
        //get top ten dashboards as key assets
        angular.forEach(data.aggregations.dashboard_names.buckets, function (bucket) {
          this.push(bucket.key);
        }, key_assets);

        _deferred.resolve(key_assets);
      })
      .error(function (reason) {
        _deferred.reject([]);
      });

    var usersInDateRange = function (from, to) {
      var _def_users = $q.defer();

      $log.log("From : ", from, ", To : ", to);

      var f = from || 'now-7d/d';
      var t = to || 'now/d';

      $log.log("New From : ", f, ", New To : ", t);

      $http.post(environment.apiUri + "/powerme/user_comp_info/_search", {
          "size": 0,
          "query": {
            "bool": {
              "must": [{"range": {"date": {"from": f, "to": t}}}],
              "should": [{
                "bool": {
                  "must": [{"term": {"is_vendor": {"value": true}}}],
                  "must_not": [{"term": {"is_on_leave": {"value": true}}}]
                }
              }, {
                "bool": {
                  "must_not": [{"term": {"is_vendor": {"value": true}}}],
                  "must": [{"term": {"is_on_leave": {"value": true}}}]
                }
              }]
            }
          },
          "aggs": {
            "is_vendor": {
              "terms": {"field": "is_vendor", "size": 0},
              "aggs": {"user_names": {"terms": {"field": "user_name", "size": 0}}}
            },
            "is_emp_on_leave": {
              "terms": {"field": "is_on_leave", "size": 0},
              "aggs": {"user_names": {"terms": {"field": "user_name", "size": 0}}}
            }
          }
        })
        .success(function (data) {
          $log.log("Compliance User List Success : ", data);
          if (angular.isDefined(data.aggregations.is_vendor.buckets[0])) {
            angular.forEach(data.aggregations.is_vendor.buckets, function (bucket) {
              if (bucket.key === 'T') {
                angular.forEach(bucket.user_names.buckets, function (user) {
                  this.push(user.key);
                }, vendors);
              }
            });
          }

          if (angular.isDefined(data.aggregations.is_emp_on_leave.buckets[0])) {
            angular.forEach(data.aggregations.is_emp_on_leave.buckets, function (bucket) {
              if (bucket.key === 'T') {
                angular.forEach(bucket.user_names.buckets, function (user) {
                  this.push(user.key);
                }, on_leave);
              }
            })
          }

          _def_users.resolve({
            from: f,
            to: t,
            vendors: vendors,
            on_leave: on_leave
          });
        })
        .error(function (reason) {
          $log.log("Compliance User List Failed : ", reason);
          _def_users.reject({
            from: f,
            to: t,
            vendors: [],
            on_leave: []
          });
        });

      return _def_users.promise;
    }

    return {
      init: function () {
        return _deferred.promise;
      },
      complianceReport: function (from, to) {
        var _def_comp = $q.defer();

        var rejectFunction = function (error) {
          _def_comp.resolve({
            employeeReport: [],
            vendorReport: []
          });
        };

        _deferred.promise.then(function (key_assets) {
          usersInDateRange(from, to)
            .then(function (user_comp_info) {

              $log.log("User Comp Info : ", user_comp_info);

              $http.post(environment.apiUri + "/powerme/statistics/_search", {
                  "size": 0,
                  "query": {
                    "bool": {
                      "must": [{
                        "range": {
                          "date": {
                            "from": user_comp_info.from,
                            "to": user_comp_info.to
                          }
                        }
                      }, {"terms": {"dashboard_id": key_assets, "minimum_match": 1}}]
                    }
                  },
                  "aggs": {
                    "dashboards": {
                      "terms": {
                        "field": "repositories.applications.subject-areas.dashboards.dashboard_id",
                        "size": 0
                      },
                      "aggs": {
                        "date_accessed": {
                          "terms": {"field": "date", "size": 0},
                          "aggs": {
                            "users": {
                              "terms": {
                                "field": "repositories.applications.subject-areas.dashboards.users._name",
                                "size": 0
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                })
                .success(function (data) {
                  //aggregations.dashboards.buckets[i].key = dashboard_id
                  //aggregations.dashboards.buckets[j].date_accessed.buckets[j].key = access date
                  //aggregations.dashboards.buckets[j].date_accessed.buckets[j].users.buckets[k].key = user name

                  var result = {
                    employeeReport: [],
                    vendorReport: []
                  };

                  angular.forEach(data.aggregations.dashboards.buckets, function (dashboard) {
                    var dashboard_id = dashboard.key;
                    angular.forEach(dashboard.date_accessed.buckets, function (date_accessed) {
                      var accessed_on = date_accessed.key;
                      angular.forEach(date_accessed.users.buckets, function (user) {
                        var rec = {
                          dashboard_id: dashboard_id,
                          accessed_on: accessed_on,
                          accessed_by: user.key
                        };
                        if (user_comp_info.on_leave.indexOf(user.key) !== -1) {
                          this.employeeReport.push(rec);
                        } else if (user_comp_info.vendors.indexOf(user.key) !== -1) {
                          this.vendorReport.push(rec);
                        }
                      }, this);
                    }, this);
                  }, result);

                  $log.info("Report : ", result);

                  _def_comp.resolve(result);
                })
                .error(rejectFunction);

            }, rejectFunction);
        })

        return _def_comp.promise;
      }
    };
  }])
