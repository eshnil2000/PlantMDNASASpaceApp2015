/**
 * Created by nik on 1/5/15.
 */
angular.module('starter.directives',[])


.directive('disableTap', function($timeout) {
    return {
        link: function() {
            $timeout(function() {
                // Find google places div
                _.findIndex(angular.element(document.querySelectorAll('pac-input')), function(container) {
                    // disable ionic data tab

                    // leave input field if google-address-entry is selected
                    container.onclick = function() {
                        //console.log('container for autocomplete clicked');
                        document.getElementById('autocomplete').blur();

                    };
                });
            },500);
        }
    };
})

    .directive('starRating',
    function() {
        return {
            restrict : 'A',
            template : '<ul class="rating">'
            + '	<li ng-repeat="star in stars" ng-class="star" ng-click="toggle($index)">'
            + '\u2605'
            + '</li>'
            + '</ul>',
            scope : {
                ratingValue : '=',
                max : '=',
                onRatingSelected : '&'
            },
            link : function(scope, elem, attrs) {
                var updateStars = function() {
                    scope.stars = [];
                    for ( var i = 0; i < scope.max; i++) {
                        scope.stars.push({
                            filled : i < scope.ratingValue
                        });
                    }
                };

                scope.toggle = function(index) {
                    scope.ratingValue = index + 1;
                    scope.onRatingSelected({
                        rating : index + 1
                    });
                };

                scope.$watch('ratingValue',
                    function(oldVal, newVal) {
                        if (newVal) {
                            updateStars();
                        }
                    }
                );
            }
        };
    }
);
;