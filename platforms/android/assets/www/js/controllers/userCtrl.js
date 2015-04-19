/**
 * Created by nik on 2/28/15.
 */

angular.module('starter.controllers')
.controller('usersCtrl', ['Paginator','GEOFIRE_REF','$geofire','$localstorage','$q','SharedData','$ionicModal','$scope','FIREBASE_REF','$firebaseSimpleLogin','userSession','$rootScope','$state',
        function(Paginator,GEOFIRE_REF,$geofire,$localstorage,$q,SharedData,$ionicModal,$scope,FIREBASE_REF,$firebaseSimpleLogin,userSession,$rootScope,$state) {
    var tmp;
    var deferred2=$q.defer();
    var promise2=deferred2.promise;
    var deferred3=$q.defer();
    var promise3=deferred3.promise;
    $scope.userList=[];
    $scope.friendList=[];
    // Query radius
        //var tmp2=SharedData.get().child("chores").child(userSession.user.uid).child("chore");
          var tmp2=SharedData.get().child("users");

            var fb = new Firebase('https://examples-sql-queries.firebaseio.com/widget');
            var paginator = new Paginator(tmp2, 2);
        $scope.doRefresh = function() {

            var callBack= function(result){
                console.log(result);
                //console.log(value);
                var key1={};
                //key1[key]={uName:key};
                angular.forEach(result,function(value,key){
                    console.log(key);

                    //key1[key]={uName:key};
                    console.log(value);
                    $scope.userList.unshift(value);
                    console.log($scope.userList);
                    $localstorage.setObject('userList',$scope.userList);
                    //console.log('calbak received');
                    //console.log( value);

                    //$localstorage.appendObject('userList', value);
                    //console.log('userlist is');
                    //console.log($localstorage.getObject('userList'));

                    //console.log(value.choreName,key);
                    //$scope.userList.push(value);
                    //console.log('printing users');
                    //console.log($scope.userList);

                });

            };
            paginator.nextPage(callBack);

            /*tmp2.orderByKey().on("value", function (snapshot) {
                console.log(snapshot.val());
                angular.forEach(snapshot.val(),function(value,key){

                    //console.log(value.choreName,key);
                    //$scope.userList.push(value);

                    //var key1={};
                    //key1[key]={uName:key};
                    //$scope.userList.unshift({uName:key});
                    //$localstorage.appendObject('userList', key1);

                    //console.log('printing users');
                    //console.log($scope.userList);
                    //console.log($localstorage.getObject('userList'));


                });

                //console.log(paginator.isFirstPage());
                paginator.nextPage(callBack);


            }); */


            //$scope.userList.unshift({uName: 'Incoming todo ' + Date.now()});
            //console.log($scope.userList);
            $scope.$broadcast('scroll.refreshComplete');
            $scope.$apply();
        };

    promise2.then(function(result) {
        //alert('Success' + result);
        //$scope.choreVals = result;
        //console.log( JSON.stringify(result));

        angular.forEach(result,function(value,key){
            //console.log(value.choreName,key);
            $scope.userList.push(value);
            //console.log('printing users');
            //console.log($scope.userList);

        });
        //$scope.chores.push(result);

    }, function(reason){
        alert('Error'+reason);

    });

    //deferred.resolve($scope.$storage.chores);
    //deferred2.resolve($scope.chores);
    deferred2.resolve(($localstorage.getObject('userList')));

        promise3.then(function(result) {
            //alert('Success' + result);
            //$scope.choreVals = result;
            console.log( 'in friendList update function');

            angular.forEach(result,function(value,key){
                //console.log(key);
                $scope.friendList.push(value);
                console.log('printing friends');
                console.log($scope.friendList);
                if(value) {
                    tmp = SharedData.get().child('friends').child(userSession.user.uid).child('friend').child(userSession.user.provider + ':' + key).update(value);
                };


            });
            //$scope.chores.push(result);

        }, function(reason){
            alert('Error'+reason);

        });

        //deferred.resolve($scope.$storage.chores);
        //deferred2.resolve($scope.chores);
        deferred3.resolve(($localstorage.getObject('friendList')));

        $q.all([promise2, promise3])
            .then(function(results) {
                //console.log(results[0], results[1]);
            });

    }])
;