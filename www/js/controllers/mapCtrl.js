/**
 * Created by nik on 2/28/15.
 */
angular.module('starter.controllers')
.controller('mapCtrl',
                ['GEOFIRE_REF','$geofire','$q','$localstorage','$scope','userSession','$rootScope',
        function(GEOFIRE_REF,$geofire,$q,$localstorage,$scope,userSession,$rootScope){

            mixpanel.track("map page");
            var myFirebaseRefWater = 'YOUR GEO DATABASE ';

            var map;
    var vehiclesInQuery = {};
    var markerClusterer = null;
    var markers = [];
    //console.log(GEOFIRE_REF);
// Set the center as Firebase HQ
            //console.log($localstorage.getObject('mySavedLocation'));

    var locations = {
        "Folsom": [38.652437, -121.09062399999999],
        "Caltrain": [37.7789, -122.3917],
        "San Mateo": [37.51279402989196,-122.33250195327632]
    };
    //console.log(locations);

    //$scope.center = locations["Caltrain"];
    if ($localstorage.get('loggedIn')==1)
    {
        //console.log($localstorage.getObject('mySavedLocation'));
        if($localstorage.getObject('mySavedLocation')) {
            $scope.center = $localstorage.getObject('mySavedLocation');
            console.log('mySavedLocation exists');
        }
        else {
            $localstorage.setObject('mySavedLocation',$scope.center);
            console.log('mySavedLocation doesnt     exists');

        }

    }
    else
    {
        $scope.center = locations["San Mateo"];
        $localstorage.setObject('mySavedLocation',$scope.center);
    }

// Query radius
    var geoFireUrl=GEOFIRE_REF;
    var geoFireRef = new Firebase(geoFireUrl);

    var $geo = $geofire(geoFireRef);
    //var geoFire= $geo;
    $scope.radiusInKm = 10;
    $scope.radiusInM=$scope.radiusInKm*1000;
    $scope.radiusNew=$scope.radiusInKm;


    /*************/
    /*  GEOQUERY */
    /*************/
// Keep track of all of the vehicles currently within the query


// Create a new GeoQuery instance
    var geoQuery = $geo.$query({
        //center: locations["Folsom"],
        center: $scope.center,
        radius: $scope.radiusInKm
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
            zoom: 20,
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
                $localstorage.setObject('myNewLocation', place.geometry.location);
                //console.log(place.geometry.location);
                var tmp= Object.keys(place.geometry.location).map(function (key) {return place.geometry.location[key]});
                //console.log(tmp);

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
            if (infoBubble.getMap() != null) {
                infoBubble.close()
                //delete infoBubble;
                //infoBubble = new InfoBubble({
                //    maxWidth: 300
                //});
            }
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

        $scope.saveLocation= function() {
            var deferred = $q.defer();

            var promise = deferred.promise;
            promise.then(function (result) {
                result=Object.keys(result).map(function (key) {return result[key]});
                console.log(result);

                if (result) {
                    console.log(result);
                    $geo.$set(userSession.user.uid,result );
                    $localstorage.setObject('mySavedLocation',result);
                }
                else {
                    alert('no location');
                }

            })
            deferred.resolve($localstorage.getObject('myNewLocation'));

        }
    })

    //}
    /**********************/
    /*  HELPER FUNCTIONS  */
    /**********************/
    /* Adds a marker for the inputted vehicle to the map */

            function getRandomArbitrary(min, max) {
                var bucket = [1,2,3,4];

                var randomIndex = Math.floor(Math.random()*bucket.length);
                return randomIndex;
            };

    createVehicleMarker = function(location,key) {
        var contentString = key;
        //console.log('content is'+contentString);
        /*var infowindow = new google.maps.InfoWindow({
         content: contentString
         }); */
        var imageNo=getRandomArbitrary(1,4);

        //console.log('creating marker');
        if(imageNo==1){
            var image = '../../img/corn.png';
        }
        else if(imageNo==2){
            var image = '../../img/fruit.png';
        }
        else if(imageNo==3){
            var image = '../../img/waterfilter.png';
        }
        else {
            var image = '../../img/medicine.png';
        };


        var marker = new google.maps.Marker({
            //icon: "https://chart.googleapis.com/chart?chst=d_bubble_icon_text_small&chld=" + vehicle.vtype + "|bbT|" + vehicle.routeTag + "|" + vehicleColor + "|eee",
            position: new google.maps.LatLng(location[0],location[1]),
            icon: image,
            map: map
        });
        marker.html = '<div>'+ key+ '</div>';


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

