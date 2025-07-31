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
    'notActivated',
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
      .when('/client/:page', {
        template: '<client></client>'
      })
      .when('/clientProfile', {
        template: '<client-profile></client-profile>'
      })
      .when('/viewClientProfile/:clientID', {
        template: '<view-client-profile></view-client-profile>'
      })
      .when('/adminProfile', {
        template: '<admin-profile></admin-profile>'
      })
      .when('/clinicProfile', {
        template: '<clinic-profile></clinic-profile>'
      })
      .when('/clinicProfile/:clinicName', {
        template: '<clinic-profile></clinic-profile>'
      })
      .when('/adminDashboard', {
        template: '<admin-dashboard></admin-dashboard>'
      })
      .when('/clinicDashboard', {
        template: '<clinic-dashboard></clinic-dashboard>'
      })
      .when('/notActivated', {
        template: '<not-activated></not-activated>'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

// angular.module('clinicApp').run(function($rootScope, $location, sessionFactory, $http) {
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
//             sessionFactory.setUser(response.data.user);
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
//             sessionFactory.setUser(response.data.user);
//             $rootScope.$broadcast('userUpdated');
//             $location.path(next.originalPath);
//           }
//         })
//         .catch(function() {
//           $location.path('/');
//         });
//       }
//   });

// }) my code

// angular.module('clinicApp').run(function($rootScope, $location, sessionFactory, $http) {
//   const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
//   const clientRoutes = ['/clientProfile', '/notActivated'];

//   function validateAccess(allowedRoles, nextPath) {
//     const token = getCookieValue('api_auth_token');
//     $http({
//       method: 'GET',
//       url: apiUrl,
//       headers: { Authorization: 'Bearer ' + token }
//     })
//     .then(response => {
//       const { success, user } = response.data;
      
//       if (!success || !allowedRoles.includes(user.role)) {
//         return $location.path('/');
//       }

//       sessionFactory.setUser(user);
//       $rootScope.$broadcast('userUpdated');

//       if (user.accountStatus !== 'activated') {
//         // move to something
//         return $location.path('/notActivated')
//       }

//       $location.path(nextPath);
//     })
//     .catch(() => $location.path('/'));
//   }

//   $rootScope.$on('$routeChangeStart', (event, next) => {
//     const path = next.originalPath;

//     if (freeRoutes.includes(path)) return;

//     if (clientRoutes.includes(path)) {
//       return validateAccess(['client'], path);
//     }

//     // default to admin-level access check
//     validateAccess(['clinicAdmin', 'systemAdmin'], path);
//   });
// }); // clean code version


angular.module('clinicApp').run(function(sessionFactory, $location, $rootScope) {
  const freeRoutes = ['/:clinicName/signup', '/clientLogin', '/adminLogin', '/systemAdminLogin', '/'];
  const clientRoutes = ['/clientProfile', '/notActivated'];

  function validateAccess(allowedRoles, nextPath, user) {    
    if (!allowedRoles.includes(user.role)) {
      return $location.path('/');
    }
  }


  $rootScope.$on('$routeChangeStart', (event, next) => {
    if (freeRoutes.includes(next.originalPath)) return;
    sessionFactory.init()
    .then(function(user) {
      $rootScope.$broadcast('userUpdated');
      if (user.accountStatus !== 'activated') {
        // move to notActivated
        return $location.path('/notActivated')
      }
      const path = next.originalPath;
      if (clientRoutes.includes(path)) {
        return validateAccess(['client'], path, user);
      }
      validateAccess(['clinicAdmin', 'systemAdmin'], path, user);
    })
    .catch(function(error) {
      console.warn('Session init failed:', error);
      $location.path('/');
    });
  });

  
})