angular.module('signup').controller('signupController', function (api) {
    this.showAlert = false;
    this.signup = function() {
      const params = {
        Email: this.emailSignup,
        Username: this.usernameSignup,
        Password: this.passwordSignup,
        Role: this.roleSignup
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

      api.signupAction(params).then(function(response) {
        authenticationAlert('Signup', response.data.success, response.data.message);
      }).catch(function (err) {
        console.log(err);
        authenticationAlert('Signup', false, err.data.error);
      });

    }
});