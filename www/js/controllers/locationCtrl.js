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


            })
            deferred2.resolve(autocomplete.getPlace());

            //var place = autocomplete.getPlace();

        })
    }])


;