/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope,$rootScope, $timeout, $location, $anchorScroll, $sce, LocalDataService, $ionicPlatform) {
    $scope.hideBackButton = true;
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
    $scope.currentPage = 1;
    $scope.hasNextPage = false;
    $scope.isCharFilter = false;
    $scope.typeSearch = TYPE_SEARCH;
    $scope.selectedObject = null;
    /**
    * Select word
    */
    $scope.selectResult = function(wordIndex) {
        // word selected
        var lengthResults = $scope.resultsCollection.length;
        if(wordIndex <  lengthResults){
            $scope.wordSelected = true;
            $scope.selectedObject = $scope.resultsCollection[wordIndex];
            var speech = $scope.selectedObject.speech;
            $scope.selectedObject.speech = $sce.trustAsHtml(speech);
            speech = null;
            $scope.searchStr = null;
            $scope.keyword = null;
        }
        // next word
        var nextWordIndex =  wordIndex+1;
        if(nextWordIndex < lengthResults){
            $scope.nextObject = $scope.resultsCollection[wordIndex+1];
        }else{
            $scope.selectNextWord($scope.selectedObject.id);
        }
        $scope.resultsCollection = [];
        $timeout(function() {
            // set the location.hash to the id of
            // the element you wish to scroll to.
            $scope.$apply(function(){
                $location.hash('top');
                // call $anchorScroll()
                $anchorScroll();
            });
           
        },_TIME_OUT_);
       
    };
    /**
     * Select next word
     */
    $scope.selectNextWord = function(wordId){
        LocalDataService.getCurrentAndNextWord(wordId, _DICT_TYPE_AV_).done(function(words){
             $scope.selectedObject = words[0];
            if(words.length === 2){
                $scope.nextObject = words[1];
            }
            $scope.$apply();
        });
       
       
    }
    /**
    * Search dictionary
    */
    $scope.searchDict = function(str, pageNum, typeSearch){
        $scope.$evalAsync(function(){
            if(typeof typeSearch === 'undefined' || typeSearch === TYPE_SEARCH){
                // type search on search box
                $scope.typeSearch = TYPE_SEARCH;
            }else{
                // type search by filter charater
                $scope.typeSearch = TYPE_FILTER_CHAR;
                $scope.searchStr = null;
            }
            $scope.keyword = str;
            if(pageNum <= 1){
                $scope.resultsCollection = []; 
                $scope.currentPage = 1;
            }
            $scope.currentPage = pageNum;
            $scope.wordSelected = false;
            var db = new DBAdapter();
            if($scope.keyword !== '' && $scope.keyword.length >= 1){
                $.when(db.search($scope.keyword, $scope.currentPage, MAX_NUMBER_WORDS_SEARCH)).then(function(result) {
                    var resultLength = result.rows.length;
                    var collection = [];
                    for (var i = 0; i < resultLength; i++) {
                        var row = result.rows.item(i);
                        collection.push(row);
                    }
                    if(resultLength < MAX_NUMBER_WORDS_SEARCH){
                        $scope.hasNextPage = false;
                    }else{
                        $scope.hasNextPage = true;
                    }
                    $scope.resultsCollection = collection;
                    $scope.$apply();
                });
       
            }
            db = null;
        });
      
    }
    $timeout(function(){
        $scope.$apply();
    },200);
    $scope.characters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','X','Y','Z','W'];
    $ionicPlatform.ready(function() {
        // Platform stuff here.
        $scope.listFavWords = LocalDataService.getFavList();
    });
  
})