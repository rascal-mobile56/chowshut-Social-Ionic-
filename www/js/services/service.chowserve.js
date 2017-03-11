angular.module('chowserveService', [])

  .config(function ($httpProvider) {
    //Enable cross domain calls
    $httpProvider.defaults.useXDomain = true;

    //Remove the header used to identify ajax call  that would prevent CORS from working
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  .factory('photoUtils', function ($http) {

    return {

      postPhoto: function(photo) {
        // curl -iF "data=@logo.png" "http://localhost:9292/upload?username=gec&twitter_id=t123";echo


        var urlParams = {
          data: {
            username: "gec",
            filename: Math.floor(Date.now() / 1000),
            //filedata: "R0lGODlhDAAMAMQWAAAAAGtra2tzc3NzWnNzc3t7Y3uEhIyMjJycnKV7KaWlraWtra2MSrWcWsacCMbGxtalCOe9GO/OIffeKf/3Kf///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh+QQJtAAWACwAAAAADAAMAAAFU6BlKYGgkIEijkZVna6hWoJr24HVBPcdNIlaBeAiVgKJBK/nQiYUrQpCEVMkKYHBIBLRBiiJBoQCTibIkIaFEZlQ3O8IY8VwSO4Sx3y1Nif2FiEAACH5BAUoABYALAAAAAAMAAwAAAVIoIUQQaAoJYFYylG9yvJWh0LM+EzmeXDzusDrAXgBHi/fDFlhVgit2WlWEwkGhUikMBCsLIzIJEFOTCIMizqsbafV63LibQkBADs=",
            filedata: photo,
            twitter_id: "tid",
            facebook_id: "fbid"
          }
        };

        var chowserve_host = "192.168.11.21"
        var url = "http://" + chowserve_host + ":9292/upload";

        return $http({
          method: 'POST',
          url: url,
          data: urlParams,
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            console.log("Photo Post Success!");

          }, function errorCallback(response) {
            console.log("Photo Post Error!");

          }
        );

      }
    };

  });
