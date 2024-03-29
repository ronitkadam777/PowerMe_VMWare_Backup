'use strict';

describe('Controller: DaterangepickerCtrl', function () {

  // load the controller's module
  beforeEach(module('powermeApp'));

  var DaterangepickerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DaterangepickerCtrl = $controller('DaterangepickerCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
