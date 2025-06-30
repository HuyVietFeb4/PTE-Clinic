'use strict';
angular.module('apiService', [])
    .service('api', function($rootScope, $http, $q, $translate, $location, $window, messageAlert, viewerService, actionheroFactory) {
        var UNKNOWN_ERROR = errorCode ? errorCode.UNKNOWN_ERROR : 8;
        const protectedApis = [];
        this.call = function(url, params, options) {
            if (!params) {
                params = {};
            }
            if (!params.token) {
                if($rootScope.token == null)
                    params.token = 'TRACKING_TOKEN_NULL';
                else
                    params.token = $rootScope.token;
            }
            if (!params.userRoleSelected) {
                params.userRoleSelected = $rootScope.userRoleSelected;
            }

            params.currentVersion = $rootScope.currentVersionCode;
            params.currentPlatform = "";
            
            if($rootScope.getMobilePlatform === "ios"){
                params.currentPlatform = $rootScope.getMobilePlatform;
            }else if($rootScope.getMobilePlatform === "android"){
                params.currentPlatform = $rootScope.getMobilePlatform;
            }else{
                params.currentPlatform = 'web';
            }

            var showSpinner = false;
            var reqType = -1;
            var reqFrom = null;
            
            if(options){
                if(options.spinner){
                    showSpinner = true;
                }
                if(options.requestType){
                    reqType = options.requestType;
                }
                if(options.reqFrom){
                    reqFrom = options.reqFrom;
                }
            }

            var currentHost = $rootScope.host;
            if(!$rootScope.host){
                currentHost = $rootScope.defaultHost;
                return $http.post(currentHost + 'api/v3GetHostUrl?apiVersion=' + $rootScope.apiVersion, params).then(function(responseHost) {
                    if(responseHost && responseHost.data && responseHost.data.data){
                        $rootScope.host = responseHost.data.data;
                    }else{
                        $rootScope.host = $rootScope.defaultHost;
                    }
                    
                    return callApi(showSpinner, reqType, reqFrom, url, params);
                });
            }
            else{
                return callApi(showSpinner, reqType, reqFrom, url, params);
            }
            
        };
        function callApi(showSpinner, reqType, reqFrom, url, params){
            params.ApiStartTime = new Date();
            if(showSpinner){
              $rootScope.spinnerCounter++;
            }
            return $q(function (resolve, reject) {
                $http({
                        method: 'POST',
                        url: $rootScope.host + 'api/' + url + '?apiVersion=' + $rootScope.apiVersion, 
                        data: params,
                }).then(function(response) {
                    var connection = actionheroFactory.getConnection();
                    if(connection && connection.state == "disconnected" && !$rootScope.isLogOut){
                        actionheroFactory.init(false)
                    }
                    if(showSpinner){
                        $rootScope.spinnerCounter--;
                    }

                    // Update Token Value latest when any API called
                    var userData = localStorage.getItem(SessionConst.LOGIN_IN_DATA);
                    userData = JSON.parse(userData);

                    // Store latest date-time from server
                    if (response.data && response.data.CurrentDateOfServer) {
                        $rootScope.CurrentDateOfServer = response.data.CurrentDateOfServer;
                    } else {
                        $rootScope.CurrentDateOfServer = new Date();
                    }

                    
                    if (response && response.data && response.data.Token && userData && userData.Token) {
                        var responseTokenList = _.cloneDeep(response.data.Token);
                        if (responseTokenList && responseTokenList.length > 0) {
                            var currentToken = _.find(responseTokenList, {TokenValue: userData.Token.TokenValue});
                            if (currentToken) {
                                userData.Token.LastActionDate = currentToken.LastActionDate;
                                localStorage.setItem(SessionConst.LOGIN_IN_DATA, JSON.stringify(userData));
                                sessionStorage.setItem(SessionConst.LOGIN_IN_DATA, JSON.stringify(userData));
                            }
                        }
                    }
                    if(response.data.errorVersionCode && !$rootScope.useOldVersion){
                        errorHandler(response.data.errorVersionCode, response.data.errorMessageVersionCode, reqType, reqFrom, showSpinner, url);
                        return resolve(response.data);
                    }
                    else {
                        if (response.data.errorCode) {
                            if (response.data.errorCode === errorCode.OK || reqType === requestType.LOGIN) {
                                return resolve(response.data);
                            } else {
                                errorHandler(response.data.errorCode, "", reqType, reqFrom, showSpinner, url);
                                return reject(response.data.errorCode);
                            }
                        }  else if(response.data.error){
                            errorHandler(response.data.error, "", reqType, reqFrom, showSpinner, url);
                            return reject(UNKNOWN_ERROR);
                        } else {
                            return resolve(response.data);
                        }
                    }
                }, function(responseError) {
                      if (responseError.errorCode || (responseError.data && responseError.data.errorCode)) {
                        const errorCode = (responseError.data && responseError.data.errorCode) ? responseError.data.errorCode : responseError.errorCode;
                        const errorMessage = (responseError.data && responseError.data.error) ? responseError.data.error : "";
                        errorHandler(errorCode, errorMessage, reqType, reqFrom, showSpinner, url);
                      } else {
                        if (showSpinner) {
                          $rootScope.spinnerCounter--;
                        }
                      }
                      return reject(UNKNOWN_ERROR);
                });
            });
        }

        function errorHandler(errCode, errorMessage, reqType, reqFrom, showSpinner, apiName) {
            if(showSpinner){
                $rootScope.spinnerCounter--;
            }
            $rootScope.apiNameTimeout = apiName;
            if(errCode === errorCode.NO_INTERNET)
            {
                switch(reqType){
                    case requestType.GET:
                    case requestType.POST:
                    case requestType.LOGIN:
                    case requestType.SILENT:
                    {
                        messageAlert.openMessage($translate.instant('NoInternetMessage'), function(){

                        });
                        break;
                    }
                    default:
                        break;
                }
                return;
            }

            if(errCode === errorCode.REQUEST_TIMEOUT)
            {
                switch(reqType){
                    case requestType.GET:
                    {
                        // $location.path('/error/' + reqFrom);
                        messageAlert.showMessageApiServerError($rootScope.apiNameTimeout, function(){

                        });
                        break;
                    }
                    case requestType.POST:
                    {
                        // $location.path('/error/' + reqFrom);
                        messageAlert.showMessageApiServerError($rootScope.apiNameTimeout, function(){

                        });
                        break;
                    }
                    case requestType.LOGIN:
                    {
                        // bootbox.alert($translate.instant('NoInternetMessage'), function() {
                        messageAlert.showMessageApiServerError($rootScope.apiNameTimeout, function(){

                        });
                        break;
                    }
                    case requestType.SILENT:
                    {
                        break;
                    }
                    default:
                        break;
                }
                return;
            }

            if(errCode === errorCode.TOO_MANY_REQUESTS) {
                //// Close all current popup before show error message
                $("div[id^='popup']").each(function() {
                    $( this ).prop('class', 'modal ') // revert to default
                        .addClass('left')
                        .modal('hide');
                    if (!$('.modal-dialog').is(":visible")) {
                        $(".modal-body > ng-include").html('');
                        $(".modal-backdrop").remove();
                    }
                });
               
                messageAlert.openMessage(errorMessage);
              
              return;//
            }
            if(errCode === errorCode.OLD_VERSION_WEB || errCode === errorCode.OLD_VERSION_ANDROID || errCode === errorCode.OLD_VERSION_IOS){
                messageAlert.showMessageUpdateVersion(errorMessage, function(){
                    // submitLogin(username, passwordMD5, null, true)
                });
            }
            else{
                if(errCode === errorCode.OLD_MIN_VERSION_WEB || errCode === errorCode.OLD_MIN_VERSION_IOS || errCode === errorCode.OLD_MIN_VERSION_ANDROID){
                    messageAlert.showMessageRequireUpdateVersion(errorMessage, function(){

                    });
                    return;
                }
        
                if(errCode === errorCode.TOKEN_EXPIRED || errCode === errorCode.TOKEN_INVALID){
                    if(errCode === errorCode.TOKEN_EXPIRED){    //////////// Display message if Token expired
                        messageAlert.openMessage($translate.instant('SessionExpired'), function(){
                            clearSession();
                        });
                        return;
                    }
                    else{                                       //////////// Don't show popup, clear old session and redirect to login page
                        clearSession();
                        return;
                    }
                    
                }

                // error code return from server
                switch(reqType){
                    case requestType.GET:
                    { 
                        messageAlert.openMessage($translate.instant('ErrorMessage').replace('{0}', errCode));
                        break;
                    }
                    case requestType.POST:
                    {
                        messageAlert.openMessage($translate.instant('ErrorMessageUnknown'));
                        break;
                    }
                    case requestType.SILENT:
                    {
                        break;
                    }
                    default:
                        break;
                }
            }
            
        }

        function clearSession(){
            $location.path('/');
            $rootScope.clearDataSession();
            if(!$rootScope.$root.$$phase) {
                $rootScope.$apply();
            }
        }
    });
