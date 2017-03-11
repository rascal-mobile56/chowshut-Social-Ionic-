var services = angular.module('service.twitter', [])
services.factory('TwitterFactory', function($http, $twitterApi, $cordovaOauthUtility, $cordovaOauth, $state, $q,globalValues) {
    /*=================================================
     Twitter Local Storage Functions and Keys
    =================================================*/

    /** Store Twitter User Profile in Local Storage**/
    function storeTwitterProfile(data) {
        window.localStorage.setItem(globalValues.twitterUserProfile, JSON.stringify(data));
    }
    /** Get  Twitter User Profile in Local Storage**/
    function getStoredTwitterProfile() {
        return window.localStorage.getItem(globalValues.twitterUserProfile);
    }
    /** Store Twitter access_token in Local Storage**/
    function storeTwitterToken(data) {
        window.localStorage.setItem(globalValues.twitterKey, JSON.stringify(data));
    }
    /** Get Twitter access_token in Local Storage**/
    function getStoredTwitterToken() {
        return window.localStorage.getItem(globalValues.twitterKey);
    }

    return {
        login: function($scope) {

            /** Twitter Api Keys **/
            var deferred = $q.defer();

            var token = getStoredTwitterToken();
            if (token != null) {
                var profile = getStoredTwitterProfile();
                if (profile != null) {

                    deferred.resolve('success');
                    // $state.go('tab');
                    return deferred.promise;
                } else {

                    var twitter_token = JSON.parse(getStoredTwitterToken());
                    var oauth_token = twitter_token.oauth_token;
                    var oauth_token_secret = twitter_token.oauth_token_secret;
                    var user_id = twitter_token.user_id;
                    var screen_name = twitter_token.screen_name;

                    //Accessing profile info from twitter
                    var oauthObject = {
                        oauth_consumer_key: globalValues.twitterClientId,
                        oauth_nonce: $cordovaOauthUtility.createNonce(10),
                        oauth_signature_method: "HMAC-SHA1",
                        oauth_token: twitter_token.oauth_token,
                        oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                        oauth_version: "1.0"
                    };

                    var signatureObj = $cordovaOauthUtility.createSignature("GET", "https://api.twitter.com/1.1/users/show.json", oauthObject, {
                        screen_name: twitter_token.screen_name
                    }, globalValues.twitterClientSecret, twitter_token.oauth_token_secret);
                    console.log("Generating signature");

                    localStorage.setItem('sig', JSON.stringify(signatureObj));
                    $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
                    $http.get('https://api.twitter.com/1.1/users/show.json', {
                        params: {
                            screen_name: screen_name
                        }
                    }).success(function(data) {
                        console.log('Twitter UserProfile: ' + JSON.stringify(data));
                        //Stroe Response or Profile into Local Storage
                        storeTwitterProfile(data);
                        // $state.go('tab');
                        deferred.resolve('success');
                    })

                    return deferred.promise;
                }

            }

            console.log("twitterLogin function got called");
            /** Twitter Login Call **/
            $cordovaOauth.twitter(globalValues.twitterClientId, globalValues.twitterClientSecret).then(function(result) {
                //Stroe Response or Token into Local Storage
                storeTwitterToken(result);
                $twitterApi.configure(globalValues.twitterClientId, globalValues.twitterClientSecret, result);
                /** Twitter call Response in varibales **/
                var oauth_token = result.oauth_token;
                var oauth_token_secret = result.oauth_token_secret;
                var user_id = result.user_id;
                var screen_name = result.screen_name;
                /** Twitter oauth for User Details **/
                //Accessing profile info from twitter
                var oauthObject = {
                    oauth_consumer_key: globalValues.twitterClientId,
                    oauth_nonce: $cordovaOauthUtility.createNonce(10),
                    oauth_signature_method: "HMAC-SHA1",
                    oauth_token: result.oauth_token,
                    oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
                    oauth_version: "1.0"
                };
                //var signatureObj = $cordovaOauthUtility.createSignature(method, url, oauthObject, {}, clientSecret, token.oauth_token_secret);
                var signatureObj = $cordovaOauthUtility.createSignature("GET", "https://api.twitter.com/1.1/users/show.json", oauthObject, {
                    screen_name: result.screen_name
                }, globalValues.twitterClientSecret, result.oauth_token_secret);
                console.log("Generating signature");

                localStorage.setItem('sig', JSON.stringify(signatureObj));
                $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
                $http.get('https://api.twitter.com/1.1/users/show.json', {
                    params: {
                        screen_name: screen_name
                    }
                }).success(function(data) {
                    console.log('Twitter UserProfile: ' + JSON.stringify(data));
                    //Stroe Response or Profile into Local Storage
                    storeTwitterProfile(data);
                    var facebookKey = window.localStorage.getItem(globalValues.facebookKey);
                    var instagramKey = window.localStorage.getItem(globalValues.instagramKey);
                    if((facebookKey=='' || facebookKey==null) && (instagramKey=='' || instagramKey==null)){
                        window.localStorage.setItem(globalValues.twitterCheckBoxSetting,'true');
                    }
                    deferred.resolve('success');
                    // $state.go('tab');
                })
            }, function(error) {
                deferred.reject(error);
                console.log(JSON.stringify(error));
            });
            return deferred.promise;
        },
        postPhoto: function(paramObj) {
            var deferred = $q.defer();
            /** Twitter Api Keys **/

            var token_2 = JSON.parse(getStoredTwitterToken());
            $twitterApi.configure(globalValues.twitterClientId, globalValues.twitterClientSecret, token_2);
            $twitterApi.postMediaNew(paramObj.twitter_photo).then(function(result) {
                console.log(result);
                // TODO: dynamically base64 the image of the photo taken, call postMedia with it,
                // take the media_id_string value returned from the postMedia response, and call postStatusUpdate
                // with the media_ids attribute returned from the postMedia call.
                $twitterApi.postStatusUpdate(paramObj.photo_caption, {
                    "media_ids": result.media_id_string
                }).then(function(result) {
                    deferred.resolve(result);
                });
            });
            return deferred.promise;
        },
        getStoredTwitterToken: getStoredTwitterToken,
        getStoredTwitterProfile: getStoredTwitterProfile,
        storeTwitterProfile: storeTwitterProfile,
        storeTwitterToken: storeTwitterToken 
    };
});
