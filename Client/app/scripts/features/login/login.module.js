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
    'clinicFilter'
]).config(function ($routeProvider) {
    $routeProvider
      .when('/clientLogin', {
        template: '<client-login></client-login>'
      })
      .when('/adminLogin', {
        template: '<admin-login></admin-login>'
      })
      .when('/chooseClinic', {
        template: '<clinic-filter></clinic-filter><choose-clinic></choose-clinic>'
      })
      .otherwise({
        redirectTo: '/clientLogin'
      });
  });
