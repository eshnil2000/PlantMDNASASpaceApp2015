// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ngMap','angularGeoFire','ngAutocomplete','ionic', 'firebase','starter.controllers', 'starter.services','starter.directives'])

.run(function($ionicPlatform, $rootScope,$localstorage) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();


    }
    $localstorage.setObject('chores',[]);
    $localstorage.set('loggedIn',0);
    /*$rootScope.$storage = $localStorage.$default({
      chores: '',
      loggedIn: 0
    }); */

  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

      .state('app.intro', {
        url: "/intro",
        views: {
          'menuContent' :{
            templateUrl: "templates/intro.html",
            controller: 'IntroCtrl'
          }
        }
      })
      .state('app.chores', {
        url: "/chores",
        views: {
          'menuContent' :{
            templateUrl: "templates/Chore.html",
            controller: 'choreCtrl'
          }
        }
      })

      .state('app.profile', {
        url: "/profile",
        views: {
          'menuContent' :{
            templateUrl: "templates/profile.html",
            controller: 'profileCtrl'
          }
        }
      })

      .state('app.showUsers', {
        url: "/showUsers",
        views: {
          'menuContent' :{
            templateUrl: "templates/showUsers.html",
            controller: 'usersCtrl'
          }
        }
      })

      .state('app.showMap', {
        url: "/showMap",
        views: {
          'menuContent' :{
            templateUrl: "templates/showMap.html",
            controller: 'mapCtrl'
          }
        }
      })
;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/chores');

});

