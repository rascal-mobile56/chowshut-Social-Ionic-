angular.module('controller.tab', [])
    /*=================================================
         ngCrodva login Section
    =================================================*/
    //**** Login Controller ***/
    .controller('tabCtrl', function($scope, $ionicPopover,$state, $cordovaCamera, $ionicTabsDelegate,globalValues,Scopes) {

        Scopes.store('tabCtrl', $scope);
         $scope.checkboxModel = {
                       Facebook : false,
                       Twitter : false,
                       Instagram : false
                     };
         $ionicPopover.fromTemplateUrl('template/setting.html', {
                scope: $scope,
              }).then(function(popover) {
                $scope.popover = popover;
              });


         
        /**********function to Open Camera *********/
        $scope.openCamera = function() {
            $scope.lastPhoto = null;
            document.addEventListener("deviceready", function() {
                var options = {
                    quality: 50,
                    destinationType: Camera.DestinationType.DATA_URL,
                    // destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    // allowEdit: true,
                    // encodingType: Camera.EncodingType.JPEG,
                    // targetWidth: 1024,
                    // targetHeight: 780,
                    //popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                   // correctOrientation: true
                };
                $cordovaCamera.getPicture(options).then(function(imageURI) {
                    $scope.lastPhoto = "data:image/jpeg;base64," + imageURI;
                    $scope.base64 = imageURI;
                    $state.go($state.current, {}, {reload: true});
                    console.log('success');
                    $scope.rememberCheckBoxSetting();
                }, function(err) {
                    // error
                    console.log(err)
                });
            }, false);
        }

        $scope.rememberCheckBoxSetting = function(){
            var twitterCheckBoxSetting = window.localStorage.getItem(globalValues.twitterCheckBoxSetting);
            var facebookCheckBoxSetting = window.localStorage.getItem(globalValues.facebookCheckBoxSetting);
            if(twitterCheckBoxSetting=='true'){
                $scope.checkboxModel.Twitter = true;
            }

            if(facebookCheckBoxSetting=='true'){
                $scope.checkboxModel.Facebook = true;
            }          
         }

    })
