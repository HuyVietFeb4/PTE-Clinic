angular.module('headerApp').controller('headerAppController', function (apiHeader) {
    const token = getCookieValue('api_auth_token');
    const vm = this; 
    vm.links = [];
    vm.username = '';
    apiHeader.validateTokenAction(token).then(function(response){
        if(response.data.user) {
            console.log(response.data.user);
            vm.username = response.data.user.username;
            const role = response.data.user.role;
            if (role === 'systemAdmin') {
                vm.links = [
                    { name: 'Client', url: '#!/client' },
                    { name: 'Clinic', url: '#!/clinicDashboard' },
                    { name: 'Report', url: '#!/adminDashboard' }
                ];
            } else if (role === 'clinicAdmin') {
                vm.links = [
                    { name: 'Client', url: '#!/client' },
                    { name: 'Clinic', url: '#!/clinicProfile' }
                ];
            }

        }
   })
});