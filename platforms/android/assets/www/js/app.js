// Ionic ChowShout App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('chowShout', [
  'ionic',
  'ngCordova',
  'ngCordovaOauth',
  'ngTwitter',
  'toastr',
  'controller.login',
  'controller.cameratab',
  'controller.hometab',
  'controller.myprofile',
  'controller.tab',
  'service.twitter',
  'service.facebook',
  'chowserveService',
  'constant.values',
  'global.functions',
  'factory.global'
  ])


.run(function($ionicPlatform,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    $state.go('login');
    
  });


})
.factory('Scopes', function ($rootScope) {
    var mem = {};

    return {
        store: function (key, value) {
            mem[key] = value;
        },
        get: function (key) {
            return mem[key];
        }
    };
})

.config(function($stateProvider,$ionicConfigProvider, $urlRouterProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.backButton.icon('ion-android-arrow-back').text('');
  // $ionicConfigProvider.views.maxCache(0);


  $stateProvider
.state('login', {
    cache: false,
    url: "/login",
    templateUrl: "template/login.html",
    controller: 'loginCtrl',

  })
.state('register', {
    url: "/register",
    templateUrl: "template/register.html",
    controller: 'registerCtrl',

  })

.state('profile', {
    cache: false,
    url: "/myprofile",
    templateUrl: "template/myprofile.html",
    controller: 'profileCtrl',

  })

.state('tab', {
    url: "/tab",
    templateUrl: "template/tab.html",
    controller: 'tabCtrl',

  })

.state('tab.home', {
    url: "/home",
    views: {
      'tab-home': {
        templateUrl: "template/tab-home.html",
        controller: 'tabHomeCtrl',
      }
    }

  })
.state('tab.camera', {
    url: "/camera",
    views: {
      'tab-camera': {
        templateUrl: "template/tab-camera.html",
        controller: 'tabCameraCtrl',
      }
    }

  })

;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');


})
