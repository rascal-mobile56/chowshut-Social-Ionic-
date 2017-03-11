var services = angular.module('service.facebook', [])
services.factory('FacebookFactory', function($http, $cordovaOauthUtility, $cordovaOauth, $state, $q, $window, globalValues) {
    /*=================================================
         FB Local Storage Functions and Keys
    =================================================*/
    
    /** Store FB User Profile in Local Storage**/
    function storeUserFBProfile(data) {
        window.localStorage.setItem(globalValues.facebookUserProfile, JSON.stringify(data));
    }
    /** Get  FB User Profile in Local Storage**/
    function getStoredFBProfile() {
        return window.localStorage.getItem(globalValues.facebookUserProfile);
    }
   
    /** Store FB access_token in Local Storage**/
    function storeUserFBToken(data) {
        window.localStorage.setItem(globalValues.facebookKey, JSON.stringify(data));
    }
    /** Get FB access_token in Local Storage**/
    function getStoredFBToken() {
        return window.localStorage.getItem(globalValues.facebookKey);
    }
    /*=================================================
         FB Login and Get Profile Section
    =================================================*/
    return {
        login: function($scope) {
            //ssdebugger
            var deferred = $q.defer();

            var token = getStoredFBToken();
            if (token !== null) {
                var profile = getStoredFBProfile();
                if (profile != null) {

                    deferred.resolve('success');
                    // $state.go('tab');
                    return deferred.promise;
                } else {
                    var fb_token = JSON.parse(getStoredFBToken());
                    $http.get("https://graph.facebook.com/v2.5/me", {
                        params: {
                            access_token: fb_token.access_token,
                            fields: "id,name,gender,location,website,picture,albums,relationship_status",
                            format: "json"
                        }
                    }).then(function(response) {
                        console.log(JSON.stringify(response));
                        //Stroe Response or Profile into Local Storage
                        storeUserFBProfile(response.data);
                        deferred.resolve('success');
                        
                    }, function(error) {
                        alert("There was a problem getting your profile.  Check the logs for details.");
                        deferred.reject(error);
                        console.log(error);
                    });

                    return deferred.promise;
                }
            }
            /** facebook client ID ( app id )**/
            console.log("FacebookLogin function got called");
            /** facebook call to login**/
            $cordovaOauth.facebook(globalValues.facebookClientId, ["email", "publish_actions", "user_posts", "user_photos"]).then(function(result) {
                // results
                console.log(JSON.stringify(result));
                //Stroe Response or Token into Local Storage
                storeUserFBToken(result);
                /** facebook call to get UserProfile**/
                $http.get("https://graph.facebook.com/v2.5/me", {
                    params: {
                        access_token: result.access_token,
                        fields: "id,name,gender,location,website,picture,albums,relationship_status",
                        format: "json"
                    }
                }).then(function(response) {
                    console.log(JSON.stringify(response));
                    //Stroe Response or Profile into Local Storage
                    storeUserFBProfile(response.data);
                    var twitterKey = window.localStorage.getItem(globalValues.twitterKey);
                    var instagramKey = window.localStorage.getItem(globalValues.instagramKey);
                    if((twitterKey=='' || twitterKey==null) && (instagramKey=='' || instagramKey==null)){
                        window.localStorage.setItem(globalValues.facebookCheckBoxSetting,'true');
                    }
                    deferred.resolve('success');
                    
                }, function(error) {
                    deferred.reject(error);
                    alert("There was a problem getting your profile.  Check the logs for details.");
                    console.log(error);
                });
            }, function(error) {
                // error
                deferred.reject(error);
                console.log(JSON.stringify(error));
            });

          return deferred.promise;

        },
        
        postPhoto: function(paramObj) {
            var deferred = $q.defer();
            var success = function(result) {
                deferred.resolve(result);
            };
            var error = function(error) {
                deferred.reject(error);
            };
            var options = new FileUploadOptions();
            options.fileKey = "file";
            options.fileName = 'name_of_photo_' + Math.round((+(new Date()) + Math.random()));
            options.mimeType = "image/jpg";
            var params = new Object();
            params.access_token = paramObj.fb_access_token;
            params.caption = paramObj.photo_caption;
            params.no_story = false;
            options.params = params;
            var ft = new FileTransfer();
            ft.upload(paramObj.fb_photo, "https://graph.facebook.com/v2.5/me/photos", success, error, options);
            return deferred.promise;
        },
        getPostById: function($scope) {
            /** facebook call to get UserProfile**/
            var access_token = JSON.parse(getStoredFBToken()).access_token;
            var post_id = window.localStorage.getItem('post_id');
            console.log(access_token);
            $http.get("https://graph.facebook.com/v2.5/" + post_id, {
                params: {
                    access_token: access_token,
                    format: "json"
                }
            }).then(function(response) {
                console.log(JSON.stringify(response));
               
            }, function(error) {
                alert("There was a problem getting your profile.  Check the logs for details.");
                console.log(error);
            });
        },
        storeUserFBProfile: storeUserFBProfile,
        getStoredFBProfile: getStoredFBProfile,
        storeUserFBToken: storeUserFBToken,
        getStoredFBToken: getStoredFBToken
    };
});
