angular.module('twitter.functions', [])

  .factory('$twitterApi', ['$q', '$twitterHelpers', '$http', function ($q, $twitterHelpers, $http) {
    var token;
    var clientId = 'ipicWjIpqlpGZig7qurgNGpmk';
    var clientSecret = '6IjG4NuokS9dI3ct3Ccq473fEeI0DjM12M32vy7NgUn8cce3BC';

    var HOME_TIMELINE_URL = 'https://api.twitter.com/1.1/statuses/home_timeline.json';
    var SEARCH_TWEETS_URL = 'https://api.twitter.com/1.1/search/tweets.json';
    var STATUS_UPDATE_URL = 'https://api.twitter.com/1.1/statuses/update.json';

    var IMAGE_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json';


    var STATUS_MENTIONS_URL = 'https://api.twitter.com/1.1/statuses/mentions_timeline.json';
    var USER_TIMELINE_URL = 'https://api.twitter.com/1.1/statuses/user_timeline.json';
    var USER_DETAILS_URL = 'https://api.twitter.com/1.1/users/show.json';
    var MEDIA_UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json';


    function getRequest(url, neededParams, optionalParams) {
      var deferred = $q.defer();
      if (typeof(optionalParams) === 'undefined') optionalParams = {};
      if (typeof(neededParams) === 'undefined') neededParams = {};
      var parameters = angular.extend(optionalParams, neededParams);
      $twitterHelpers.createTwitterSignature('GET', url, parameters, clientId, clientSecret, token);

      $http({
        method: 'GET',
        url: url,
        params: parameters
      })
        .success(function (data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          if (status === 401) {
            token = null;
          }
          deferred.reject(status);
        });
      return deferred.promise;
    }

    function postRequest(url, neededParams, optionalParams) {
      var deferred = $q.defer();
      if (typeof(optionalParams) === 'undefined') optionalParams = {};
      var parameters = angular.extend(optionalParams, neededParams);

      // // Append the bodyparams to the URL
      var t = $twitterHelpers.createTwitterSignature('POST', url, parameters, clientId, clientSecret, token);
      if (parameters !== {}) url = url + '?' + $twitterHelpers.transformRequest(parameters);
      console.log(t);

      $http.post(url, parameters)
        .success(function (data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          if (status === 401) {
            token = null;
          }
          deferred.reject(status);
        });
      return deferred.promise;
    }

    function postRequestNew(url, data) {
      var deferred = $q.defer();

      var twitterSignature = $twitterHelpers.createTwitterSignature('POST', url, {}, clientId, clientSecret, token);

      var fd = new FormData("myfile.jpg");

      fd.append('media', dataURItoBlob(data));

      var req = {
        method: 'POST',
        url: url,
        headers: {
          'Content-Type': undefined,
          'Authorization': twitterSignature.authorization_header,
        },
        transformRequest: angular.identity,
        data: fd
      };


      $http(req)
        .success(function (data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          if (status === 401) {
            token = null;
          }
          deferred.reject(status);
        });
      return deferred.promise;
    }

    function dataURItoBlob(dataURI) {
      // convert base64/URLEncoded data component to raw binary data held in a string
      var byteString;
      if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
      else
        byteString = unescape(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to a typed array
      var ia = new Uint8Array(byteString.length);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }

      return new Blob([ia], {type:mimeString});
    }

    function postImageRequest(url, neededParams, optionalParams) {
      var deferred = $q.defer();
      if (typeof(optionalParams) === 'undefined') optionalParams = {};
      // var parameters = angular.extend(optionalParams, neededParams);
      var parameters = null;

      // // Append the bodyparams to the URL
      var t = $twitterHelpers.createTwitterSignature('POST', url, parameters, clientId, clientSecret, token);
      // if (parameters !== {}) url = url + '?' + $twitterHelpers.transformRequest(parameters);

      // var req = {
      //          method: 'POST',
      //          url: 'http://example.com',
      //          headers: {
      //            'Content-Type': undefined
      //          },
      //          data: { test: 'test' }
      //         }

      $http.post(url, neededParams, {headers: {'Content-Type': 'multipart/form-data'}})
        // $http.post(url, neededParams)
        .success(function (data, status, headers, config) {
          deferred.resolve(data);
        })
        .error(function (data, status, headers, config) {
          if (status === 401) {
            token = null;
          }
          deferred.reject(status);
        });
      return deferred.promise;
    }

    return {
      configure: function (cId, cSecret, authToken) {
        clientId = cId;
        clientSecret = cSecret;
        token = authToken;
      },
      getHomeTimeline: function (parameters) {
        return getRequest(HOME_TIMELINE_URL, parameters);
      },
      getMentionsTimeline: function (parameters) {
        return getRequest(STATUS_MENTIONS_URL, parameters);
      },
      getUserTimeline: function (parameters) {
        return getRequest(USER_TIMELINE_URL, parameters);
      },
      searchTweets: function (keyword, parameters) {
        return getRequest(SEARCH_TWEETS_URL, {q: keyword}, parameters);
      },
      postStatusUpdate: function (statusText, parameters) {
        return postRequest(STATUS_UPDATE_URL, {status: statusText}, parameters);
      },
      postImage: function (img, parameters) {
        // return postImageRequest(IMAGE_UPLOAD_URL, {media: imgUrl}, parameters);
        return postImageRequest(IMAGE_UPLOAD_URL, {media_data: img}, parameters);
      },
      getUserDetails: function (user_id, parameters) {
        return getRequest(USER_DETAILS_URL, {user_id: user_id}, parameters);
      },
      postMedia: function (base64Media, parameters) {
        return postRequest(MEDIA_UPLOAD_URL, {media: base64Media}, parameters);
      },
      postMediaNew: function (data, parameters) {
        return postRequestNew(MEDIA_UPLOAD_URL, data);
      },
      getRequest: getRequest,
      postRequest: postRequest,
      postRequestNew: postRequestNew,

      postImageRequest: postImageRequest
    };
  }]);

