'use strict';

describe('Controller: TablesUiGridCtrl', function () {

  // load the controller's module
  beforeEach(module('powermeApp'));

  var TablesUiGridCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TablesUiGridCtrl = $controller('TablesUiGridCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
