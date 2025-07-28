angular.module('headerApp').controller('headerAppController', function ($scope, authService) {
  const vm = this;

  vm.links = [];
  vm.username = '';
  vm.loggedIn = false;

  function updateHeader() {
    const user = authService.getUser();
    if (user) {
      vm.username = user.username;
      vm.loggedIn = true;

      const role = user.role;
      vm.links = [];

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
  }

  // Initial attempt to render
  updateHeader();

  // Listen for user update event
  $scope.$on('userUpdated', function () {
    updateHeader();
  });
});