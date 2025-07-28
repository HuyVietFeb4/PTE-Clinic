angular.module('clientProfileService', []).service('apiClientProfile', function($http) { 
    this.getUserAction = function(token) {
        return $http({
            method: 'GET',
            url: `http://172.26.16.1:8888/api/getUser`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})