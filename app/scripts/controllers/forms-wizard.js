'use strict';

/**
 * @ngdoc function
 * @name powermeApp.controller:FormsWizardCtrl
 * @description
 * # FormsWizardCtrl
 * Controller of the powermeApp
 */
angular.module('powermeApp')
  .controller('FormWizardCtrl', function ($scope) {
    $scope.page = {
      title: 'Form Wizard',
      subtitle: 'Place subtitle here...'
    };
  });
