/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.controller('DictHomeCtrl', function($scope,$timeout) {
    $scope.wordSelected = false;
    $scope.resultsCollection = [];
    /**
    * Select word
    */
    $scope.selectResult = function(result) {
        $scope.wordSelected = true;
        $scope.selectedObject = result;
        $scope.resultsCollection = [];
        $scope.searchStr = null;
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
                    $scope.resultsCollection.push(row);
                }
            });
            $timeout(function(){
                $scope.$apply();
            },100);
        }
           
    }
})