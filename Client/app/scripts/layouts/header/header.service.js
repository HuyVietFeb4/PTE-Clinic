'use strict';
angular.module('headerService', []).service('apiHeader', function($http) { 
    this.validateTokenAction = function(token) {
        return $http({
            method: 'GET',
            url: 'http://172.26.16.1:8888/api/validateToken',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });
    }
})