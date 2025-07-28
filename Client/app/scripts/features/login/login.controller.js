angular.module('login').controller('clientLoginController', function (apiLogin, authService) {
    const vm = this;
    vm.showAlert = false;

    vm.clientLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
        };
        apiLogin.clientLoginAction(params).then(function(response) {
            authenticationAlert('Client login', response.data.success, response.data.message, vm.showAlert);
            document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;

            apiLogin.validateTokenAction(response.data.token).then(function(response) {
                authService.setUser(response.data.user);
            })
            .catch(function (err) {
                const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
                authenticationAlert('Authenticate token', false, errorMsg, vm.showAlert);
            });
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            authenticationAlert('Client login', false, errorMsg, vm.showAlert);
        });
    }
});

angular.module('login').controller('adminLoginController', function (apiLogin, authService) {
    const vm = this;
    this.showAlert = false;

    vm.adminLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
            clinicName: vm.clinicNameLogin,
        };
        apiLogin.clinicAdminLoginAction(params).then(function(response) {
            authenticationAlert('Clinic admin login', response.data.success, response.data.message, vm.showAlert);
            document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;

            apiLogin.validateTokenAction(response.data.token).then(function(response) {
                authService.setUser(response.data.user);
            })
            .catch(function (err) {
                const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
                authenticationAlert('Authenticate token', false, errorMsg, vm.showAlert);
            });
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            authenticationAlert('Clinic admin login', false, errorMsg, vm.showAlert);
        });
    }
});

angular.module('login').controller('systemAdminLoginController', function (apiLogin, authService) {
    const vm = this;
    this.showAlert = false;

    vm.systemAdminLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
            token: 'i-have-been-authorized-by-the-company-to-use-system-admin-api',
        };
        apiLogin.systemAdminLoginAction(params).then(function(response) {
            authenticationAlert('System admin login', response.data.success, response.data.message, vm.showAlert);
            document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;

            apiLogin.validateTokenAction(response.data.token).then(function(response) {
                authService.setUser(response.data.user);
            })
            .catch(function (err) {
                const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
                authenticationAlert('Authenticate token', false, errorMsg, vm.showAlert);
            });
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            authenticationAlert('System admin login', false, errorMsg, vm.showAlert);
        });
    }
});