angular.module('notActivated').controller('notActivatedController', function ($location, sessionFactory) {
  const vm = this;
  vm.accountStatus = sessionFactory.getUser().accountStatus;
  vm.logout = function() {
      sessionFactory.clearUser();
      document.cookie = `api_auth_token=; Path=/; Max-Age=0`;
      $location.path('/');
  }
});