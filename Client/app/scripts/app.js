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
    'adminDashboard'
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
      })
      .otherwise({
        redirectTo: '/'
      });
  });

function getCookieValue(cookieName) {
  const cookies = document.cookie.split('; ');
  for (let cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === cookieName) {
      return value;
    }
  }
  return null;
}

angular.module('clinicApp').run(function($rootScope, $location, $http) {
  $rootScope.$on('$routeChangeStart', function(event, next, current) {
      const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
      if (!freeRoutes.includes(next.originalPath)) {
        // $http.get('http://172.26.16.1:8888/api/validateToken', { withCredentials: true })
        const token = getCookieValue('api_auth_token');
        $http({
            method: 'GET',
            url: 'http://172.26.16.1:8888/api/validateToken',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
          .then(function(response) {
            if (!response.data.success || (response.data.role !== 'clinicAdmin' && response.data.role !== 'systemAdmin')) {
              $location.path('/adminLogin');
            }
            else {
              $location.path(next.originalPath);
            }
          })
          .catch(function() {
            $location.path('/adminLogin');
          });
      }
  });

}) 