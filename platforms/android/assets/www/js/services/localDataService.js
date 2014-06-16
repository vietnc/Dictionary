/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


starterControllers.factory('LocalDataService',function(){
    // get favorist words list
    function getFavList(){
        var listWords = [];
        var d = $.Deferred();
        var db = new DBAdapter(_DICT_TYPE_PERSONAL_);
        db.getFavList().done(function(result){
            for(var i = 0; i < result.rows.length; i++ ){
                listWords.push(result.rows.item(i));
            }
            d.resolve(listWords);
        });
        return d.promise();
    }
    // get selected word and next word
    function getCurrentAndNextWord(wordId, DBType){
        var words = [];
        var db = new DBAdapter(DBType);
        var d = $.Deferred();
        db.getNextWord(wordId).done(function(result){
            for(var i = 0; i < result.rows.length; i++ ){
                words.push(result.rows.item(i));
            }
            d.resolve(words);
        });
        return d.promise();
    }
    return {
        getFavList: getFavList,
        getCurrentAndNextWord: getCurrentAndNextWord
    }
});