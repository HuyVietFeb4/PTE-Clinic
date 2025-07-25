angular.module('login').controller('clientLoginController', function () {

});

angular.module('login').controller('adminLoginController', function (apiLogin) {
    this.showAlert = false;

    this.adminLogin = function() {
        const params = {
            email: this.emailLogin,
            password: this.passwordLogin,
            clinicName: this.clinicNameLogin,
        };
        apiLogin.clinicAdminLoginAction(params).then(function(response) {
            authenticationAlert('Clinic admin login', response.data.success, response.data.message, this.showAlert);
            document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            authenticationAlert('Clinic admin login', false, errorMsg, this.showAlert);
        });
    }
});

angular.module('login').controller('systemAdminLoginController', function (apiLogin) {
    this.showAlert = false;

    this.systemAdminLogin = function() {
        const params = {
            email: this.emailLogin,
            password: this.passwordLogin,
            token: 'i-have-been-authorized-by-the-company-to-use-system-admin-api',
        };
        apiLogin.systemAdminLoginAction(params).then(function(response) {
            authenticationAlert('System admin login', response.data.success, response.data.message, this.showAlert);
            document.cookie = `api_auth_token=${response.data.token}; Path=/; Max-Age=3600`;
        }).catch(function (err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            authenticationAlert('System admin login', false, errorMsg, this.showAlert);
        });
    }
});