/**
 * Created by nik on 1/5/15.
 */
angular.module('starter.directives',[])
    .directive('browseFile',['$rootScope','USER',function($rootScope,USER){
        return {
            scope:{

            },
            replace:true,
            restrict:'AE',
            link:function(scope,elem,attrs){

                scope.browseFile=function(){
                    document.getElementById('browseBtn').click();
                }

                angular.element(document.getElementById('browseBtn')).on('change',function(e){
                    console.log("browsebutton fired");
                    var file=e.target.files[0];
                    fileReader.readAsDataURL(file);
                    angular.element(document.getElementById('browseBtn')).val('');

                    var fileReader=new FileReader();

                    fileReader.onload=function(event){
                        $rootScope.$broadcast('event:file:selected',{image:event.target.result,sender:USER.name})
                        filePayload=event.target.result;
                        var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
                        console.log(hash.toString());
                        //var f = new Firebase(FIREBASE_REF  + hash + '/filePayload');
                        var f = new Firebase(FIREBASE_REF );

                        console.log(f);

                        f.set(filePayload, function() {
                            console.log("saved in"+ FIREBASE_REF);
                        });

                    }


                });

            },
            templateUrl:'templates/browse-file.html'
        }
    }])



;