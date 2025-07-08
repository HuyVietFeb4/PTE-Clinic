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
    'apiService',
    'login',
    'signup',
    'footerApp'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/login', {
        template: '<login></login>'
      })
      .when('/signup', {
        template: '<signup></signup>'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
