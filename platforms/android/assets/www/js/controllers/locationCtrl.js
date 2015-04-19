/**
 * Created by nik on 2/28/15.
 */
angular.module('starter.controllers')
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


;