/**
 * List words controller
 */


starterControllers.controller('LearningWordCtrl', function($scope, $timeout, $stateParams, LocalDataService) {
    $scope.currentPageList = 1;
    $scope.listWords = [];
    $scope.selectedObject = {};
    $scope.nextObject = {};
    $scope.getListWords = function(){
        LocalDataService.getFavList().done(function(listWords){
            $scope.listWords = listWords;
            $scope.$apply();
        });
       
        
    }
    $scope.selectWord = function(wordId){
        LocalDataService.getCurrentAndNextWord(wordId, _DICT_TYPE_PERSONAL_).done(function(wordsSelected){
            $scope.selectedObject = wordsSelected[0];
            if(wordsSelected.length == 2){
                $scope.nextObject = wordsSelected[1];
            }else{
                $scope.nextObject = null;
            }
            $scope.$apply();
        });
    }
    $scope.hideBackButton = true;
    if($stateParams.wordId !== null){
        $scope.selectWord($stateParams.wordId);
    }
});