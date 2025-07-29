angular.module('adminProfileService', []).service('apiAdminProfile', function($http) { 
    this.getUserAction = function(token) {
        return $http({
            method: 'GET',
            url: `http://172.26.16.1:8888/api/getUser`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
    this.updateAdminAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/updateAdmin`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
    this.updateSystemAdminAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/updateSystemAdmin`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})