'use strict';

/**
 * @ngdoc function
 * @name automataDfaApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the automataDfaApp
 */
angular.module('automataDfaApp')
  .controller('AboutCtrl', ['$rootScope', function($rootScope) {
    $rootScope.menu_active = 'about';
  }]);
