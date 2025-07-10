'use strict';

/**
 * @ngdoc overview
 * @name login
 * @description
 * Login module of the application.
 */
angular.module('login', [
    'ngRoute',
    'apiService',
]).config(function ($routeProvider) {
    $routeProvider
      .when('/clientLogin', {
        template: '<client-login></client-login>'
      })
      .when('/adminLogin', {
        template: '<admin-login></admin-login>'
      })
      .when('/chooseClinic', {
        template: '<choose-clinic></choose-clinic>'
      })
      .otherwise({
        redirectTo: '/clientLogin'
      });
  });
