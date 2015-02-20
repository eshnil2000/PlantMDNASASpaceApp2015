/**
 * Created by nik on 12/27/14.
 */
angular.module('starter.services', [])
    .value('FIREBASE_REF','https://socialauthnik.firebaseio.com')

    .value('userSession',{})
    .value('USER',{})


    .service('SharedData', function() {
        var FIREBASE_ENTRY_POINT = {};

        var set = function(newObj) {
            FIREBASE_ENTRY_POINT=newObj;
            //console.log("in set fn");
            //console.log(FIREBASE_ENTRY_POINT);
        }

        var get = function(){
            return FIREBASE_ENTRY_POINT;
        }

        return {
            set: set,
            get: get
        };

    })

    .factory('$localstorage', ['$window', function($window) {
        /* stringify function to deal with circular JSON reference: https://github.com/isaacs/json-stringify-safe/blob/master/stringify.js */

        var getSerialize =function  (fn, decycle) {
            var seen = [], keys = [];
            decycle = decycle || function(key, value) {
                return '[Circular ' + getPath(value, seen, keys) + ']'
            };
            return function(key, value) {
                var ret = value;
                if (typeof value === 'object' && value) {
                    if (seen.indexOf(value) !== -1)
                        ret = decycle(key, value);
                    else {
                        seen.push(value);
                        keys.push(key);
                    }
                }
                if (fn) ret = fn(key, ret);
                return ret;
            }
        }

        var getPath =function  (value, seen, keys) {
            var index = seen.indexOf(value);
            var path = [ keys[index] ];
            for (index--; index >= 0; index--) {
                if (seen[index][ path[0] ] === value) {
                    value = seen[index];
                    path.unshift(keys[index]);
                }
            }
            return '~' + path.join('.');
        }

        var stringify =function (obj, fn, spaces, decycle) {
            return JSON.stringify(obj, getSerialize(fn, decycle), spaces);
        }


        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function(key, value) {
                //console.log("set key/va"+key +value);

                //$window.localStorage[key] = JSON.stringify(value,censor(value));
                $window.localStorage[key] = stringify(value,null,2);
                //console.log(value);
            },
            getObject: function(key) {
                //console.log("get key/va"+key);
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

