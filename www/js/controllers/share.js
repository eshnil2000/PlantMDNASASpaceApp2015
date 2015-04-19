/**
 * Created by nik on 4/11/15.
 */
angular.module('starter.controllers')

    .controller('share',['$scope','$rootScope','USER','$state',function($scope,$rootScope,USER,$state){

        $rootScope.$on('event:file:selected',function(event,data){
            console.log("file passed to in home controller ");
            //console.log(data);
            //document.getElementById("pano").src = data.image;

            //console.log(data.image)

        });

        $scope.user={};
        $scope.next=function(){
            USER.name=$scope.user.name;
            $state.go('app.chat');
        }
    }])
