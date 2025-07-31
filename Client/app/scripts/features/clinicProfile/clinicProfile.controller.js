angular.module('clinicProfile').controller('clinicProfileController', function (sessionFactory, apiClinicProfile, $routeParams, $route, $timeout) {
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
    vm.showAlert = false;
    vm.role = '';
    vm.clinicEdit = function() {

    }
    const admin = sessionFactory.getUser();
    vm.role = admin.role;
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
            
        // Handle response
        vm.handleUpdateResponse = function (contextLabel, response) {
            triggerAlert(contextLabel, response.data.success, response.data.message, vm.showAlert);
            if (response.data.success) {
                $('#editClinic').modal('hide');
                $timeout(() => {
                }, 2000);
            }
        }

        // Handle error
        vm.handleError = function (contextLabel, err) {
            const errorMsg = err?.data?.error || err?.message || 'Something went wrong';
            triggerAlert(contextLabel, false, errorMsg, vm.showAlert);
        }


        vm.clinicEdit = function() {
            let editSuccessfully = true;
            if(vm.editclinicName != '') { 
                const editClinicParams = {
                    clinicName: vm.clinicName,
                    pathToUpdate: ['clinicName'],
                    valueToUpdate: [vm.editclinicName]
                }

                const action = apiClinicProfile.updateClinicAction;
                const label = 'Update clinic';
                action(editClinicParams, token)
                .then(response => vm.handleUpdateResponse(label, response))
                .catch(err => {
                    vm.handleError(label, err)
                    editSuccessfully = false
                });


            }
            if(editSuccessfully) {
                const editLocationParams = {
                    locationName: vm.locationName,
                    pathToUpdate: [],
                    valueToUpdate: []
                }
                let isUpdateLocation = false;
                for (let key in vm) {
                    if (key.startsWith('edit') && vm[key] !== undefined && vm[key] !== '' && !['editclinicName'].includes(key)) {
                        const path = key.replace(/^edit/, '');
                        isUpdateLocation = true;
                        editLocationParams.pathToUpdate.push(path);
                        editLocationParams.valueToUpdate.push(vm[key]);
                    }
                }
                if(isUpdateLocation) {
                    const action = apiClinicProfile.updateLocationAction;
                    const label = 'Update clinic location';
                    action(editLocationParams, token)
                    .then(response => {
                        vm.handleUpdateResponse(label, response);
                        $timeout(() => {
                            $route.reload();
                        }, 2000);
                    })
                    .catch(err => {
                        vm.handleError(label, err);
                        console.log(err);
                        $timeout(() => {
                            $route.reload();
                        }, 2000);
                    });
                }
                
            }
        }
    }
    else if(admin.role === 'systemAdmin'){ // take info from route
        const params = {
            pathToFind: 'clinicName',
            valuesToFind: $routeParams.clinicName,
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
});