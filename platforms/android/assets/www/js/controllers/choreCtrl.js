/**
 * Created by nik on 2/28/15.
 */

angular.module('starter.controllers')
.controller('choreCtrl', ['$localstorage','$q','SharedData','$ionicModal','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state',function($localstorage,$q,SharedData,$ionicModal,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state){
    $rootScope.$on('loggedout', function(event, user) {
        setTimeout(function () {
            $scope.$apply(function () {
                //$scope.message = "Timeout called!";
                $scope.chores=[];
            });
        },2000);


    })
    var deferred6=$q.defer();
    var promise6=deferred6.promise;

    promise6.then(function(result) {
        if (result=={}){
            $scope.chores=[];
        }


    }, function(reason){
        alert('Error'+reason);

    });

    deferred6.resolve(userSession.user);


    $scope.chores=[];
    var testItem={
        'choreID': 1234,
        //get values using $modelVaue from the form
        'choreName': 'test',
        'rewards': 'test',
        'choreDesc':'test'

    }
    //$scope.chores=;
    $scope.saved = $localstorage.getObject('chores');

    //$scope.saved =$localstorage.getObject('chores');
    //console.log( $localstorage.getObject('chores'));
    //$localstorage.setObject('chores',$scope.saved);

    //console.log( JSON.stringify($localstorage.getObject('chores')));
    //$scope.chores=[];
    //Use deferred else values in view will not be updated, if not resolved.
    //console.log( "scope.chores is"+ JSON.stringify($scope.chores));
    var deferred2=$q.defer();
    var promise2=deferred2.promise;

    promise2.then(function(result) {
        //alert('Success' + result);
        //$scope.choreVals = result;
        //console.log( JSON.stringify(result));

        angular.forEach(result,function(value,key){
            //console.log(value.choreName,key);
            $scope.chores.push(value);
            //console.log(loop[key]);

        });
        //$scope.chores.push(result);

    }, function(reason){
        alert('Error'+reason);

    });

    //deferred.resolve($scope.$storage.chores);
    //deferred2.resolve($scope.chores);
    deferred2.resolve(($localstorage.getObject('chores')!==null) ? $scope.saved : $scope.saved);

    //Use this if views are not updating with new values
    /*$scope.safeApply = function(fn) {
     var phase = this.$root.$$phase;
     if (phase == '$apply' || phase == '$digest') {
     if(fn && (typeof(fn) === 'function')) {
     fn();
     }
     } else {
     this.$apply(fn);
     }
     }; */



    $scope.choreNameChanged=function(val,old,scope){
        tempReward = val ;
        //console.log('choreName=' + tempReward);

    };
    $scope.rewardChanged=function(val,old,scope){
        tempReward = val ;
        //console.log('reward choreCtrl=' + tempReward);

    };

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

    $scope.leftButtons = [];
    var addButton = {};
    addButton.type = "button-clear";
    addButton.content = '<i class="icon ion-ios7-plus-outline"></i>';
    addButton.tap = function(e) {
        $scope.showAddChangeDialog('add');
    }
    $scope.leftButtons.push(addButton);
    //console.log(addButton.type);
    // Define item buttons
    $scope.itemButtons = [{
        text: 'Delete',
        type: 'button-assertive',
        onTap: function(item) {
            $scope.removeItem(item);
        }
    }, {
        text: 'Edit',
        type: 'button-calm',
        onTap: function(item) {
            $scope.showEditItem(item);
        }
    }];


    // Used to cache the empty form for Edit Dialog
    $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
    }

    $scope.addItem = function(form) {
        var newItem={};
        //console.log($scope.chores);

        var deferred3=$q.defer();
        var promise3=deferred3.promise;

        promise3.then(function(result) {
            //console.log( result);
            //console.log("chore array is"+ JSON.stringify($scope.chores));
            //$scope.choreVals = result;
            //tmp=result;
            console.log(result.path.w[3]);
            var newItem=
            {
                //result.path.o[3] is the firebase ID of the particular transaction entry
                'choreID': result.path.w[3],
                //get values using $modelVaue from the form
                'choreName': form.choreName.$modelValue,
                'reward': form.reward.$modelValue,
                'choreDesc':form.choreDesc.$modelValue
            };

            SharedData.get().child("chores").child(userSession.user.uid).child("chore").child(result.path.w[3]).update(newItem);
            //var newItem={ 'choreID': result,'choreName': form.choreName.$modelValue };
            //console.log('printi  scope.chores');


            //$scope.chores.push(newItem);
            //console.log($scope.chores);
            $scope.chores.push(newItem);
            //console.log('printing chore iD in firebase');
            //console.log(result.path.o[3]);
            //
            //console.log(newItem);
            $localstorage.setObject('chores', $scope.chores);
            //console.log('printing localstore chore obj');
            //console.log( choreList.getObject('chores'));

            //$localStorage.chores ({'choreName': form.choreName.$modelValue});

            //console.log($localStorage.chores);
            //storeChoreService.broadcastChoreEvent($rootScope);

            $scope.leaveAddChangeDialog();

            //console.log(result);

        }, function(reason){
            alert('Error'+reason);

        });
        //deferred3.resolve(SharedData.get().child("users").child(userSession.user.uid).child("chore").push({choreName: form.choreName.$modelValue}));
        deferred3.resolve(SharedData.get().child("chores").child(userSession.user.uid).child("chore").push({choreName: form.choreName.$modelValue,  reward: form.reward.$modelValue, choreDesc:form.choreDesc.$modelValue}));

    }


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

