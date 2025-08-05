angular.module('client').controller('clientController', function (apiClient, $routeParams, $location, $route, sessionFactory, $timeout) {
    const vm = this;
    vm.clientsPerPage = 6;
    vm.currentPage = (parseInt($routeParams.page) > 0) ? parseInt($routeParams.page) : 1; // skip = (currentPage - 1) * limit
    
    vm.showAlert = false;
    vm.sortPath = '';
    vm.clients = [];
    vm.totalClients = 0;
    vm.totalPages = 0;
    vm.numAdjacentPages = 2;
    vm.user = sessionFactory.getUser();
    const token = getCookieValue('api_auth_token');

    vm.addClient = function() {
        const clientPassword = generateRandomPassword();
        const params = {
            username: vm.addUsername,
            email: vm.addEmail,
            password: clientPassword,
            clinicName: vm.addClinicName,
            role: 'client',
        }

        apiClient.addClientAction(params, token).then(function(response) {
            triggerAlert('Add client', response.data.success, response.data.message, vm.showAlert);
            if(response.data.success) {
                console.log(clientPassword);
                $('#addClient').modal('hide');
                $timeout(() => {
                    $route.reload();
                }, 5000);
            }
        }).catch(function (err) {
            triggerAlert('Add client', false, err.data.error, vm.showAlert);
        });
    }

    vm.fetchClients = function() {
        if(vm.valuesToFind && vm.pathToFind) {
            apiClient.searchClientParams.pathToFind = [vm.pathToFind];
            apiClient.searchClientParams.valuesToFind = [vm.valuesToFind];
        }

        const params = {
            limit: vm.clientsPerPage,
            skip: (vm.currentPage - 1) * vm.clientsPerPage ,
            getLocation: false,
            pathToFind: apiClient.searchClientParams.pathToFind,
            valuesToFind: apiClient.searchClientParams.valuesToFind
        };
        apiClient.getClients(params, token).then(function(response) {
            vm.clients = response.data.clients;
            vm.totalClients = response.data.totalCount;
            vm.totalPages = Math.ceil(vm.totalClients / vm.clientsPerPage);
        }).catch(function(error) {
            console.log(error.message);
        }) 
    }

    vm.nextPage = function() {
        if (vm.currentPage * vm.clientsPerPage < vm.totalCount) {
            vm.currentPage++;
            vm.fetchClients();
        }
    };

    vm.previousPage = function() {
        if (vm.currentPage > 1) {
            vm.currentPage--;
            vm.fetchClients();
        }
    };

    vm.goToPage = function(newPage) {
        vm.currentPage = newPage;
        vm.fetchClients();
    }

    vm.goToClient = function(clientID) {
        $location.path(`/viewClientProfile/${clientID}`);
    }

    vm.refreshPage = function() {
        $route.reload();
    }

    vm.fetchClients();


});