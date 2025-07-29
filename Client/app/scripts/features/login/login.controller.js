angular.module('login').controller('clientLoginController', function (apiLogin, $location, sessionFactory, $timeout) {
    const vm = this;
    vm.showAlert = false;

    vm.clientLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
        };
        apiLogin.clientLoginAction(params).then(function(response) {
            triggerAlert('Client login', response.data.success, response.data.message, vm.showAlert);
            if(response.data.success) {
                $timeout(function() {
                    document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
                    $location.path('/');
                }, 2000);
            }
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert('Client login', false, errorMsg, vm.showAlert);
        });
    }
});

angular.module('login').controller('adminLoginController', function (apiLogin, $location, $timeout) {
    const vm = this;
    this.showAlert = false;

    vm.adminLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
            clinicName: vm.clinicNameLogin,
        };
        apiLogin.clinicAdminLoginAction(params).then(function(response) {
            triggerAlert('Clinic admin login', response.data.success, response.data.message, vm.showAlert);
            if(response.data.success) {
                $timeout(function() {
                    document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
                    $location.path('/');
                }, 2000);
            }
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert('Clinic admin login', false, errorMsg, vm.showAlert);
        });
    }
});

angular.module('login').controller('systemAdminLoginController', function (apiLogin, $location, $timeout) {
    const vm = this;
    vm.showAlert = false;
    vm.systemAdminLogin = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
            token: 'i-have-been-authorized-by-the-company-to-use-system-admin-api',
        };
        apiLogin.systemAdminLoginAction(params).then(function(response) {
            triggerAlert('System admin login', response.data.success, response.data.message, vm.showAlert);
            if(response.data.success) {
                $timeout(function() {
                    document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
                    $location.path('/');
                }, 2000);
            }
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert('System admin login', false, errorMsg, vm.showAlert);
        });
    }
});