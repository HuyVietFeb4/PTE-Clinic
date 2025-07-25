angular.module('signup').controller('signupController', function ($routeParams, apiSignup) {
    this.showAlert = false;
    this.clinicNameSignup = $routeParams.clinicName;
    this.signup = function() {
      const params = {
        username: this.usernameSignup,
        email: this.emailSignup,
        password: this.passwordSignup,
        clinicName: this.clinicNameSignup,
        role: 'client',
      };


    const authenticationAlert = function(action, success, message) {
        const alertClass = success ? 'alert-success' : 'alert-danger';
        const alertState = success ? 'successfully' : 'failed';
        $('#authAlert').removeClass().addClass(`alert ${alertClass} alert-dismissible`);
        $('#authState').text(alertState);

        // reset message
        $('#alertMessage').text('');
        if (!success) $('#alertMessage').text(message);
        $('#authAction').text(action);
        this.showAlert = true;
    };

      apiSignup.signupAction(params).then(function(response) {
        authenticationAlert('Signup', response.data.success, response.data.message);
      }).catch(function (err) {
        authenticationAlert('Signup', false, err.data.error);
      });
    }
});