/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope,$timeout,$location, $anchorScroll) {
    $scope.view = 'home';
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
    $scope.currentPage = 1;
    $scope.hasNextPage = false;
    /**
    * Select word
    */
    $scope.selectResult = function(wordIndex) {
        // set the location.hash to the id of
        // the element you wish to scroll to.
        $location.hash('word_selected');

        // call $anchorScroll()
        $anchorScroll();
        
        // word selected
        var lengthResults = $scope.resultsCollection.length;
        if(wordIndex <  lengthResults){
            $scope.wordSelected = true;
            $scope.selectedObject = $scope.resultsCollection[wordIndex];
            $scope.searchStr = null;
        }
        // next word
        var nextWordIndex =  wordIndex+1;
        if(nextWordIndex < lengthResults){
            $scope.nextObject = $scope.resultsCollection[wordIndex+1];
        }else{
            $scope.selectNextWord($scope.selectedObject.id);
        }
        $scope.resultsCollection = [];
       
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
    $scope.searchDict = function(str, pageNum){
        $scope.currentPage = pageNum;
        if(pageNum <= 1){
            $scope.resultsCollection = []; 
            $scope.currentPage = 1;
        }
        $scope.wordSelected = false;
        var db = new DBAdapter();
        if(str !== '' && str.length >= 1){
            db.search(str, $scope.currentPage, MAX_NUMBER_WORDS_SEARCH).done(function(result) {
              
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    $scope.resultsCollection.push(row);
                }
                if($scope.resultsCollection.length < MAX_NUMBER_WORDS_SEARCH){
                    $scope.hasNextPage = false;
                }else{
                    $scope.hasNextPage = true;
                }
                
            });
            $timeout(function(){
                $scope.$apply();
            },100);
        }
        db = null;

    }
    
})