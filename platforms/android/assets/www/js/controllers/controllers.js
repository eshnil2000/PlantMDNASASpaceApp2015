angular.module('starter.controllers', [])
    //Make sure the ORDER of dependencies injected and the parameters passed to function are the same order.
    //Ex. ['$scope','FIREBASE_REF',...], function($scope,FIREBASE_REF,..)
 /*       .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

        // Called to navigate to the main app
        $scope.startApp = function() {
            $state.go('main');
        };
        $scope.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        $scope.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
    })

*/
    .controller('AppCtrl', ['loginCtrl','$q','$localstorage','SharedData','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state','$ionicModal',function(loginCtrl,$q,$localstorage,SharedData,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state,$ionicModal){

        loginCtrl.doLogin();

        $scope.showMap2= function(form) {
            $state.go('app.showMap2');

        };

        $scope.showIntro= function(form) {
            $state.go('app.intro');

        };

        $scope.showMap= function(form) {
            $state.go('app.showMap');

        };

        $scope.showUsers= function(form) {
            $state.go('app.showUsers');

        };

        $scope.showProfile = function(form) {
            $state.go('app.profile');

        };
        $scope.showChores = function(form) {
            $state.go('app.chores');


        };

        $scope.shareImg = function(form) {
            $state.go('app.share');


        };

        $scope.showWater = function(form) {
            $state.go('app.water');


        };

        $scope.showDiseases = function(form) {
            $state.go('app.disease');


        };


        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $rootScope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.loginShow = function() {
            $scope.modal.show();
        };


    }])




        ;



