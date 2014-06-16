/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


/**
 * Save word to favorites list
 */
starterControllers.directive('saveWord', function(){
    function link(scope, element, attrs) {
        element.on('click',function(){
            console.log("save word to favourites list");
            alert('save word');
            var db = new DBAdapter(_DICT_TYPE_PERSONAL_);
            db.saveWord(scope.selectedObject);
        });
    }
    return {
        restrict: 'A',
        link: link
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