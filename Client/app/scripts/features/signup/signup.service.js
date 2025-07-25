'use strict';
angular.module('signupService', []).service('apiSignup', function($http) { 
    this.signupAction = function(params) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/signup',
            data: params,
        });
    }
})