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


      apiSignup.signupAction(params).then(function(response) {
        triggerAlert('Signup', response.data.success, response.data.message, this.showAlert);
      }).catch(function (err) {
        triggerAlert('Signup', false, err.data.error, this.showAlert);
      });
    }
});