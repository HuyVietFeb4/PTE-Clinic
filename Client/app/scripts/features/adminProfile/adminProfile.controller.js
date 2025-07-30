angular.module('adminProfile').controller('adminProfileController', function (apiAdminProfile, $location, sessionFactory, $rootScope, $timeout) {
    // call api jwt getUser to get info
    const vm = this;
    vm.username = '';
    vm.clinicName = '';
    vm.email = '';
    vm.accountStatus = '';
    vm.showAlert = false;
    vm.role = '';
    const token = getCookieValue('api_auth_token');
    apiAdminProfile.getUserAction(token).then(function(response) {
        const user = response.data.user;
        vm.username = user.username;
        vm.accountStatus = user.accountStatus;
        vm.email = user.email;
        vm.clinicName = user?.clinicAdministeredID?.clinicName;
        vm.role = user.role;
    }).catch(function(err) {
        const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
        triggerAlert('Set up admin profile', false, errorMsg, vm.showAlert);
    })

    vm.logout = function() {
        sessionFactory.clearUser();
        $rootScope.$broadcast('userUpdated');
        document.cookie = `api_auth_token=; Path=/; Max-Age=0`;
        $timeout(() => { $location.path('/'); }, 2000);
        
    }
    
    // vm.adminEdit = function() {
    //     const params = {}
    //     if(vm.role === 'clinicAdmin') {
    //         params = {
    //             adminEmail: vm.email,
    //             clinicName: vm.clinicName,
    //             pathToUpdate: [],
    //             valueToUpdate: []
    //         }
    //     }
    //     else {
    //         params = {
    //             adminEmail: vm.email,
    //             pathToUpdate: [],
    //             valueToUpdate: []
    //         }
    //     }

    //     for (let key in vm) {
    //         if (key.startsWith('edit') && vm[key] !== undefined && vm[key] !== '') {
    //             const path = key.replace(/^edit/, ''); // e.g., editusername → username
    //             params.pathToUpdate.push(path);
    //             params.valueToUpdate.push(vm[key]);
    //         }
    //     }

    //     console.log(params);
    //     if(vm.role === 'clinicAdmin') { 
    //         apiAdminProfile.updateAdminAction(params, token).then(function(response) {
    //             triggerAlert('Update admin', response.data.success, response.data.message, vm.showAlert);
    //             if(response.data.success) {
    //                 $('#editAdmin').modal('hide');
    //                 $timeout(function() {
    //                     vm.logout();
    //                     $location.path('/');
    //                 }, 2000);
    //             }
    //         }).catch(function(err) {
    //             const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
    //             triggerAlert('Update admin', false, errorMsg, vm.showAlert);
    //         })
    //     }
    //     else {
    //         apiAdminProfile.updateSystemAdminAction(params, token).then(function(response) {
    //             triggerAlert('Update system admin', response.data.success, response.data.message, vm.showAlert);
    //             if(response.data.success) {
    //                 $('#editAdmin').modal('hide');
    //                 $timeout(function() {
    //                     vm.logout();
    //                     $location.path('/');
    //                 }, 2000);
    //             }
    //         }).catch(function(err) {
    //             const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
    //             triggerAlert('Update system admin', false, errorMsg, vm.showAlert);
    //         })
    //     }
        
    // }

    vm.adminEdit = function() {
        const isClinicAdmin = vm.role === 'clinicAdmin';

        const params = {
            adminEmail: vm.email,
            pathToUpdate: [],
            valueToUpdate: []
        };

        if (isClinicAdmin) {
            params.clinicName = vm.clinicName;
        }

        // Dynamically populate updates
        for (let key in vm) {
            if (key.startsWith('edit') && vm[key] !== undefined && vm[key] !== '') {
                const path = key.replace(/^edit/, '');
                params.pathToUpdate.push(path);
                params.valueToUpdate.push(vm[key]);
            }
        }

        // Handle response
        function handleUpdateResponse(contextLabel, response) {
            triggerAlert(contextLabel, response.data.success, response.data.message, vm.showAlert);
            if (response.data.success) {
                $('#editAdmin').modal('hide');
                $timeout(() => {
                    vm.logout();
                }, 2000);
            }
        }

        // Handle error
        function handleError(contextLabel, err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert(contextLabel, false, errorMsg, vm.showAlert);
        }

        // Make API call
        const action = isClinicAdmin ? apiAdminProfile.updateAdminAction : apiAdminProfile.updateSystemAdminAction;
        const label = isClinicAdmin ? 'Update admin' : 'Update system admin';

        action(params, token)
            .then(response => handleUpdateResponse(label, response))
            .catch(err => handleError(label, err));
    };
});