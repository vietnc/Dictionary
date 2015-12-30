/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
// Add this directive where you keep your directives

starterControllers.directive('holdFavWord', function($ionicGesture,$ionicPopup){
    return {
        restrict: 'A',
        link: function($scope, $element, $attr) {
            $ionicGesture.on('hold', function(e) {
                $scope.$apply(function() {
                    $scope.$eval($attr.holdFavWord);
                });
            }, $element);
        }
    }
    
});
/**
 * Save word to favorites list
 */
starterControllers.directive('saveWord', function($ionicPopup, LocalDataService){
    function link(scope, element, attrs) {
        scope.$watch('selectedObject',function(){
            if(scope.selectedObject !== null){
                if(typeof scope.listFavWords[scope.selectedObject.id] !== 'undefined' 
                    && scope.listFavWords[scope.selectedObject.id] != null )
                    {
                    scope.isFavWord = 1;
                }else{
                    scope.isFavWord = 0;
                };
            }
        });
        element.on('click',function(){
            var db = new DBAdapter(_DICT_TYPE_AV_);

            if(scope.isFavWord == 0){
                // add to fav list
                db.saveWord(scope.selectedObject).done(function(result){
                    db.getLastFavWord().done(function(result){
                        var word = result.rows[0];
                        if(word.word_id == scope.selectedObject.id){
                            $ionicPopup.alert({
                                title: 'Message',
                                template: 'Saved to favorites list' 
                            });
                            scope.listFavWords[scope.selectedObject.id] = word;
                            scope.isFavWord = 1;
                        }
                    });
                    
                    
                });
            }else{
                // remove from fav list
                LocalDataService.removeFavWord(scope.listFavWords[scope.selectedObject.id]).done(function(res){
                    if(res == true){
                        scope.isFavWord = 0;
                        scope.listFavWords[scope.selectedObject.id] = null;
                    }
                   
                });
            }
            scope.$apply();
        });
    }
    return {
        restrict: 'E',
        link: link,
        tranclude: true,
        template: '<i ng-class="{icon: 1==1, \'ion-ios7-heart-outline\': isFavWord==0, \'ion-heart\': isFavWord==1, \'is-fav-word\': isFavWord==1 }"></i>'
    }
});
