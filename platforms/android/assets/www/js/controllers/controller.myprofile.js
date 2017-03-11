angular.module('controller.myprofile', [])
     .controller('profileCtrl', function($scope,$state,$ionicPopup,$ionicHistory,$twitterApi,$cordovaOauth, $ionicHistory,FacebookFactory, TwitterFactory,toastr,globalValues, Scopes) {
        $scope.checkboxModelForProfile = {
                       Facebook : false,
                       Twitter : false,
                     };
        
        var token = JSON.parse(localStorage.getItem(globalValues.facebookKey));
        var token_2 = JSON.parse(localStorage.getItem(globalValues.twitterKey));
        var facebookUserProfile = JSON.parse(localStorage.getItem(globalValues.facebookUserProfile));
        var twitterUserProfile = JSON.parse(localStorage.getItem(globalValues.twitterUserProfile));
        var token_2 = JSON.parse(localStorage.getItem(globalValues.twitterKey));
        
       
        
        // $scope.profileImage = "img/default.png";
        if(token!=null && token!=''){
           $scope.checkboxModelForProfile.Facebook = true;  
        }
        if(token_2!=null && token_2!=''){
             $scope.checkboxModelForProfile.Twitter = true;
        }
        
        if(facebookUserProfile){
                console.log('Facebook Profile');
                $scope.username = facebookUserProfile.name;
                 $scope.profileImage = "https://graph.facebook.com/v2.5/"+facebookUserProfile.id+"/picture?type=large";
        }else if(twitterUserProfile){
                console.log('Twitter Profile');
                $scope.username = twitterUserProfile.screen_name;
                $scope.profileImage = twitterUserProfile.profile_image_url_https;
        
        }else{
            console.log('defaults');
            $scope.username = 'User Name';
            $scope.profileImage = "img/default.png";
        }
        
        $scope.back = function(){
            console.log('GoBack');

            $ionicHistory.goBack();
            Scopes.get('tabCtrl').rememberCheckBoxSetting();
        }
        $scope.optionChange = function(provider){
            var token = JSON.parse(window.localStorage.getItem(globalValues.facebookKey));
            var token_2 = JSON.parse(window.localStorage.getItem(globalValues.twitterKey));

            if(provider=='twitter'){
                if(!$scope.checkboxModelForProfile.Twitter){
                    console.log('twitterfalse');
                    $scope.showConfirm('Twitter');
                }else{
                    if(token_2==null || token_2 == ''){
                    $scope.checkboxModelForProfile.Twitter = false;
                     /** Twitter Api Keys **/
                     TwitterFactory.login($scope).then(function(response){
                       toastr.success('Login with Twitter successfuly');
                       $scope.checkboxModelForProfile.Twitter = true;
                        window.localStorage.setItem(globalValues.twitterCheckBoxSetting,true); 
                     },function(error){
                        console.log(error);
                        toastr.error('Problem on Login Twitter', 'Error');
                        $scope.checkboxModelForProfile.Twitter = false;
                     });
                }


                }
            }else if(provider=='facebook'){
                if(!$scope.checkboxModelForProfile.Facebook){
                    console.log('facebookfalse');
                    $scope.showConfirm('Facebook');
                }else{

                    if(token==null || token == ''){

                        $scope.checkboxModelForProfile.Facebook = false; 
                        /** facebook client ID ( app id )**/
                        /** facebook call to login**/
                    FacebookFactory.login($scope).then(function(response){
                        $scope.checkboxModelForProfile.Facebook = true;
                        toastr.success('Login with Facebook successfuly');
                        window.localStorage.setItem(globalValues.facebookCheckBoxSetting,true);

                    },function(error){
                        console.log(error);
                        toastr.error('Problem on Login Facebook', 'Error');
                        $scope.checkboxModelForProfile.Facebook = false; 
                    });                   
                }
                }
            }

        }
         // A confirm dialog
         $scope.showConfirm = function(provider) {

           var confirmPopup = $ionicPopup.confirm({
             title: provider+' Logout!',
             template: 'Are you sure you want to Logout from '+provider+'?'
           });
           confirmPopup.then(function(res) {
             if(res) {
               console.log('You are sure '+provider);
               $scope.singleLogout(provider);
             } else {
               console.log('You are not sure'+provider);
               if(provider=='Facebook'){
                $scope.checkboxModelForProfile.Facebook= true;
               }else{
                $scope.checkboxModelForProfile.Twitter= true;
               }
             }
           });
         }


          $scope.logoutAll = function() {
            
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
         $scope.singleLogout = function(socialType) {
            
            console.log('Single Log Out called');
            console.log('socialType: '+ socialType);
            if(socialType == 'Facebook'){
                 console.log('Single Log Out called for Facebook');
                /*** clear FaceBook ***/
                window.localStorage.removeItem(globalValues.facebookKey);
                window.localStorage.removeItem(globalValues.facebookUserProfile);
                /******* CheckBox Setting Removed ************/
                window.localStorage.removeItem(globalValues.facebookCheckBoxSetting);
                window.localStorage.setItem(globalValues.loginType, 'twitter');
                window.localStorage.setItem(globalValues.twitterCheckBoxSetting,'true');
            }else if(socialType =='Twitter'){
                 console.log('Single Log Out called for Twitter');
                /*** clear Twitter ***/
                window.localStorage.removeItem(globalValues.twitterKey);
                window.localStorage.removeItem(globalValues.twitterUserProfile);
                /******* CheckBox Setting Removed ************/
                window.localStorage.removeItem(globalValues.twitterCheckBoxSetting);
                window.localStorage.setItem(globalValues.loginType, 'facebook');
                window.localStorage.setItem(globalValues.facebookCheckBoxSetting,'true');
            }
            var twitterCheckBoxSetting = window.localStorage.getItem(globalValues.twitterCheckBoxSetting);
            var facebookCheckBoxSetting = window.localStorage.getItem(globalValues.facebookCheckBoxSetting);


            if((twitterCheckBoxSetting==null || twitterCheckBoxSetting=='') && (facebookCheckBoxSetting==null || facebookCheckBoxSetting=='')){
                /******* CheckBox Setting Removed ************/
                window.localStorage.removeItem(globalValues.twitterCheckBoxSetting);
                
                window.localStorage.clear();
                $state.go('login');
            }
           
            
           
        }

    })
