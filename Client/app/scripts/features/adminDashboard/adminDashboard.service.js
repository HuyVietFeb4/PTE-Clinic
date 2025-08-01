angular.module('adminDashboardService', []).service('apiAdminDashboard', function($http) { 
    this.userReportAction = function(token) {
        return $http({
            method: 'GET',
            url: `http://172.26.16.1:8888/api/userReport`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
    this.getClinicsAction = function(params, token) {
        return $http({
            method: 'POST',
            url: `http://172.26.16.1:8888/api/getClinics`,
            data: params,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
})