/**
 * Created by nik on 2/28/15.
 */

angular.module('starter.controllers')
.controller('smsCtrl', ['$http','$localstorage','$q','SharedData','$ionicModal','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state',function($http,$localstorage,$q,SharedData,$ionicModal,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state){


    // Load the add / change dialog from the given template URL
    $ionicModal.fromTemplateUrl('templates/addChore.html', function(modal) {
        $scope.addDialog = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });


    $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        $scope.addDialog.show();
    };

    $scope.leaveAddChangeDialog = function() {
        // Remove dialog
        $scope.addDialog.remove();
        // Reload modal template to have cleared form
        $ionicModal.fromTemplateUrl('templates/addChore.html', function(modal) {
            $scope.addDialog = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });
    };



    // Used to cache the empty form for Edit Dialog
    $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
    }

    $scope.addItem = function(form) {
        $http.jsonp({
            url: 'http://textbelt.com/text?callback=JSON_CALLBACK',
            method: 'POST',
            data:  {'number' : form.telNo.$modelValue, 'message':form.description.$modelValue},
            headers: {'Accept':'*/*','Content-Type': 'application/x-www-form-urlencoded'}

        }).success(function (data, status, headers, config) {
            console.log(data);
        }).error(function (data, status, headers, config) {
           console.log(data);
        });
    }

    var CALLBACK=function(data){
        console.log('callback');
    };

    $scope.removeItem = function(item) {

        var deferred=$q.defer();
        var promise=deferred.promise;

        promise.then(function(result) {
            //console.log($scope.chores[item.choreID]);
            //$scope.choreList.splice($scope.choreList.indexOf(item), 1);
            $scope.chores.splice($scope.chores.indexOf(item), 1);
        }, function(reason){
            alert('Error'+reason);

        });
        deferred.resolve(SharedData.get().child("chores").child(userSession.user.uid).child("chore").child(item.choreID).remove());

    }



    $scope.showEditItem = function(item) {
        //console.log("showEditItem "+ item.newItemLink);
        // Remember edit item to change it later
        $scope.tmpEditItem = item;

        // Preset form values
        $scope.form.choreName.$setViewValue(item.choreName);
        $scope.form.choreDesc.$setViewValue(item.choreDesc);
        $scope.form.choreID.$setViewValue(item.choreID);
        $scope.form.reward.$setViewValue(item.reward);

        //$scope.form.useAsDefault.$setViewValue(item.useAsDefault);
        // Open dialog
        $scope.showAddChangeDialog('change');
    };

    $scope.editItem = function(form) {
        var index=null;
        console.log('chore length'+$scope.chores.length);
        console.log('choreID'+form.choreID.$modelValue);
        console.log($scope.chores);

        for (var i = 0; i < $scope.chores.length; i++) {
            if ($scope.chores[i].choreID==form.choreID.$modelValue) {
                index=i;
                console.log(index);
                console.log(form.choreID.$modelValue);
            }
        }


        var newItem = {};
        var newItem=
        {
            //result.path.o[3] is the firebase ID of the particular transaction entry
            'choreID': form.choreID.$modelValue,
            //get values using $modelVaue from the form
            'choreName': form.choreName.$modelValue,
            'reward': form.reward.$modelValue,
            'choreDesc':form.choreDesc.$modelValue
        };
        var deferred5=$q.defer();
        var promise5=deferred5.promise;

        promise5.then(function(result) {
            $scope.chores.splice(index, 1,newItem);

        })
        deferred5.resolve(SharedData.get().child("chores").child(userSession.user.uid).child("chore").child(form.choreID.$modelValue).update(newItem));
        $scope.leaveAddChangeDialog();
    }
}])

