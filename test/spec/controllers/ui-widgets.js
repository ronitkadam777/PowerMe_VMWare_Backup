'use strict';

describe('Controller: UiWidgetsCtrl', function () {

  // load the controller's module
  beforeEach(module('powermeApp'));

  var UiWidgetsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UiWidgetsCtrl = $controller('UiWidgetsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
