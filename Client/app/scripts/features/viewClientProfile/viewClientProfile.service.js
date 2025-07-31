angular.module('viewClientProfileService', []).service('apiViewClientProfile', function($http) { 
    this.getClientAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/getClientByID`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    this.updateClientAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/updateClient`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})