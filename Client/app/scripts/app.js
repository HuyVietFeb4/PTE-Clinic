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
    'signup',
    'client',
    'headerApp',
    'clientProfile',
    'clinicProfile',
    'adminDashboard',
    'clinicDashboard',
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:clinicName/signup', {
        template: '<signup></signup>'
      })
      .when('/clientLogin', {
        template: '<client-login></client-login>'
      })
      .when('/adminLogin', {
        template: '<admin-login></admin-login>'
      })
      .when('/systemAdminLogin', {
        template: '<system-admin-login></system-admin-login>'
      })
      .when('/adminLogin/chooseClinic', {
        template: '<choose-clinic></choose-clinic>'
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
      .when('/adminDashboard', {
        template: '<admin-dashboard></admin-dashboard>'
      }).when('/clinicDashboard', {
        template: '<clinic-dashboard></clinic-dashboard>'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

angular.module('clinicApp').factory('authService', function() {
  let currentUser = null;
  return {
    setUser(user) {
      currentUser = user;
    },
    getUser() {
      return currentUser;
    },
    clearUser() {
      currentUser = null;
    }
  };
})

angular.module('clinicApp').run(function($rootScope, $location, authService) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
      const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
      if (!freeRoutes.includes(next.originalPath)) {
        const user = authService.getUser();
        if (!user || (user.role !== 'clinicAdmin' && user.role !== 'systemAdmin')) {
          $location.path(current.originalPath || '/');
          return;
        }

        $location.path(next.originalPath);

      }
  });

}) 