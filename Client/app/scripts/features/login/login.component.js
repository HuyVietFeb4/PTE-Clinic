angular.module('login').component('clientLogin', {
    templateUrl: 'scripts/features/login/clientLogin.html',
    controller: 'clientLoginController',
    controllerAs: 'clientLogin'
});

angular.module('login').component('chooseClinic', {
    templateUrl: './chooseClinic.html',
    controller: 'chooseClinicController',
    controllerAs: 'chooseClinic'
});

angular.module('login').component('adminLogin', {
    templateUrl: './adminLogin.html',
    controller: 'adminLoginController',
    controllerAs: 'adminLogin'
});