angular.module('clinicApp').factory('sessionFactory', ['$http', '$q', function($http, $q) {
    let user = null;
    let apiUrl = 'http://172.26.16.1:8888/api/validateToken';
    let session = {
        init: function() {
            let deferred = $q.defer();
            const token = getCookieValue('api_auth_token');
            if(token) {
                $http({
                    method: 'POST',
                    url: apiUrl,
                    headers: { Authorization: 'Bearer ' + token }
                }) 
                .then(function(response) {
                    user = response.data.user;
                    deferred.resolve(user);
                }, function(error) {
                    deferred.reject(error);
                })
            } else {
                deferred.reject('No token found');
            }
            return deferred.promise;
        },

        getUser: function() {
            return user;
        },

        clearUser: function() {
            user = null;
        },
    };
    return session;
}])