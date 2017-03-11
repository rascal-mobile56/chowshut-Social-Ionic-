angular.module('controller.login', [])
    /*=================================================
         ngCrodva login Section
    =================================================*/
    //**** Login Controller ***/
    .controller('loginCtrl', function($scope, $state, $ionicHistory, TwitterFactory, FacebookFactory,globalValues) {


        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();

        $scope.login = function(platform) {
            localStorage.setItem(globalValues.loginType, platform);
            if (platform == 'twitter') {
                TwitterFactory.login($scope).then(function(responce){
                    console.log(responce);
                    console.log('above response for deffered');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $state.go('tab');
                },function(error){
                    console.log(error)
                });
            } else if (platform == 'facebook') {
                FacebookFactory.login($scope).then(function(responce){
                    console.log(responce);
                    console.log('above response for deffered');
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    $state.go('tab');
                },function(error){
                    console.log(error)
                });
            }                     
        }

    })
