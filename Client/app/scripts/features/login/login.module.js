'use strict';

/**
 * @ngdoc overview
 * @name login
 * @description
 * Login module of the application.
 */
angular.module('login', [
    'ngRoute'
]).config(function ($routeProvider) {
    $routeProvider
      .when('/clientLogin', {
        template: '<client-login></client-login>'
      })
      .otherwise({
        redirectTo: '/clientLogin'
      });
  });