/*
 * AngularJS Twitter REST Api wrapper
 *
 * Created by Simon Reimler
 * http://www.devdactic.com
 *
 *
 *
 * DESCRIPTION:
 *
 * Configure the library with:
 *    - Consumer Key (API Key)
 *    - Consumer Secret (API Secret)
 *    - Valid OAuth Token
 *
 *
 *
 * Wrapped Endpoints:
 *
 *    statuses/home_timeline
 *    statuses/update
 *    search/tweets
 *
 */

angular.module('ngTwitter', [
  'twitter.functions',
  'twitter.utils'
]);

angular.module('twitter.utils', [])

  .factory('$twitterHelpers', ['$q', '$http', function ($q, $http) {

    /* This snippet is copied from Nic Raboy's ngCordovaOauth
     * For more information see: https://github.com/nraboy/ng-cordova-oauth
     * Sign an Oauth 1.0 request
     *
     * Addition From Simon Reimler:
     * Encode Bodyparams with escapeSpecialCharacters(), because Twitter is very strict with OAuth.
     * See: http://stackoverflow.com/questions/14672502/bug-or-spec-change-of-twitter-api-1-1
     *
     * @param    string method
     * @param    string endPoint
     * @param    object headerParameters
     * @param    object bodyParameters
     * @param    string secretKey
     * @param    string tokenSecret (optional)
     * @return   object
     */
    function createSignature(method, endPoint, headerParameters, bodyParameters, secretKey, tokenSecret) {
      if (typeof jsSHA !== "undefined") {
        var headerAndBodyParameters = angular.copy(headerParameters);
        var bodyParameterKeys = Object.keys(bodyParameters);
        for (var i = 0; i < bodyParameterKeys.length; i++) {
          headerAndBodyParameters[bodyParameterKeys[i]] = escapeSpecialCharacters(bodyParameters[bodyParameterKeys[i]]);
        }
        var signatureBaseString = method + "&" + encodeURIComponent(endPoint) + "&";
        var headerAndBodyParameterKeys = (Object.keys(headerAndBodyParameters)).sort();
        for (i = 0; i < headerAndBodyParameterKeys.length; i++) {
          if (i == headerAndBodyParameterKeys.length - 1) {
            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]]);
          } else {
            signatureBaseString += encodeURIComponent(headerAndBodyParameterKeys[i] + "=" + headerAndBodyParameters[headerAndBodyParameterKeys[i]] + "&");
          }
        }
        var oauthSignatureObject = new jsSHA(signatureBaseString, "TEXT");

        var encodedTokenSecret = '';
        if (tokenSecret) {
          encodedTokenSecret = encodeURIComponent(tokenSecret);
        }

        headerParameters.oauth_signature = encodeURIComponent(oauthSignatureObject.getHMAC(encodeURIComponent(secretKey) + "&" + encodedTokenSecret, "TEXT", "SHA-1", "B64"));
        var headerParameterKeys = Object.keys(headerParameters);
        var authorizationHeader = 'OAuth ';
        for (i = 0; i < headerParameterKeys.length; i++) {
          if (i == headerParameterKeys.length - 1) {
            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '"';
          } else {
            authorizationHeader += headerParameterKeys[i] + '="' + headerParameters[headerParameterKeys[i]] + '",';
          }
        }
        return {
          signature_base_string: signatureBaseString,
          authorization_header: authorizationHeader,
          signature: headerParameters.oauth_signature
        };
      } else {
        return "Missing jsSHA JavaScript library";
      }
    }

    /* This snippet is copied from Nic Raboy's ngCordovaOauth
     * For more information see: https://github.com/nraboy/ng-cordova-oauth
     *
     * Create Random String Nonce
     *
     * @param    integer length
     * @return   string
     */
    function createNonce(length) {
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }

    function escapeSpecialCharacters(string) {
      var tmp = encodeURIComponent(string);
      tmp = tmp.replace(/\!/g, "%21");
      tmp = tmp.replace(/\'/g, "%27");
      tmp = tmp.replace(/\(/g, "%28");
      tmp = tmp.replace(/\)/g, "%29");
      tmp = tmp.replace(/\*/g, "%2A");
      return tmp;
    }

    function transformRequest(obj) {
      var str = [];
      for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + escapeSpecialCharacters(obj[p]));
      console.log(str.join('&'));
      return str.join('&');
    }

    return {
      createTwitterSignature: function (method, url, bodyParameters, clientId, clientSecret, token) {
        var oauthObject = {
          oauth_consumer_key: clientId,
          oauth_nonce: createNonce(10),
          oauth_signature_method: "HMAC-SHA1",
          oauth_token: token.oauth_token,
          oauth_timestamp: Math.round((new Date()).getTime() / 1000.0),
          oauth_version: "1.0"
        };
        var signatureObj = createSignature(method, url, oauthObject, bodyParameters, clientSecret, token.oauth_token_secret);
        $http.defaults.headers.common.Authorization = signatureObj.authorization_header;
        return signatureObj;
      },
      transformRequest: transformRequest
    };
  }]);
