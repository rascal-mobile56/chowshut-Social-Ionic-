angular.module('controller.cameratab', [])
    /**** tab  Camera Controller ***/
    .controller('tabCameraCtrl', function($scope, $state,$ionicTabsDelegate, $cordovaCamera,$ionicLoading,$twitterApi,$cordovaOauth, $ionicHistory,
                                          FacebookFactory,TwitterFactory,toastr,globalValues, photoUtils) {

        $scope.formData = {};
        // var access_token = null;
        var access_token = null;
        var token = JSON.parse(window.localStorage.getItem(globalValues.facebookKey));
        if(token){
            access_token = token.access_token;
        }
        /**********function to Open Camera *********/
         $scope.reOpenCamera = function() {
            $scope.openCamera();
        }
        $scope.openMenu = function ($event){
             $scope.popover.show($event);
        }
        $scope.OptionChange = function(provider){
            console.log($scope.checkboxModel.Facebook);
            var token = JSON.parse(window.localStorage.getItem(globalValues.facebookKey));
            var token_2 = JSON.parse(window.localStorage.getItem(globalValues.twitterKey));

            console.log(provider);

            if(provider=='twitter'){
                if(token_2==null || token_2 == ''){
                    $scope.checkboxModel.Twitter = false;
                     /** Twitter Api Keys **/

                     TwitterFactory.login($scope).then(function(response){
                        $scope.checkboxModel.Twitter = true;
                        window.localStorage.setItem(globalValues.twitterCheckBoxSetting,true);
                        toastr.success('Login with Twitter successfuly');
                     },function(error){
                        console.log(JSON.stringify(error));
                        toastr.error('Problem on Login Twitter', 'Error');
                        $scope.checkboxModel.Twitter = false;
                     });
                }else {
                    if($scope.checkboxModel.Twitter){
                        window.localStorage.setItem(globalValues.twitterCheckBoxSetting,'true');
                        // document.getElementById('postButton').disabled = false;
                        // console.log("if for true");
                    }else{
                        if($scope.checkboxModel.Twitter==false && $scope.checkboxModel.Facebook==false && $scope.checkboxModel.Instagram==false){
                            $scope.checkboxModel.Twitter = true;
                            toastr.warning('At least one endpoint must be selected.', 'Alert');
                            return;
                        }
                        window.localStorage.setItem(globalValues.twitterCheckBoxSetting,'false');
                        //console.log("else for false");
                    }
                }
            } else if(provider=='facebook'){
                if(token==null || token == ''){
                        $scope.checkboxModel.Facebook = false;
                        /** facebook client ID ( app id )**/
                        /** facebook call to login**/
                        FacebookFactory.login($scope).then(function(response){
                             $scope.checkboxModel.Facebook = true;
                            toastr.success('Login with Facebook successfuly');
                            window.localStorage.setItem(globalValues.facebookCheckBoxSetting,true);
                            var token = JSON.parse(window.localStorage.getItem(globalValues.facebookKey));
                            if(token){
                                access_token = token.access_token;
                            }

                            },function(error){
                                 console.log(JSON.stringify(error));
                                toastr.error('Problem on Login Facebook', 'Error');
                                $scope.checkboxModel.Facebook = false;
                            });
                }else{
                    if($scope.checkboxModel.Facebook){
                        window.localStorage.setItem(globalValues.facebookCheckBoxSetting,true);
                        // document.getElementById('postButton').disabled = false;
                        console.log("if for true");
                    }else{
                        if($scope.checkboxModel.Twitter==false && $scope.checkboxModel.Facebook==false && $scope.checkboxModel.Instagram==false){
                            $scope.checkboxModel.Facebook = true;
                             toastr.warning('At least one endpoint must be selected.', 'Alert');
                             return;

                        }
                         window.localStorage.setItem(globalValues.facebookCheckBoxSetting,false);
                         console.log("else for false");
                    }
                }
            }
        }
        $scope.postAll = function(){
            var twitterCheckBoxSetting = window.localStorage.getItem(globalValues.twitterCheckBoxSetting);
            var facebookCheckBoxSetting = window.localStorage.getItem(globalValues.facebookCheckBoxSetting);
            var instagramCheckBoxSetting = window.localStorage.getItem(globalValues.instagramCheckBoxSetting);

            if(twitterCheckBoxSetting=='true' || facebookCheckBoxSetting=='true'){
            console.log('Post All');
            console.log($scope.checkboxModel.Twitter);
            if($scope.formData.caption==null){
                $scope.formData.caption='';
            }

               var paramsObj = {
                fb_access_token:access_token,
                fb_photo:$scope.lastPhoto,
                twitter_photo:$scope.lastPhoto,
                photo_caption:$scope.formData.caption
               };
               photoUtils.postPhoto(paramsObj.twitter_photo);

               if($scope.checkboxModel.Facebook){
                console.log('facebook');
                FacebookFactory.postPhoto(paramsObj).then(
                    function(response) {
                        console.log(response);
                         toastr.success('the item was posted on Facebook');
                         $scope.checkboxModel.Facebook=false;

                    },
                    function(error) {
                       console.log(error);
                       toastr.error('Problem on Posting Facebook', 'Error');
                    });
            }
            if($scope.checkboxModel.Twitter){
                console.log('twitter');
                TwitterFactory.postPhoto(paramsObj)
                .then(
                    function(response) {
                        // debugger
                        console.log("Called Function");
                        console.log(response);
                        toastr.success('the item was posted on Twitter');
                        $scope.checkboxModel.Twitter = false;
                        //$scope.formData.caption = '';
                    },
                    function(error) {
                       console.log(error);
                       toastr.error('Problem on Posting Twitter', 'Error');
                    });
            }
            $ionicTabsDelegate.select(0);

        }else{
            // toastr.error('Select Social Connection to Share', 'Alert');
        }
    }



    })
