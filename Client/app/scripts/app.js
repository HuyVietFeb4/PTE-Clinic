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
    'viewClientProfile',
    'adminProfile',
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
      .when('/viewClientProfile', {
        template: '<view-client-profile></view-client-profile>'
      })
      .when('/adminProfile', {
        template: '<admin-profile></admin-profile>'
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

// angular.module('clinicApp').run(function($rootScope, $location, authService, $http) {
//   $rootScope.$on('$routeChangeStart', function(event, next, current) {
//       const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
//       const clientRoutes = ['/clientProfile'];
//       if (!freeRoutes.includes(next.originalPath)) {
//         const token = getCookieValue('api_auth_token');
//         $http({
//             method: 'GET',
//             url: 'http://172.26.16.1:8888/api/validateToken',
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             }
//         })
//         .then(function(response) {
//           if (!response.data.success || (response.data.user.role !== 'clinicAdmin' && response.data.user.role !== 'systemAdmin')) {
//             $location.path('/');
//           }
//           else {
//             authService.setUser(response.data.user);
//             $rootScope.$broadcast('userUpdated');
//             $location.path(next.originalPath);
//           }
//         })
//         .catch(function() {
//           $location.path('/');
//         });
//       }
//       else if(clientRoutes.includes(next.originalPath)) {
//         const token = getCookieValue('api_auth_token');
//         $http({
//             method: 'GET',
//             url: 'http://172.26.16.1:8888/api/validateToken',
//             headers: {
//                 'Authorization': 'Bearer ' + token
//             }
//         })
//         .then(function(response) {
//           if (!response.data.success || response.data.user.role !== 'client') {
//             $location.path('/');
//           }
//           else {
//             authService.setUser(response.data.user);
//             $rootScope.$broadcast('userUpdated');
//             $location.path(next.originalPath);
//           }
//         })
//         .catch(function() {
//           $location.path('/');
//         });
//       }
//   });

// }) 

angular.module('clinicApp').run(function($rootScope, $location, authService, $http) {
  const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
  const clientRoutes = ['/clientProfile'];
  const apiUrl = 'http://172.26.16.1:8888/api/validateToken';

  function validateAccess(allowedRoles, nextPath) {
    const token = getCookieValue('api_auth_token');
    $http({
      method: 'GET',
      url: apiUrl,
      headers: { Authorization: 'Bearer ' + token }
    })
    .then(response => {
      const { success, user } = response.data;
      if (!success || !allowedRoles.includes(user.role)) {
        return $location.path('/');
      }
      authService.setUser(user);
      $rootScope.$broadcast('userUpdated');
      $location.path(nextPath);
    })
    .catch(() => $location.path('/'));
  }

  $rootScope.$on('$routeChangeStart', (event, next) => {
    const path = next.originalPath;

    if (freeRoutes.includes(path)) return;

    if (clientRoutes.includes(path)) {
      return validateAccess(['client'], path);
    }

    // default to admin-level access check
    validateAccess(['clinicAdmin', 'systemAdmin'], path);
  });
}); // clean code version