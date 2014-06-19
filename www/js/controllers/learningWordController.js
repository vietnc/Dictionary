/**
 * List words controller
 */


starterControllers.controller('LearningWordCtrl', function($scope,$ionicPopup, $stateParams, LocalDataService) {
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
    $scope.onFavHold = function(item) {
        // Show the action sheet
        console.debug("on fav word hold");
        var confirmPopup = $ionicPopup.confirm({
            title: 'Message',
            template: 'Are you sure you want to remove "' + item.title + '"  from favorites list?'
        });
        confirmPopup.then(function(res) {
            if(res) {
                console.log('Deleted');
                 $scope.removeFavWord(item);
            }
        });
    };
    $scope.removeFavWord = function(item) {
        LocalDataService.removeFavWord(item.id).done(function(result){
            if(result == true){
                console.debug("Deleted success");
                $scope.getListWords();
            }
        });
    };
});