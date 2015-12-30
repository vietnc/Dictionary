/**
 * List words controller
 */


starterControllers.controller('LearningWordCtrl', function($scope,$timeout, $ionicPlatform, $stateParams, LocalDataService) {
    
    $scope.tab1Url = "learn word";
    
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
    //$scope.hideBackButton = true;
    if(typeof $stateParams.wordId != 'undefined' && $stateParams.wordId !== null){
        console.debug($stateParams.wordId);
        $scope.selectWord($stateParams.wordId);
    }
    /**
     * Remove word
     */
    $scope.onFavHold = function(item) {
        LocalDataService.removeFavWord(item).done(function(result){
            if(result == true){
                $scope.getListWords();
            }
        });
    };
    /**
     * Init data
     */
    $ionicPlatform.ready(function() {
        $timeout(function(){
            $scope.getListWords();
        },500);
    });
});