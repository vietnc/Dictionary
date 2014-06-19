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
starterControllers.directive('saveWord', function($ionicPopup){
    function link(scope, element, attrs) {
        scope.$watch('selectedObject',function(){
            if(scope.selectedObject !== null){
                if(typeof scope.listFavWords[scope.selectedObject.id] !== 'undefined'){
                    scope.isFavWord = 1;
                }else{
                    scope.isFavWord = 0;
                };
            }
        });
        element.on('click',function(){
            if(scope.isFavWord == 0){
                var db = new DBAdapter(_DICT_TYPE_PERSONAL_);
                db.saveWord(scope.selectedObject).done(function(){
                    $ionicPopup.alert({
                        title: 'Message',
                        template: 'Saved to favorites list' 
                    });
                });
                
                scope.listFavWords[scope.selectedObject.id] = scope.selectedObject;
                scope.isFavWord = 1;
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
