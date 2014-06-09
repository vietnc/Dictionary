/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope,$timeout,$location, $anchorScroll, $ionicScrollDelegate) {
    
    $scope.view = 'home';
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
    $scope.currentPage = 1;
    $scope.hasNextPage = false;
    $scope.isCharFilter = false;
    $scope.typeSearch = TYPE_SEARCH;
    /**
    * Select word
    */
    $scope.selectResult = function(wordIndex) {
        // word selected
        var lengthResults = $scope.resultsCollection.length;
        if(wordIndex <  lengthResults){
            $scope.wordSelected = true;
            $scope.selectedObject = $scope.resultsCollection[wordIndex];
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
           
        },200);
       
    };
    /**
     * Select next word
     */
    $scope.selectNextWord = function(wordId){
        var db = new DBAdapter();
        db.getNextWord(wordId).done(function(result){
            if(result.rows.length === 2){
                $scope.selectedObject = result.rows.item(0);
                $scope.nextObject = result.rows.item(1);
                $timeout(function(){
                    $scope.$apply();
                },100);
            }
        });
        db = null;
       
    }
    /**
    * Search dictionary
    */
    $scope.searchDict = function(str, pageNum,typeSearch){
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
            });
            $timeout(function(){
                $scope.$apply();
            },300);
        }
        db = null;

    }
    $scope.characters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','X','Y','Z','W'];
    
})