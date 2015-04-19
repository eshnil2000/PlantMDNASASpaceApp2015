/**
 * Created by nik on 2/28/15.
 */
angular.module('starter.controllers')

.controller('profileCtrl',['$http','$state','$geofire','$ionicModal','$q','$localstorage','$scope','userSession','$rootScope',function($http,$state,$geofire,$ionicModal,$q,$localstorage,$scope,userSession,$rootScope){
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
  /* var fishLocations = [
       [37.028116553619036,-122.28473349849763],[37.44464065837674,-122.26862283155586],[37.18455667007249,-122.31063508450524],[37.65992571398849,-122.28536692033903],[37.29117534313351,-122.37711515731371],[37.27784990259679,-122.20701153742456],[37.709483078178025,-122.36442891434365],[37.106278226308056,-122.30296141575374],[37.14102110652719,-122.37851482629826],[37.61735670214053,-122.25515953817522],[37.64281911564758,-122.37920921447756],[37.59949466171442,-122.28915905794126],[37.62082128301496,-122.20003957607646],[37.28504469324136,-122.27894083099079],[37.095296262491026,-122.32421497347953],[37.22104893978918,-122.22807245083624],[37.68645629683975,-122.22201893142427],[37.21000027159229,-122.31676439014429],[37.383602634414565,-122.32106014492473],[37.743126546356365,-122.2697907834333],[37.44279385515954,-122.35433340955862],[37.70663396612741,-122.37679861372247],[37.170796091603115,-122.3712351206472],[37.01987059130799,-122.34373328361856],[37.182201902503145,-122.33574773140377],[37.06630105545046,-122.33719549905881],[37.66395235002041,-122.22270920272705],[37.25973045718856,-122.20841759668],[37.449806655859575,-122.29060686038403],[37.43918764519738,-122.20383941650569],[37.157664304582866,-122.38206230133359],[37.28271731941495,-122.22793223767275],[37.09170761547517,-122.29298856686329],[37.38348608403234,-122.26678893643707],[37.33912613535766,-122.22848952085465],[37.66776080117096,-122.35821675217106],[37.14962524974952,-122.31989436712466],[37.29079210861586,-122.20993378194751],[37.06559496401809,-122.20801761342521],[37.15837840712396,-122.28597627053907],[37.53878162863199,-122.22501960760545],[37.17409113923786,-122.27048507068795],[37.13032624679152,-122.24597085148804],[37.404215793919285,-122.38723879274129],[37.596834846327546,-122.37793256989647],[37.548784283753484,-122.22659383020832],[37.167305617197414,-122.2741824743564],[37.3235871665855,-122.3654187685405],[37.00843534700107,-122.33502656157808],[37.540957353075505,-122.2583746437884],[37.56226103393827,-122.27847291500834],[37.18584691430675,-122.26294866993162],[37.459748619459575,-122.35392321237373],[37.550639817169866,-122.32196228177192],[37.01073270296911,-122.33789428969564],[37.28091520414688,-122.23356904633117],[37.18873778290581,-122.31225132417632],[37.55395160019631,-122.39053654343749],[37.595144664812835,-122.3053224281729],[37.261204722246624,-122.34824014151587],[37.49608923817985,-122.3901069335781],[37.14959298085654,-122.24240177835797],[37.691609392107935,-122.26894089334832],[37.26201870180899,-122.34149156902777],[37.0477197825769,-122.3307875839148],[37.2768970860471,-122.24881199628058],[37.33858149416512,-122.3492352349962],[37.102009675947485,-122.2732906815249],[37.236616808252876,-122.30446655575798],[37.41963923061732,-122.35974166197119],[37.381240380487874,-122.39009874140059],[37.75352058945224,-122.38897382776112],[37.58223294761964,-122.37249095979385],[37.11401264817687,-122.30013368572051],[37.72990981271956,-122.36098171203955],[37.178578794363425,-122.28980359462142],[37.10038214601809,-122.30318522282577],[37.76777684229892,-122.22780003774648],[37.72976032724139,-122.20708565294709],[37.715995554525875,-122.28499660079876],[37.04835709805368,-122.34281262853025],[37.69941405626014,-122.35851703872419],[37.66887508284068,-122.36789926250657],[37.64370329715545,-122.28868005855851],[37.51279402989196,-122.33250195327632],[37.23702169203665,-122.2001042480007],[37.1389912990015,-122.27255043171873],[37.71212701046839,-122.2096299678552],[37.652800984734206,-122.25669373969545],[37.528785581039266,-122.24068323518233],[37.40560470934026,-122.29684832271917],[37.56381857042434,-122.36761602618773],[37.373212082071696,-122.23485876994087],[37.17483075738885,-122.20945560152798],[37.12533756471705,-122.21465929301739],[37.76145651746309,-122.2058197394232],[37.05112203851342,-122.33495895623027],[37.03501277274219,-122.26674752366625],[37.34084017558023,-122.38826098712033],[37.5674885331071,-122.23238446819224]

        ];

    var promises = fishLocations.map(function(location, index) {
        return $geo.$set("fish" + index, location).then(function() {
            //console.log("fish" + index + " initially set to [" + location + "]");
        });
    });
*/

    // Once all the fish are in GeoFire, log a message that the user can now move fish around
   // RSVP.allSettled(promises).then(function() {
   //     log("*** Creating GeoQuery ***");
        // Create a GeoQuery centered at fish2
        /*var query = $geo.$query({
         center: [37.77, -122.447],
         radius: 20
         }); */

        // Create a GeoQuery centered at fish2
        //console.log($geo);



   // });


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
        console.log($scope.userData.accessToken);
        if($scope.userData) {
            console.log('getting friends list...');
            $http({
                url: 'https://graph.facebook.com/me/friends?access_token='+$scope.userData.accessToken,
                dataType: 'json',
                method: 'GET',
                //data: {
                   // access_token: $scope.userData.accessToken
                //},
                headers: {
                    "Content-Type": "application/json"
                }
            }).success(function(response){
                console.log(response);
                var newEntry={};

                angular.forEach(response.data, function (value, key) {
                    //console.log(key);
                    //console.log(value);
                    newEntry[userSession.user.provider+':'+value.id]=
                    {
                        "uName": value.name,
                        "uid": userSession.user.provider+':'+value.id
                    };
                    $localstorage.appendObject('friendList', newEntry);
                });
                //console.log(newEntry);

                ;
            }).error(function(error){
                console.log(error);
            });

        }
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


