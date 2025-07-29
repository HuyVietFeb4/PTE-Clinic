angular.module('adminProfile').controller('adminProfileController', function (apiAdminProfile, $location, sessionFactory, $rootScope) {
    // call api jwt getUser to get info
    const vm = this;
    vm.username = '';
    vm.clinicName = '';
    vm.email = '';
    vm.accountStatus = '';
    const token = getCookieValue('api_auth_token');
    apiAdminProfile.getUserAction(token).then(function(response) {
        const user = response.data.user;
        vm.username = user.username;
        vm.accountStatus = user.accountStatus;
        vm.email = user.email;
        vm.clinicName = user?.clinicAdministeredID?.clinicName;
    }).catch(function(err) {

    })

    vm.logout = function() {
        sessionFactory.clearUser();
        $rootScope.$broadcast('userUpdated');
        document.cookie = `api_auth_token=; Path=/; Max-Age=0`;
        $location.path('/');
    }
});