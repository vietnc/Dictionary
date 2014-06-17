/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Save word to favorites list
 */
starterControllers.directive('saveWord', function(){
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
                alert("Saved");
                db.saveWord(scope.selectedObject);
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

starterControllers.directive('selectWord', function(){
    function link(scope, element, attrs) {
        
        element.on('click',function(){
            console.log('select word');
        });
    }
    return {
        restrict: 'A',
        link: link
        
    }
});