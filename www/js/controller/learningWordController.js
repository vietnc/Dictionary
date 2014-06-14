/**
 * List words controller
 */


starterControllers.controller('LearningWordCtrl', function($scope, $timeout, $location, $anchorScroll, $sce) {
    $scope.currentPageList = 1;
    $scope.listWords = [];
    $scope.getListWords = function(){
        var db = new DBAdapter(_DICT_TYPE_PERSONAL_);
        db.getFavList().done(function(result){
            for(var i = 0; i < result.rows.length; i++ ){
                $scope.listWords.push(result.rows.item(i));
            }
        });
        $timeout(function(){
            $scope.$apply();
        },_TIME_OUT_);
        
    }
});