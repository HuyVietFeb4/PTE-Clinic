'use strict';

/**
 * @ngdoc overview
 * @name signup
 * @description
 * Signup module of the application.
 */
angular.module('signup', [
    'ngRoute',
    'apiService'
]).config(function ($routeProvider) {
    $routeProvider
      .when('/signup', {
        template: '<signup></signup>'
      })
      .otherwise({
        redirectTo: '/signup'
      });
  });
