'use strict';

describe('Controller: MailSingleCtrl', function () {

  // load the controller's module
  beforeEach(module('powermeApp'));

  var MailSingleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MailSingleCtrl = $controller('MailSingleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
