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


angular.module('login').controller('loginController', function (apiLogin, $location, $timeout, $route) {
    const vm = this;
    vm.showAlert = false;
    vm.phase2 = false;
    vm.clinicList = [];
    vm.loginPhase1 = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
        };
        apiLogin.loginAction(params).then(function(response) {
            if(response.data.success && response.data.token) {
                triggerAlert('Login phase 1', response.data.success, response.data.message, vm.showAlert);
                $timeout(function() {
                    document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
                    $location.path('/');
                }, 2000);
            }
            else if (response.data.success && response.data.clinicList){
                triggerAlert('Login phase 1', response.data.success, response.data.message, vm.showAlert);
                vm.phase2 = true;
                vm.clinicList = response.data.clinicList;
            }
            triggerAlert('Login', response.data.success, response.data.message, vm.showAlert);
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert('Login', false, errorMsg, vm.showAlert);
        });
    }


    vm.loginPhase2 = function() {
        const params = {
            email: vm.emailLogin,
            password: vm.passwordLogin,
            clinicName: vm.clinicNameLogin,
        };
        apiLogin.loginAction(params).then(function(response) {
            triggerAlert('Login', response.data.success, response.data.message, vm.showAlert);
            if(response.data.success && response.data.token) {
                $timeout(function() {
                    document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
                    $location.path('/');
                }, 2000);
            }
            else {
                $timeout(function() {
                    $route.reload();
                }, 3000);
            }
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert('Login', false, errorMsg, vm.showAlert);
        });
    }

});