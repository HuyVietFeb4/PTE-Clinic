angular.module('viewClientProfile').controller('viewClientProfileController', function (apiViewClientProfile, sessionFactory, $routeParams, $route, $timeout) {
    const vm = this;
    vm.username = '';
    vm.clinicName = '';
    vm.email = '';
    vm.accountStatus = '';
    vm.showAlert = false;
    vm.role = sessionFactory.getUser().role;
    vm.clientID = $routeParams.clientID;
    const token = getCookieValue('api_auth_token');
    const params = {
        clientID: vm.clientID
    }
    apiViewClientProfile.getClientAction(params, token).then(function(respond) {
        const client = respond.data.client;
        vm.username = client.username;
        vm.accountStatus = client.accountStatus;
        vm.email = client.email;
        vm.clinicName = client?.clinicAttendedID?.clinicName;
    }).catch(function(error) {
        console.log(error.message);
    })

    vm.clientEdit = function() {
        const params = {
            clientEmail: vm.email,
            pathToUpdate: [],
            valueToUpdate: []
        };

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
                $('#editClient').modal('hide');
                $timeout(() => {
                    $route.reload();
                }, 2000);
            }
        }

        // Handle error
        function handleError(contextLabel, err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert(contextLabel, false, errorMsg, vm.showAlert);
        }

        // Make API call
        const action = apiViewClientProfile.updateClientAction;
        const label = 'Update client';

        action(params, token)
            .then(response => handleUpdateResponse(label, response))
            .catch(err => handleError(label, err));
    };
});