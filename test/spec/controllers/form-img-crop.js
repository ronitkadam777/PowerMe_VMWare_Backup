'use strict';

describe('Controller: FormImgCropCtrl', function () {

  // load the controller's module
  beforeEach(module('powermeApp'));

  var FormImgCropCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FormImgCropCtrl = $controller('FormImgCropCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
