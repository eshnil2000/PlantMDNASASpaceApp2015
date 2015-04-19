/**
 * Created by nik on 2/28/15.
 */
angular.module('starter.controllers')

.controller('profileCtrl',['$http','$state','$geofire','$ionicModal','$q','$localstorage','$scope','userSession','$rootScope',function($http,$state,$geofire,$ionicModal,$q,$localstorage,$scope,userSession,$rootScope){
        mixpanel.track("Profile page");
    $scope.userAddress=null;
    $scope.userLocation=null;



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

    var firebaseUrl='YOUR URL';
    //var $geo = $geofire(new Firebase('YOUR URL'));
    var firebaseRef = new Firebase(firebaseUrl);

    var $geo = $geofire(firebaseRef);

    geocoder = new google.maps.Geocoder();



    $scope.codeAddress= function () {
        var address = document.getElementById('Autocomplete').value;
        var operation;
        geocoder.geocode( { 'address': address}, function(results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                //console.log(results[0].geometry.location);
                var array = Object.keys(results[0].geometry.location).map(function(k) { return results[0].geometry.location[k] });
                var query = $geo.$query({
                    center: array,
                    radius:.5
                });
                //console.log(query);



                $geo.$set(userSession.user.uid, array);
                $scope.leaveAddChangeDialog();
            }

            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }

        });
    }




    $scope.result1 = 'initial value';

    var deferred4=$q.defer();
    var promise4=deferred4.promise;

    promise4.then(function(result) {
        $scope.userData=result;

    }, function(reason){
        alert('Error'+reason);

    });

    deferred4.resolve(userSession.user);

    $rootScope.$on('loggedIn', function(event, user) {
        //console.log('event fired logged out');
        $scope.userData=userSession.user;
        console.log($scope.userData.accessToken);

    })
    $rootScope.$on('loggedout', function(event, user) {
        //console.log('event fired logged out');
        $scope.userData={};
    })

    // Load the add / change dialog from the given template URL
    $ionicModal.fromTemplateUrl('templates/addLocation.html', function(modal) {
        $scope.addDialog = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });


    $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        $state.go('app.showMap');
        /*
         $scope.addDialog.show();
         var input = document.getElementById('pac-input'));

         var autocomplete = new google.maps.places.Autocomplete(input);
         console.log(autocomplete); */



    };

    $scope.leaveAddChangeDialog = function() {
        // Remove dialog
        $scope.addDialog.remove();
        // Reload modal template to have cleared form
        $ionicModal.fromTemplateUrl('templates/addLocation.html', function(modal) {
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

}])


