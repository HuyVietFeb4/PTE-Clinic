angular.module('clinicProfile').controller('clinicProfileController', function (sessionFactory, apiClinicProfile, $routeParams, $route) {
    const vm = this;
    vm.clinicName = '';
    vm.locationName = '';
    vm.number = '';
    vm.street = '';
    vm.ward = '';
    vm.district = '';
    vm.city = '';
    vm.state = '';
    vm.country = '';

    const admin = sessionFactory.getUser();
    const token = getCookieValue('api_auth_token');
    if(admin.role === 'clinicAdmin') { // maybe this if is only for taking the clinicInfo
        // get clinic based on admin.clinicAdministeredID
        // maybe write one api call to get 1 single clinic profile based on clinic name or can be dynamic but not list as before
        const params = {
            pathToFind: '_id',
            valuesToFind: admin.clinicAdministeredID,
        }
        
        apiClinicProfile.getClinicAction(params, token).then(function(response) {
            const clinic = response.data.clinic[0];
            const clinicLocation = clinic.clinicLocation[0];
            vm.clinicName = clinic.clinicName;
            vm.locationName = clinicLocation.locationName;
            vm.number = clinicLocation.number;
            vm.street = clinicLocation.street;
            vm.ward = clinicLocation.ward;
            vm.district = clinicLocation.district;
            vm.city = clinicLocation.city;
            vm.state = clinicLocation.state;
            vm.country = clinicLocation.country;
        }).catch(function(error) {
            console.log(error.message)
        });
    }
    else if(admin.role === 'systemAdmin'){ // take info from route
        
    }
});