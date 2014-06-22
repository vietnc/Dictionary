/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope, $timeout, $location, $anchorScroll, $sce, LocalDataService, $ionicPlatform) {
    $scope.hideBackButton = true;
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
    $scope.currentPage = 1;
    $scope.hasNextPage = false;
    $scope.isCharFilter = false;
    $scope.typeSearch = TYPE_SEARCH;
    $scope.selectedObject = null;
    
    $scope.isFavWord = 0;
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
        var wordId = $scope.selectedObject.id;
        if(nextWordIndex < lengthResults){
            $scope.nextObject = $scope.resultsCollection[wordIndex+1];
        }else{
            $scope.selectNextWord(wordId);
        }
        if(typeof $scope.listFavWords[wordId] === 'undefined'){
            $scope.isFavWord = 0;
        }else{
            $scope.isFavWord = 1;
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
        $scope.isFavWord = 0;
        LocalDataService.getCurrentAndNextWord(wordId, _DICT_TYPE_AV_).done(function(words){
            $scope.selectedObject = words[0];
            if(words.length === 2){
                $scope.nextObject = words[1];
            }
            if(typeof $scope.listFavWords[wordId] === 'undefined'){
                $scope.isFavWord = 0;
            }else{
                $scope.isFavWord = 1;
            }
            console.log('is fav ' + $scope.isFavWord);
            $scope.$apply();
        });
       
       
    }
    /**
    * Search dictionary
    */
    $scope.searchDict = function(str, pageNum, typeSearch){
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
            db.search($scope.keyword, $scope.currentPage, MAX_NUMBER_WORDS_SEARCH).done(function(result) {
                var resultLength = result.rows.length;
                for (var i = 0; i < resultLength; i++) {
                    var row = result.rows.item(i);
                    $scope.resultsCollection.push(row);
                }
                if(resultLength < MAX_NUMBER_WORDS_SEARCH){
                    $scope.hasNextPage = false;
                }else{
                    $scope.hasNextPage = true;
                }
                $scope.$apply();
            });
       
        }else{
            $scope.hasNextPage = false;
        }
        db = null;
    }
    $scope.characters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','X','Y','Z','W'];
    $ionicPlatform.ready(function() {
        // Platform stuff here.
        LocalDataService.getFavList().done(function(listWords){
            var list = {};
            for(var i = 0; i < listWords.length; i++){
                var id = listWords[i].word_id;
                list[id] = listWords[i];
            }
            $scope.listFavWords = list;
        });
        $scope.searchDict('F',1,1);
    });
  
})