angular.module('clinicDashboard').controller('clinicDashboardController', function (apiClinicDashboard) {
    this.showAleart = false;
    this.addClinicandAdmin = function() {
        const addClinicParams = {
            clinicName: this.addClinicName,
            locationName: this.addLocationName,
            number: this.addNumber,
            street: this.addStreet,
            ward: this.addWard,
            district:  this.addDistrict,
            city:   this.addCity,
            state: this.addState,
            country: this.addCountry
        }

        const addminPassword = generateRandomPassword();
        const addAdminParams = {
            username: this.addUsername,
            email: this.addEmail,
            password: addminPassword,
            clinicName: this.addClinicName,
            role: 'clinicAdmin',
        }

        // const token = getCookieValue('api_auth_token');
        apiClinicDashboard.addClinicAction(addClinicParams).then(function(response) {
            apiClinicDashboard.addAdminAction(addAdminParams).then(function(response) {
                let message = response.data.message + `\n password is: ${addminPassword}.`;
                console.log(message);
                authenticationAlert('Add clinic and admin', true, message, this.showAlert);
            }).catch(function (err) {
                authenticationAlert('Add clinic and admin', false, err.data.error, this.showAlert);
            });
        }).catch(function (err) {
            authenticationAlert('Add clinic and admin', false, err.data.error, this.showAlert);
        });

    }

});