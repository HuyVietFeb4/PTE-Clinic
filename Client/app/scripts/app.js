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
    'client',
    'headerApp',
    'clientProfile',
    'clinicProfile'
])
  .config(function ($routeProvider) {
    $routeProvider
      // .when('/', {
      //   templateUrl : 'index.html',
      // })
      .when('/login', {
        template: '<login></login>'
      })
      .when('/signup', {
        template: '<signup></signup>'
      })
      .when('/client', {
        template: '<client></client>'
      })
      .when('/clientProfile', {
        template: '<client-profile></client-profile>'
      })
      .when('/clinicProfile', {
        template: '<clinic-profile></clinic-profile>'
      })
      .otherwise({
        redirectTo: '/login'
      });
  });
