'use strict';

/**
 * @ngdoc overview
 * @name automataDfaApp
 * @description
 * # automataDfaApp
 *
 * Main module of the application.
 */
angular
  .module('automataDfaApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.ace'
  ])
  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .when('/regex2dfa', {
          templateUrl: 'views/regex2dfa.html',
          controller: 'Regex2DfaCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
