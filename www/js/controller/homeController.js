/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope,$timeout) {
    $scope.view = 'home';
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
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
            console.log($scope.selectedObject);
        }
        // next word
        var nextWordIndex =  wordIndex+1;
        if(nextWordIndex < lengthResults){
            $scope.nextObject = $scope.resultsCollection[wordIndex+1];
            $scope.nextObject.index = wordIndex+1;
        }
     
    };
    /**
    * Search dictionary
    */
    $scope.searchDict = function(str, pageNum){
        $scope.wordSelected = false;
        var db = new DBAdapter();
        $scope.resultsCollection = [];    
        if(str !== '' && str.length >= 1){
            db.search(str, pageNum, MAX_NUMBER_WORDS_SEARCH).done(function(result) {
                for (var i = 0; i < result.rows.length; i++) {
                    var row = result.rows.item(i);
                    row.fullContent  =  row.content.split('<br/>');
                    row.shortContent = row.fullContent[2];
                    $scope.resultsCollection.push(row);
                }
            });
            $timeout(function(){
                $scope.$apply();
            },100);
        }
           
    }
})