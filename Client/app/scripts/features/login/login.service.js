'use strict';
angular.module('loginService', []).service('apiLogin', function($http) { 
    this.systemAdminLoginAction = function(params) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/systemAdminLogin',
            data: params,
        });
    }

    this.clinicAdminLoginAction = function(params) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/adminLogin',
            data: params,
        });
    }
})