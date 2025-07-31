angular.module('clientService', []).service('apiClient', function($http) { 
    this.searchClientParams = {
        valuesToFind: [],
        pathToFind: [],
    }
    this.getClients = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/getClients`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})