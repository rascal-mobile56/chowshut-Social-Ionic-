angular.module('controller.hometab', [])
    /*=================================================
         ngCrodva login Section
    =================================================*/
    //**** Login Controller ***/
   /**** tab Home Controller ***/
    .controller('tabHomeCtrl', function($scope, $ionicHistory, $state,$twitterApi,toastr,globalValues) {

        var provider = localStorage.getItem(globalValues.loginType);
        var user = localStorage.getItem('user');
        var facebookUserProfile = JSON.parse(localStorage.getItem(globalValues.facebookUserProfile));
        var twitterUserProfile = JSON.parse(localStorage.getItem(globalValues.twitterUserProfile));

        console.log('Facebook:' + JSON.stringify(facebookUserProfile));
        console.log('twitter:' + JSON.stringify(twitterUserProfile));
              
        // $scope.username = user;
        $scope.provider = provider;
        if (provider == 'facebook') {
            $scope.username = facebookUserProfile.name;
            $scope.userProfileImage = facebookUserProfile.picture.data.url;
        } else if (provider == 'twitter') {
            $scope.username = twitterUserProfile.screen_name;
            $scope.userProfileImage = twitterUserProfile.profile_image_url_https;
        }
        
        $scope.openMenu = function ($event){
             $scope.popover.show($event);
        }

        $scope.logout = function() {
            
            /*** clear Twitter ***/
            window.localStorage.removeItem(globalValues.twitterKey);
            window.localStorage.removeItem(globalValues.twitterUserProfile);
            /*** clear FaceBook ***/
            window.localStorage.removeItem(globalValues.facebookKey);
            window.localStorage.removeItem(globalValues.facebookUserProfile);
            
            /******* CheckBox Setting Removed ************/
            window.localStorage.removeItem(globalValues.facebookCheckBoxSetting);
            window.localStorage.removeItem(globalValues.twitterCheckBoxSetting);
            window.localStorage.clear();
            
            $state.go('login');
           
        }
    })
