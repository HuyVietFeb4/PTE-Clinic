'use strict';
angular.module('clinicDashboardService', []).service('apiClinicDashboard', function($http) { 
    this.addClinicAction = function(params) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/addClinic',
            data: params,
            headers: {
                'Authorization': 'Bearer ' + 'i-have-been-authorized-by-the-company-to-use-system-admin-api'
            }
        });
    }
    this.addAdminAction = function(params) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/signup',
            data: params,
            headers: {
                'Authorization': 'Bearer ' + 'i-have-been-authorized-by-the-company-to-use-system-admin-api'
            }
        })
    }
    this.getClinics = function(params, token) {
        return $http({
            method: 'POST',
            url: 'http://172.26.16.1:8888/api/getClinics',
            data: params,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
    }
})