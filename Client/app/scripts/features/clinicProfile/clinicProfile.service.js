angular.module('clinicProfileService', []).service('apiClinicProfile', function($http) { 
    this.getClinicsAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/getClinics`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    this.getClinicAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/getClinic`,
            params: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})