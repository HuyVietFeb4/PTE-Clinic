'use strict';

/**
 * @ngdoc overview
 * @name clinicApp
 * @description
 * # clinicApp
 *
 * Main module of the application.
 */
angular
  .module('clinicApp', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'login',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        template: '<login></login>'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
