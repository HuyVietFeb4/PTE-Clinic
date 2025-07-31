angular.module('clinicDashboard').controller('clinicDashboardController', function (apiClinicDashboard, $location) {
    const vm = this;
    vm.showAleart = false;
    vm.clinics = [];
    const token = getCookieValue('api_auth_token');
    vm.fetchClinics = function() { 
        const params = {
            getClientAttendees: false,
        }
        apiClinicDashboard.getClinics(params, token).then(function(response) {
            vm.clinics = response.data.clinics;
        }).catch(function(error) {
            console.log(error.message);
        }) 
    }

    vm.goToClinic = function(clinicName) {
        $location.path(`/clinicProfile/${clinicName}`);
    }

    vm.addClinicandAdmin = function() {
        const addClinicParams = {
            clinicName: vm.addClinicName,
            locationName: vm.addLocationName,
            number: vm.addNumber,
            street: vm.addStreet,
            ward: vm.addWard,
            district:  vm.addDistrict,
            city:   vm.addCity,
            state: vm.addState,
            country: vm.addCountry
        }

        const adminPassword = generateRandomPassword();
        const addAdminParams = {
            username: vm.addUsername,
            email: vm.addEmail,
            password: adminPassword,
            clinicName: vm.addClinicName,
            role: 'clinicAdmin',
        }

        // const token = getCookieValue('api_auth_token');
        apiClinicDashboard.addClinicAction(addClinicParams).then(function(response) {
            apiClinicDashboard.addAdminAction(addAdminParams).then(function(response) {
                triggerAlert('Add clinic and admin', true, response.data.message, vm.showAlert);
                console.log(adminPassword);
            }).catch(function (err) {
                triggerAlert('Add clinic and admin', false, err.data.error, vm.showAlert);
            });
        }).catch(function (err) {
            triggerAlert('Add clinic and admin', false, err.data.error, vm.showAlert);
        });
    }

    vm.fetchClinics();

});