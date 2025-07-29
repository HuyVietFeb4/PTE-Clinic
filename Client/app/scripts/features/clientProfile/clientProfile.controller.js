angular.module('clientProfile').controller('clientProfileController', function (apiClientProfile, $location, sessionFactory, $rootScope) {
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
        vm.username = user.username;
        vm.accountStatus = user.accountStatus;
        vm.email = user.email;
        vm.clinicName = user?.clinicAttendedID?.clinicName;
    }).catch(function(err) {

    })

    vm.logout = function() {
        sessionFactory.clearUser();
        $rootScope.$broadcast('userUpdated');
        document.cookie = `api_auth_token=; Path=/; Max-Age=0`;
        $location.path('/');
    }

    vm.clientEdit = function() {
        const params = {
            clientEmail: vm.email,
            pathToUpdate: [],
            valueToUpdate: []
        }

        for (let key of vm) {
            if (key.startsWith('edit') && vm[key] !== undefined && vm[key] !== '') {
                const path = key.replace(/^edit/, ''); // e.g., editusername → username
                params.pathToUpdate.push(path);
                params.valueToUpdate.push(vm[key]);
            }
        }

        console.log('Update Params:', params);


    }
});