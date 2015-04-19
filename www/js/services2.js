/**
 * Created by nik on 4/11/15.
 */

angular.module('starter.controllers')

.value('USER',{})
    //.value('SOCKET_URL','localhost:8000')
    .value('SOCKET_URL','YOUR_SOCKET_ADDRESS')

    .value('FIREBASE_REF2','YOUR_FIREBASE_INSTANCE')

    .config(function($httpProvider){
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    });
