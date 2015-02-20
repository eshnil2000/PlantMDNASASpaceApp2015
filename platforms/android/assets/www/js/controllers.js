angular.module('starter.controllers', [])
    //Make sure the ORDER of dependencies injected and the parameters passed to function are the same order.
    //Ex. ['$scope','FIREBASE_REF',...], function($scope,FIREBASE_REF,..)
        .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {

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

    .controller('AppCtrl', ['$q','$localstorage','storeChoreService','SharedData','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state','$ionicModal',function($q,$localstorage,storeChoreService,SharedData,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state,$ionicModal){

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

        SharedData.set(new Firebase(FIREBASE_REF));
        userSession.auth=$firebaseSimpleLogin(SharedData.get());
        $scope.loggedIn=0;

        $scope.logout=function(){
            userSession.auth.$logout();
        };

        $scope.login=function(provider){

            userSession.auth.$login(provider);
        };

        $rootScope.$on('$firebaseSimpleLogin:error', function(event, error) {
            console.log('Error logging user in: ', error);
        });

        $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {

            $localstorage.set('loggedIn',0);
            $scope.loggedIn=$localstorage.get('loggedIn');
            $rootScope.$broadcast('loggedout');
            $localstorage.setObject('chores',[]);

            window.localStorage.clear();
            userSession.user=null;
            $state.go('app.profile');

        });

        $rootScope.$on('$firebaseSimpleLogin:login', function(event, user) {
            userSession.user=user;
            //console.log(user);
            $localstorage.set('loggedIn',1);
            $scope.loggedIn=$localstorage.get('loggedIn');

            //Get list of users & store in localstorage
            var userList=[];

            //deferred.resolve(SharedData.get().child("users").child());
            var tmp1 = SharedData.get().child("users");
            tmp1.on("value", function (snapshot) {

                var loop = snapshot.val();
                //console.log(loop);
                setTimeout(function () {
                    $scope.$apply(function () {
                        //$scope.message = "Timeout called!";
                        $localstorage.setObject('userList', loop);
                    });
                },2000);

            });

            ///End get list of users

            tmp = SharedData.get().child("chores").child(userSession.user.uid).child("chore");
            //Save user profile
            if( userSession.user.provider=='facebook'){
                var picLink=userSession.user.thirdPartyUserData.picture.data.url;
            }
            var profileData= {
                uid:userSession.user.uid,
                uName:userSession.user.displayName,
                pic:picLink
            };


            tmp2 = SharedData.get().child("users").child(userSession.user.uid).set(profileData);


            tmp.on('child_added', function(childSnapshot, prevChildName) {
            });

            tmp.on("value", function(snapshot) {

                var loop=snapshot.val();
                //console.log(loop);
                angular.forEach(loop,function(value,key){
                    //console.log(value.choreName,key);
                    loop[key].choreID=key;
                    //console.log(loop[key]);

                });

                setTimeout(function () {
                    $scope.$apply(function () {
                        //$scope.message = "Timeout called!";
                        $localstorage.setObject('chores', loop);
                    });
                },2000);

                //console.log($localstorage.getObject('chores'));

                //storeChoreService.set(loop);
                //storeChoreService.broadcastChoreEvent($rootScope);

            });
            $rootScope.$broadcast('loggedIn');
            $state.go('app.profile');
            //$localStorage.loggedIn=1;
            $scope.closeLogin();
            //console.log(userSession.auth);


        });

        // Create the login modal that we will use later
        $ionicModal.fromTemplateUrl('templates/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        // Triggered in the login modal to close it
        $scope.closeLogin = function() {
            $scope.modal.hide();
        };

        // Open the login modal
        $scope.loginShow = function() {
            $scope.modal.show();
        };


    }])



    .controller('choreCtrl', ['$localstorage','storeChoreService','$q','SharedData','$ionicModal','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state',function($localstorage,storeChoreService,$q,SharedData,$ionicModal,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state){
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

        $rootScope.$on('choreEvent', function(storeChoreService) {
            var deferred=$q.defer();
            var promise=deferred.promise;

            promise.then(function(result) {
                //alert('Success' + result);
                //$scope.choreVals = result;
                //console.log(result);

            }, function(reason){
                alert('Error'+reason);

            });
        });

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

    .controller('profileCtrl',['$state','$geofire','$ionicModal','$q','$localstorage','$scope','userSession','$rootScope',function($state,$geofire,$ionicModal,$q,$localstorage,$scope,userSession,$rootScope){
         $scope.userAddress=null;
         $scope.userLocation=null;

        /*$rootScope.$on('fetchUserAddress', function(event, user) {
            console.log('event fired fetchUserAddress');

            var deferred=$q.defer();
            var promise=deferred.promise;

            promise.then(function(result) {
                $scope.myLocation=result;
                console.log($scope.myLocation);
            }, function(reason){
                alert('Error'+reason);

            });
            deferred.resolve($localstorage.getObject('myLocation'));

            var deferred2=$q.defer();
            var promise2=deferred2.promise;

            promise2.then(function(result) {
                $scope.userAddress=result;
                console.log($scope.userAddress);
            }, function(reason){
                alert('Error'+reason);

            });
            deferred2.resolve($localstorage.getObject('myAddress'));

            //$scope.userAddress=$localstorage.getObject('myLocation');
            //$scope.userLocation=$localstorage.getObject('myAddress');

            //console.log(userLocation);
        }) */


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

        var firebaseUrl='https://geolocate.firebaseio.com/';
        //var $geo = $geofire(new Firebase('https://geolocate.firebaseio.com/'));
        var firebaseRef = new Firebase(firebaseUrl);

        var $geo = $geofire(firebaseRef);
        /*$geo.$set("some_key", [-6,160])
            .catch(function(err) {
                $log.error(err);
            }); */
        var fishLocations = [
            [-40, 159],
            [90, 70],
            [-46, 160],
            [0, 0]
        ];
        var promises = fishLocations.map(function(location, index) {
            return $geo.$set("fish" + index, location).then(function() {
                //console.log("fish" + index + " initially set to [" + location + "]");
            });
        });

        // Once all the fish are in GeoFire, log a message that the user can now move fish around
        RSVP.allSettled(promises).then(function() {
            log("*** Creating GeoQuery ***");
            // Create a GeoQuery centered at fish2
            /*var query = $geo.$query({
                center: [37.77, -122.447],
                radius: 20
            }); */

            // Create a GeoQuery centered at fish2
            //console.log($geo);



        });


        /*$geo.$query({
            center: fishLocations[2],
            radius: 3000
        }); */

         /*$geo.$query({
             center: fishLocations[2],
             radius: 3000
        }); */


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

.controller('usersCtrl', ['$localstorage','storeChoreService','$q','SharedData','$ionicModal','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state',function($localstorage,storeChoreService,$q,SharedData,$ionicModal,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state) {
        var deferred2=$q.defer();
        var promise2=deferred2.promise;
        $scope.userList=[];
        promise2.then(function(result) {
            //alert('Success' + result);
            //$scope.choreVals = result;
            //console.log( JSON.stringify(result));

            angular.forEach(result,function(value,key){
                //console.log(value.choreName,key);
                $scope.userList.push(value);
                //console.log(loop[key]);

            });
            //$scope.chores.push(result);

        }, function(reason){
            alert('Error'+reason);

        });

        //deferred.resolve($scope.$storage.chores);
        //deferred2.resolve($scope.chores);
        deferred2.resolve(($localstorage.getObject('userList')));
    }])

    .controller('mapCtrl', ['$location','$geofire','$q','$localstorage','storeChoreService','SharedData','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state','$ionicModal',function($location,$geofire,$q,$localstorage,storeChoreService,SharedData,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state,$ionicModal){
        var map;
        var vehiclesInQuery = {};
        var markerClusterer = null;
        var markers = [];



// Set the center as Firebase HQ
        var locations = {
            "Folsom": [38.652437, -121.09062399999999],
            "Caltrain": [37.7789, -122.3917]
        };
        //console.log(locations);

         $scope.center = locations["Folsom"];

// Query radius
        var firebaseUrl='https://geolocate.firebaseio.com/';
        //var $geo = $geofire(new Firebase('https://geolocate.firebaseio.com/'));
        var firebaseRef = new Firebase(firebaseUrl);

        var $geo = $geofire(firebaseRef);
        //var geoFire= $geo;
         $scope.radiusInKm = 1;
        $scope.radiusInM=$scope.radiusInKm*1000;
        $scope.radiusNew=$scope.radiusInKm;


        /*************/
        /*  GEOQUERY */
        /*************/
// Keep track of all of the vehicles currently within the query


// Create a new GeoQuery instance
        var geoQuery = $geo.$query({
            center: $scope.center,
            radius: $scope.radiusInKm
        });

        var onKeyEnteredRegistration = geoQuery.on("key_entered","KEY:ENTERED");
        var onKeyExitedRegistration = geoQuery.on("key_exited","KEY:EXIT");
        var onReadyRegistration = geoQuery.on("ready", "KEY:READY");


        $scope.$on("KEY:READY", function (event, key, location, distance) {
            //console.log('REGISTERED');
        });
        $scope.$on("KEY:ENTERED", function (event, key, location, distance) {
            //console.log('ENTERED');
            //vehicleId = key;
            //vehiclesInQuery[key] = location;
                //console.log(key+' :'+ location[0]+ ':'+ location[1]+ ':dist:'+distance);
            vehiclesInQuery[key] =createVehicleMarker(location);
        });$scope.$on("KEY:EXIT", function (event, key, location, distance) {
            //console.log('EXIT');
            if(vehiclesInQuery[key]) {
                vehiclesInQuery[key].setMap(null);
            }
            //console.log(key+' :'+ location[0]+ ':'+ location[1]);
        });


        /*****************/
        /*  GOOGLE MAPS  */
        /*****************/
        /* Initializes Google Maps */


        $scope.$on('mapInitialized', function(evt, evtMap) {


            map = evtMap;
            //console.log(map);
            var input = document.getElementById('pac-input');


            var autocomplete = new google.maps.places.Autocomplete(input);
            var mapOptions = {
                zoom: 4,
                center: $scope.center,
                mapTypeId: google.maps.MapTypeId.TERRAIN
            };
            //var map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
            //console.log(map);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                //console.log('place changed fired');
                var deferred2=$q.defer();
                var promise2=deferred2.promise;
                //console.log(map.shapes);
                //console.log(document.getElementById('pac-input').value);

                //var oldCircle= new google.maps.Circle(document.getElementById("circle"));
                //console.log("oroginal"+ oldCircle.getCenter());
                promise2.then(function(result) {
                    var place =result;
                    //console.log('printing place');
                    //console.log(place);
                    //console.log(place.geometry);
                    $localstorage.setObject('myLocation', place.geometry.location);
                    $localstorage.setObject('myAddress', document.getElementById('pac-input').value);
                    $rootScope.$broadcast('fetchUserAddress');
                    map.setCenter(place.geometry.location);
                        var circleOptions = {
                            strokeColor: '#FF0000',
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: '#FF0000',
                            fillOpacity: 0.35,
                            map: map,
                            center: place.geometry.location,
                            radius: 1
                        };
                        map.shapes.circle.setCenter(place.geometry.location);
                        //(circleOptions);
                        //console.log(place.geometry.location);
                        $scope.center=place.geometry.location;
                        //console.log(oldCircle.getCenter());



                    /*
                    // Add the circle for this city to the map.
                    var cityCircle = new google.maps.Circle(circleOptions); */

                    //console.log('printing cityCircle...');
                    //console.log(cityCircle);
                    //$scope.center = place.geometry.location;
                    //map.setCenter(place.geometry.location);
                    geoQuery.updateCriteria({
                        center: [place.geometry.location.lat(), place.geometry.location.lng()],
                        radius: $scope.radiusInKm
                    });
                })
                deferred2.resolve(autocomplete.getPlace());

                //var place = autocomplete.getPlace();

            })

             $scope.boundsChanged=function (evt,evtMap){

                var newLat=this.getCenter().lat();
                 var newLong=this.getCenter().lng();
                var newRadius=this.getRadius();
                 $scope.radiusNew=(newRadius/1000).toFixed(2);
                 //console.log('bounds changed: '+newLat + ' '+newLong+ " "+ newRadius);
                 geoQuery.updateCriteria({
                     center: [newLat, newLong],
                     radius: newRadius/1000
                 });
            }
    })

        //}
        /**********************/
        /*  HELPER FUNCTIONS  */
        /**********************/
        /* Adds a marker for the inputted vehicle to the map */
        createVehicleMarker = function(location) {
            //console.log('creating marker');
            var marker = new google.maps.Marker({
                //icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
                position: new google.maps.LatLng(location[0],location[1]),

                map: map
            });
            markers.push(marker);
            //console.log(markers);
            //markerClusterer = new MarkerClusterer(map, markers);
            return marker;
        };

        /* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
        function getVehicleColor(vehicle) {
            return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
        }

        /* Returns true if the two inputted coordinates are approximately equivalent */
        function coordinatesAreEquivalent(coord1, coord2) {
            return (Math.abs(coord1 - coord2) < 0.000001);
        }

        /* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
        google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
            var toLat = newLocation[0];
            var toLng = newLocation[1];

            var fromLat = this.getPosition().lat();
            var fromLng = this.getPosition().lng();

            if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
                var percent = 0;
                var latDistance = toLat - fromLat;
                var lngDistance = toLng - fromLng;
                var interval = window.setInterval(function () {
                    percent += 0.01;
                    var curLat = fromLat + (percent * latDistance);
                    var curLng = fromLng + (percent * lngDistance);
                    var pos = new google.maps.LatLng(curLat, curLng);
                    this.setPosition(pos);
                    if (percent >= 1) {
                        window.clearInterval(interval);
                    }
                }.bind(this), 50);
            }
        }

        /* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
        google.maps.Circle.prototype.animatedMoveTo = function(newLocation) {
            var toLat = newLocation[0];
            var toLng = newLocation[1];

            var fromLat = this.getPosition().lat();
            var fromLng = this.getPosition().lng();

            if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
                var percent = 0;
                var latDistance = toLat - fromLat;
                var lngDistance = toLng - fromLng;
                var interval = window.setInterval(function () {
                    percent += 0.01;
                    var curLat = fromLat + (percent * latDistance);
                    var curLng = fromLng + (percent * lngDistance);
                    var circleOptions = {
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.35,
                        map: map,
                        center: newLocation,
                        radius: 1,
                        editable: true
                    };
                    var pos = new google.maps.Circle(circleOptions);
                    this.setCenter(pos);
                    if (percent >= 1) {
                        window.clearInterval(interval);
                    }
                }.bind(this), 50);
            }
        }

    }])

    .controller('locationCtrl',['$q','$localstorage','$rootScope','$geofire', function($q,$localstorage,$rootScope,$geofire){
        var input = /** @type {HTMLInputElement} */(
            document.getElementById('pac-input'));
        //console.log(input);

        var autocomplete = new google.maps.places.Autocomplete(input);
        google.maps.event.addListener(autocomplete, 'place_changed', function() {
            //console.log('place changed fired');
            var deferred2=$q.defer();
            var promise2=deferred2.promise;
            //console.log(map.shapes);
            //console.log(document.getElementById('pac-input').value);

            //var oldCircle= new google.maps.Circle(document.getElementById("circle"));
            //console.log("oroginal"+ oldCircle.getCenter());
            promise2.then(function(result) {
                var place =result;
                //console.log('printing place');
                //console.log(place);
                //console.log(place.geometry);
                $localstorage.setObject('myLocation', place.geometry.location);
                $localstorage.setObject('myAddress', document.getElementById('pac-input').value);
                $rootScope.$broadcast('fetchUserAddress');

                /*
                map.setCenter(place.geometry.location);
                var circleOptions = {
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.35,
                    map: map,
                    center: place.geometry.location,
                    radius: 1
                };
                map.shapes.circle.setCenter(place.geometry.location);
                //(circleOptions);
                //console.log(place.geometry.location);
                $scope.center=place.geometry.location;

                */
                //console.log(oldCircle.getCenter());



                /*
                 // Add the circle for this city to the map.
                 var cityCircle = new google.maps.Circle(circleOptions); */

                //console.log('printing cityCircle...');
                //console.log(cityCircle);
                //$scope.center = place.geometry.location;
                //map.setCenter(place.geometry.location);
               /* geoQuery.updateCriteria({
                    center: [place.geometry.location.lat(), place.geometry.location.lng()],
                    radius: $scope.radiusInKm
                }); */

            })
            deferred2.resolve(autocomplete.getPlace());

            //var place = autocomplete.getPlace();

        })
    }])

//Working controller implementing geofire sfVehicles example
    .controller('mapCtrlBackUp', ['$location','$geofire','$q','$localstorage','storeChoreService','SharedData','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state','$ionicModal',function($location,$geofire,$q,$localstorage,storeChoreService,SharedData,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state,$ionicModal){
        var map;

// Set the center as Firebase HQ
        var locations = {
            "FirebaseHQ": [37.785326, -122.405696],
            "Caltrain": [37.7789, -122.3917]
        };
        //console.log(locations);

        var center = locations["FirebaseHQ"];

// Query radius
        var radiusInKm = 0.5;

// Get a reference to the Firebase public transit open data set
        var transitFirebaseRef = new Firebase("https://publicdata-transit.firebaseio.com/")

// Create a new GeoFire instance, pulling data from the public transit data
        var geoFire = new GeoFire(transitFirebaseRef.child("_geofire"));

        /*************/
        /*  GEOQUERY */
        /*************/
// Keep track of all of the vehicles currently within the query
        var vehiclesInQuery = {};

// Create a new GeoQuery instance
        var geoQuery = geoFire.query({
            center: center,
            radius: radiusInKm
        });

        /* Adds new vehicle markers to the map when they enter the query */
        geoQuery.on("key_entered", function(vehicleId, vehicleLocation) {
            // Specify that the vehicle has entered this query
            //console.log(vehicleId);
            vehicleId = vehicleId.split(":")[1];
            vehiclesInQuery[vehicleId] = true;

            // Look up the vehicle's data in the Transit Open Data Set
            transitFirebaseRef.child("sf-muni/vehicles").child(vehicleId).once("value", function(dataSnapshot) {
                // Get the vehicle data from the Open Data Set
                vehicle = dataSnapshot.val();

                // If the vehicle has not already exited this query in the time it took to look up its data in the Open Data
                // Set, add it to the map
                if (vehicle !== null && vehiclesInQuery[vehicleId] === true) {
                    // Add the vehicle to the list of vehicles in the query
                    vehiclesInQuery[vehicleId] = vehicle;

                    // Create a new marker for the vehicle
                    vehicle.marker = createVehicleMarker(vehicle, getVehicleColor(vehicle));
                }
            });
        });

        /* Moves vehicles markers on the map when their location within the query changes */
        geoQuery.on("key_moved", function(vehicleId, vehicleLocation) {
            // Get the vehicle from the list of vehicles in the query
            vehicleId = vehicleId.split(":")[1];
            var vehicle = vehiclesInQuery[vehicleId];

            // Animate the vehicle's marker
            if (typeof vehicle !== "undefined" && typeof vehicle.marker !== "undefined") {
                vehicle.marker.animatedMoveTo(vehicleLocation);
            }
        });

        /* Removes vehicle markers from the map when they exit the query */
        geoQuery.on("key_exited", function(vehicleId, vehicleLocation) {
            // Get the vehicle from the list of vehicles in the query
            vehicleId = vehicleId.split(":")[1];
            var vehicle = vehiclesInQuery[vehicleId];

            // If the vehicle's data has already been loaded from the Open Data Set, remove its marker from the map
            if (vehicle !== true) {
                vehicle.marker.setMap(null);
            }

            // Remove the vehicle from the list of vehicles in the query
            delete vehiclesInQuery[vehicleId];
        });

        /*****************/
        /*  GOOGLE MAPS  */
        /*****************/
        /* Initializes Google Maps */
        var map;

        $scope.$on('mapInitialized', function(evt, evtMap) {
            map = evtMap;
            //console.log(map);

            $scope.boundsChanged=function (evt,evtMap){
                //console.log(e.latLng);

                var newLat=this.getCenter().lat();

                var newLong=this.getCenter().lng();
                var newRadius=this.getRadius();
                console.log(newLat + ' '+newLong+ " "+ newRadius);
                geoQuery.updateCriteria({
                    center: [newLat, newLong],
                    radius: newRadius/1000
                });
            }
        })

        //}
        /**********************/
        /*  HELPER FUNCTIONS  */
        /**********************/
        /* Adds a marker for the inputted vehicle to the map */
        function createVehicleMarker(vehicle, vehicleColor) {
            var marker = new google.maps.Marker({
                icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
                position: new google.maps.LatLng(vehicle.lat, vehicle.lon),
                optimized: true,
                map: map
            });

            return marker;

        }

        /* Returns a blue color code for outbound vehicles or a red color code for inbound vehicles */
        function getVehicleColor(vehicle) {
            return ((vehicle.dirTag && vehicle.dirTag.indexOf("OB") > -1) ? "50B1FF" : "FF6450");
        }

        /* Returns true if the two inputted coordinates are approximately equivalent */
        function coordinatesAreEquivalent(coord1, coord2) {
            return (Math.abs(coord1 - coord2) < 0.000001);
        }

        /* Animates the Marker class (based on https://stackoverflow.com/a/10906464) */
        google.maps.Marker.prototype.animatedMoveTo = function(newLocation) {
            var toLat = newLocation[0];
            var toLng = newLocation[1];

            var fromLat = this.getPosition().lat();
            var fromLng = this.getPosition().lng();

            if (!coordinatesAreEquivalent(fromLat, toLat) || !coordinatesAreEquivalent(fromLng, toLng)) {
                var percent = 0;
                var latDistance = toLat - fromLat;
                var lngDistance = toLng - fromLng;
                var interval = window.setInterval(function () {
                    percent += 0.01;
                    var curLat = fromLat + (percent * latDistance);
                    var curLng = fromLng + (percent * lngDistance);
                    var pos = new google.maps.LatLng(curLat, curLng);
                    this.setPosition(pos);
                    if (percent >= 1) {
                        window.clearInterval(interval);
                    }
                }.bind(this), 50);
            }
        }

    }])


;



