angular.module('clientProfile').controller('clientProfileController', function (apiClientProfile, $location, authService, $rootScope) {
    // call api jwt getUser to get info
    const vm = this;
    vm.username = '';
    vm.clinicName = '';
    vm.email = '';
    vm.accountStatus = '';
    const token = getCookieValue('api_auth_token');
    if(!token) {
        $location.path('/');
    }
    apiClientProfile.getUserAction(token).then(function(response) {
        const user = response.data.user;
        console.log(user);
        vm.username = user.username;
        vm.accountStatus = user.accountStatus;
        vm.email = user.email;
        vm.clinicName = user?.clinicAttendedID?.clinicName;
    }).catch(function(err) {

    })

    vm.logout = function() {
        authService.clearUser();
        $rootScope.$broadcast('userUpdated');
        document.cookie = `api_auth_token=; Path=/; Max-Age=0`;
        $location.path('/');
    }
});