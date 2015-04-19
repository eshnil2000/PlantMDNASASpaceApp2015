/**
 * Created by nik on 2/28/15.
 */
//angular.module('starter.controllers') accesses already created module
//angular.module('starter.controllers',[]) creates a new module
angular.module('starter.controllers')
.controller('introCtrl',['$scope',function($scope) {
    $scope.rating = 5;
    $scope.rateFunction = function(rating) {
        // alert('Rating selected - ' + rating);
    };

}])
;