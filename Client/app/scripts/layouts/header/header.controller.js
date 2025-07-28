angular.module('headerApp').controller('headerAppController', function (authService) {
    const token = getCookieValue('api_auth_token');
    const vm = this; 
    vm.links = [];
    vm.username = '';
    const user = authService.getUser();
    if(user) {
        vm.username = user.username;
        const role = user.role;
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
});