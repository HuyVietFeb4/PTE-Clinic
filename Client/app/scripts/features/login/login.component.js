angular.module('login').component('clientLogin', {
    templateUrl: 'scripts/features/login/clientLogin.html',
    controller: 'clientLoginController',
    controllerAs: 'clientLoginCtrl'
});

angular.module('login').component('chooseClinic', {
    templateUrl: 'scripts/features/login/chooseClinic.html',
    controller: 'chooseClinicController',
    controllerAs: 'chooseClinicCtrl'
});

angular.module('login').component('adminLogin', {
    templateUrl: 'scripts/features/login/adminLogin.html',
    controller: 'adminLoginController',
    controllerAs: 'adminLoginCtrl'
});