angular.module('headerApp').controller('headerAppController', function ($scope, sessionFactory) {
  const vm = this;

  vm.links = [];
  vm.username = '';
  vm.loggedIn = false;

  vm.linkProfile = '#!/';
  function updateHeader() {
    const user = sessionFactory.getUser();
    if (user) {
      vm.username = user.username;
      vm.loggedIn = true;

      const role = user.role;
      vm.links = [];

      if (role === 'systemAdmin') {
        vm.linkProfile = '#!/adminProfile';
        vm.links = [
          { name: 'Client', url: '#!/client' },
          { name: 'Clinic', url: '#!/clinicDashboard' },
          { name: 'Report', url: '#!/adminDashboard' }
        ];
      } else if (role === 'clinicAdmin') {
        vm.linkProfile = '#!/adminProfile';
        vm.links = [
          { name: 'Client', url: '#!/client/1' },
          { name: 'Clinic', url: '#!/clinicProfile' }
        ];
      }
      else {
        vm.linkProfile = '#!/clientProfile'; // fix later
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