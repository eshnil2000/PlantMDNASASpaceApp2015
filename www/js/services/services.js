/**
 * Created by nik on 12/27/14.
 */
angular.module('starter.services', [])
    .value('FIREBASE_REF','YOUR FIREBASE REFERENCE')
    .value('GEOFIRE_REF','YOUR GEOLOCATION REFERENCE')
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

    .factory('Paginator',function () {
        var apiUrl = 'https://api.github.com/';

        var getLastKey=function(obj) {
            var key;
            if (obj) {
                each(obj, function (v, k) {
                    key = k;
                });
            }
            return key;
        }

         var getFirstKey= function(obj) {
            var key;
            if (obj) {
                each(obj, function (v, k) {
                    key = k;
                    return true;
                });
            }
            return key;
        }

         var dropFirst=function(obj) {
            if (obj) {
                delete obj[getFirstKey(obj)];
            }
            return obj;
        }

        var dropLast=function(obj) {
            if (obj) {
                delete obj[getLastKey(obj)];
            }
            return obj;
        }

        var map=function(obj, cb) {
            var out = [];
            each(obj, function (v, k) {
                out.push(cb(v, k));
            });
            return out;
        }

        var each=function(obj, cb) {
            if (obj) {
                for (k in obj) {
                    if (obj.hasOwnProperty(k)) {
                        var res = cb(obj[k], k);
                        if (res === true) {
                            break;
                        }
                    }
                }
            }
        }

        var size=function(obj) {
            var i = 0;
            each(obj, function () {
                i++;
            });
            return i;
        }

        // instantiate our initial object
        var Paginator = function(ref, limit) {
            this.ref = ref;
            this.pageNumber = 0;
            this.limit = limit;
            this.lastPageNumber = null;
            this.currentSet = {};
        };

        Paginator.prototype = {
            nextPage: function (callback) {
                if( this.isLastPage() ) {
                    //callback(this.currentSet);
                }
                else {
                    var lastKey = getLastKey(this.currentSet);
                    //console.log('lastkey'+lastKey);
                    // if there is no last key, we need to use undefined as priority
                    var pri = lastKey ? null : undefined;
                    //console.log('pri'+pri);
                    this.ref.startAt(pri, lastKey)
                        .limit(this.limit + (lastKey? 1 : 0))
                        .once('value', this._process.bind(this, {
                            cb: callback,
                            dir: 'next',
                            key: lastKey
                        }));
                }
            },

            prevPage: function (callback) {
                console.log('prevPage', this.isFirstPage(), this.pageNumber);
                if( this.isFirstPage() ) {
                    callback(this.currentSet);
                }
                else {
                    var firstKey = getFirstKey(this.currentSet);
                    // if there is no last key, we need to use undefined as priority
                    this.ref.endAt(null, firstKey)
                        .limit(this.limit+1)
                        .once('value', this._process.bind(this, {
                            cb: callback,
                            dir: 'prev',
                            key: firstKey
                        }));
                }
            },

            isFirstPage: function () {
                return this.pageNumber === 1;
            },

            isLastPage: function () {
                return this.pageNumber === this.lastPageNumber;
            },

            _process: function (opts, snap) {
                var vals = snap.val(), len = size(vals);
                console.log('_process', opts, len, this.pageNumber, vals);
                if( len < this.limit ) {
                    // if the next page returned some results, it becomes the last page
                    // otherwise this one is
                    this.lastPageNumber = this.pageNumber + (len > 0? 1 : 0);
                }
                if (len === 0) {
                    // we don't know if this is the last page until
                    // we try to fetch the next, so if the next is empty
                    // then do not advance
                    opts.cb(this.currentSet);
                }
                else {
                    if (opts.dir === 'next') {
                        this.pageNumber++;
                        if (opts.key) {
                            dropFirst(vals);
                        }
                    } else {
                        this.pageNumber--;
                        if (opts.key) {
                            dropLast(vals);
                        }
                    }
                    this.currentSet = vals;
                    opts.cb(vals);
                }

            }
        };


        // This can be seen as a private function, since cannot
        // be accessed from outside of the factory

        // Here starts your public APIs (public methods)
        return Paginator;


    })

    .factory('$localstorage', ['$window', function($window) {
        /* stringify function to deal with circular JSON reference: https://github.com/isaacs/json-stringify-safe/blob/master/stringify.js */
        //JSON.stringify(localStorage).length === 2636625 or 2.51448 MB
        console.log(JSON.stringify($window.localStorage).length);
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
            },

            appendObject: function(key,value){
                var objectKey;
                for(var keytemp in value) {
                    //console.log(keytemp);
                    objectKey=keytemp;
                };

                var existingEntries = JSON.parse($window.localStorage[key] || '{}');
                //existingEntries[value]={};
                existingEntries[objectKey]=value[objectKey];
                //console.log(value[objectKey]);

                //existingEntries.push(value);
                //console.log(existingEntries);
                $window.localStorage[key] = stringify(existingEntries,null,2);
                //console.log($window.localStorage[key]);

            }
            //To do append object
              /*  function addEntry() {
                // Parse any JSON previously stored in allEntries
                var existingEntries = JSON.parse(localStorage.getItem("allEntries"));
                if(existingEntries == null) existingEntries = [];
                var entryTitle = document.getElementById("entryTitle").value;
                var entryText = document.getElementById("entryText").value;
                var entry = {
                    "title": entryTitle,
                    "text": entryText
                };
                localStorage.setItem("entry", JSON.stringify(entry));
                // Save allEntries back to local storage
                existingEntries.push(entry);
                localStorage.setItem("allEntries", JSON.stringify(existingEntries));
            };
            */

        }
    }])

    .service('loginCtrl',

        //['$geofire','GEOFIRE_REF','$q', '$localstorage', 'SharedData', 'FIREBASE_REF',  'userSession', '$rootScope', '$state', '$ionicModal',
        //function ($geofire,GEOFIRE_REF,$q, $localstorage, SharedData, FIREBASE_REF,  userSession, $rootScope, $state, $ionicModal) {


            ['$geofire','GEOFIRE_REF','$q', '$localstorage', 'SharedData', 'FIREBASE_REF', '$firebaseSimpleLogin', 'userSession', '$rootScope', '$state', '$ionicModal',
            function ($geofire,GEOFIRE_REF,$q, $localstorage, SharedData, FIREBASE_REF, $firebaseSimpleLogin, userSession, $rootScope, $state, $ionicModal) {
        var doLogin = function () {
            SharedData.set(new Firebase(FIREBASE_REF));
            //userSession=new Firebase(FIREBASE_REF);
            userSession.auth = $firebaseSimpleLogin(SharedData.get());
            $rootScope.loggedIn = 0;

            var geoFireUrl=GEOFIRE_REF;
            var geoFireRef = new Firebase(geoFireUrl);
            var $geo = $geofire(geoFireRef);



            $rootScope.logout = function () {
                userSession.auth.$logout();
            };

            $rootScope.logout = function () {
                'YOUR FACEBOOK LOGIN APP ';
            };
        }


        return {
            doLogin: doLogin

        };


    }]);

