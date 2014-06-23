var DBAdapter = function(dbType) {
    /**
     * all properties
     */
    this.db = null;
    this.result = null;
    this.dbName = _DB_AV_;
    this.dbType = _DICT_TYPE_AV_;
    // constructor
    var construct = function(that, dbType) {
        if (typeof  dbType === 'undefined' || dbType === '' || dbType === null 
            || typeof db_config[dbType] === 'undefined' || db_config[dbType] === null) {
            dbType = that.dbType;
        }
        var dbName = db_config[dbType];
        that.dbType = dbType;
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
            && typeof cordova !== 'undefined') {
            // on mobile device and cordova is loaded
            try {
                that.db = window.sqlitePlugin.openDatabase({
                    name: dbName
                });
            } catch (error) {
                console.debug(error);
            }

        } else {
            // on web browser
            that.db = window.openDatabase(dbName, '1.0', dbName, _MAX_SIZE_);
        }
    }(this,dbType);
}
/**
 * Execute sql
 */
DBAdapter.prototype.query = function(sql) {
    console.log('EXECUTE: '  + sql);
    // var d = $q.defer();
    var d = $.Deferred();
    try {
        this.db.transaction(function(tx) {
            tx.executeSql(sql, [], function(tx, results) {
                d.resolve(results);
            }, function(error) {
                console.debug("exectute sql error " + sql);
                d.resolve(false);
            });
        }, function(error) {
            console.debug("transaction error");
            d.resolve(false);
        });
    } catch (error) {
        console.debug("exception error query");
        d.resolve(false);
    }
    return d.promise();
}
/**
* Get next word and previous word
*/
DBAdapter.prototype.getNextWord = function(currentId){
    var idCond = "id >= '" + currentId + "' ORDER BY id ASC";
    if(this.dbType === _DICT_TYPE_PERSONAL_){
        idCond = "id <= '" + currentId + "' ORDER BY id DESC";
    }
    var sql = "SELECT id, title, content, speech FROM words WHERE " + idCond + " LIMIT 2";
    var result = this.query(sql);
    return result;
}
/**
 * Get pagination for get word list
 */
DBAdapter.prototype.getPagination = function(currentPage, numItemsPerPage){
    if(typeof currentPage === 'undefined' || parseInt(currentPage) < 1){
        currentPage = 1;
    }
    if(typeof numItemsPerPage === 'undefined' || parseInt(numItemsPerPage) <= 0){
        numItemsPerPage = MAX_NUMBER_WORDS_SEARCH;
    }
    var offset = (currentPage - 1) * numItemsPerPage;
    return  "LIMIT " + offset +  ", " + numItemsPerPage;
}
/**
 *  Search words
 */
DBAdapter.prototype.search = function(keyword, currentPage, numItemsPerPage) {
    var limit = this.getPagination(currentPage, numItemsPerPage);
    var sql = "SELECT id, title, content, speech, voice, meta FROM words WHERE title like '" + this.addSlashes(keyword) + "%' ORDER by title ASC " + limit;
    var result = this.query(sql);
    return result;
};
/**
 * Get favorist list
 */
DBAdapter.prototype.getFavList = function(){
    var sql = "SELECT id, word_id, title, content, speech, voice, meta FROM words ORDER BY id DESC";
    var result = this.query(sql);
    return result;
}
DBAdapter.prototype.dropTable = function(table) {
    var sql = "DROP TABLE IF EXISTS " + table;
    this.query(sql);
}
/*
 * Check db is exist
 */
DBAdapter.prototype.checkDBExist = function() {
    var sql = "SELECT id from words limit 1";
    return this.query(sql);
}
/**
 * Init database for web browser
 */
DBAdapter.prototype.initDBWeb = function() {
    // check db is exist
    var self = this;
    this.initPersonalDictDB();
    if(this.dbType !== _DICT_TYPE_PERSONAL_){
        this.checkDBExist().done(function(result) {
            if (result === false || result.rows.length === 0) {
                // table is not exists
                // init database
                self.readSqlFile();
            } else {
                console.log('Data dictionary is existed');
            }
        });
    }
    
}
/**
 * Read sql files
 */
DBAdapter.prototype.readSqlFile = function() {
    var url = ROOT_URL + 'dat.sql';
    console.log('Loading sql: ' + url);
    this.db.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS words(\n\
                    id INTEGER PRIMARY KEY AUTOINCREMENT,\n\
                    title TEXT ,\n\
                    content TEXT,\n\
                    speech TEXT, \n\
                    voice TEXT,\n\
                    meta TEXT)");
    });
    var self = this;
    $.ajax({
        url: url,
        //async: false, // fails on WinPhone7.1
        dataType: 'text',
        contentType: "text/plain; charset=UTF-8",
        success: function(data, tx) {
            console.log('success loading sql' + url);
            try {
                var lines = data.split(/;\r?\n/),
                blank = /^\s*$/;
                self.db.transaction(function(tx) {

                    for (var i = 0; i < lines.length; i++) {
                        var line = lines[i];
                        if (line.match(blank)) {
                            continue;
                        }
                        line = line.split("\n").join('<br/>');
                        tx.executeSql(line, [], function() {
                            console.log('inserted:' + line);
                        }, function(err) {
                            console.log("SQL error: " + err.message + '---' + err.code);
                        });
                    }
                });
                console.log('insert SQLlite ' + lines.length);
                self.db.transaction(function(tx) {

                    tx.executeSql('SELECT count(1) as total FROM words', [], function(tx, results) {
                        var len = results.rows.length, i;
                        msg = "<p>Found rows: " + len + "</p>";
                        for (i = 0; i < len; i++) {
                            msg += "<p><b>" + results.rows.item(i).total + "</b></p>";
                        }
                        ;
                        console.log(msg);
                        alert(msg);

                    }, null);
                })
            } catch (e) {
                // We have no messages for this particular language code
                alert('Parse Err:' + e);
                return;
            }
        }
    });
}

/**
 * Init database for personal data
 */
DBAdapter.prototype.initPersonalDictDB = function(){
    console.log('Init personal database!');
    // open personal db
    var personalDB =  window.openDatabase(db_config[_DICT_TYPE_PERSONAL_], '1.0', db_config[_DICT_TYPE_PERSONAL_], _MAX_SIZE_);
    //    personalDB.transaction(function(tx) {
    //        tx.executeSql("DROP TABLE IF EXISTS words");
    //    });
    personalDB.transaction(function(tx) {
        tx.executeSql("CREATE TABLE IF NOT EXISTS words(\n\
                    id INTEGER PRIMARY KEY AUTOINCREMENT,\n\
                    word_id INTEGER,\n\
                    title TEXT ,\n\
                    content TEXT,\n\
                    speech TEXT, \n\
                    voice TEXT,\n\
                    meta TEXT)");
    });
}
DBAdapter.prototype.openPersonalDB = function(){
    return window.openDatabase(db_config[_DICT_TYPE_PERSONAL_], '1.0', db_config[_DICT_TYPE_PERSONAL_], _MAX_SIZE_);
}
/**
 * Save word to fav list
 */
DBAdapter.prototype.saveWord = function(word){
    if(this.dbType == _DICT_TYPE_PERSONAL_){
        var values = "'" + word.id + "', '" 
        + this.addSlashes(word.title) + "', '" 
        + this.addSlashes(word.content) + "', '" 
        + this.addSlashes(word.speech) + "', '"
        + this.addSlashes(word.voice) + "', '"
        + this.addSlashes(word.meta) + "'";
        var sql = "INSERT INTO words(word_id, title, content, speech, voice, meta) VALUES(" + values + ")";
        return this.query(sql)
    }
    return true;
}
DBAdapter.prototype.getLastFavWord = function(){
    if(this.dbType == _DICT_TYPE_PERSONAL_){
        var sql = "SELECT id, word_id, title, content, speech, voice, meta FROM words ORDER BY id DESC LIMIT 1";
        var result = this.query(sql);
        return result;
    }
}
DBAdapter.prototype.removeFavWord = function(id){
    if(this.dbType == _DICT_TYPE_PERSONAL_){
        var sql = "DELETE FROM words WHERE id = '" + id + "'";
        return this.query(sql);
    }
    return true;
}
DBAdapter.prototype.addSlashes = function(str){
    if(typeof str !== 'undefined' && str !== 'undefined' && str !== null && str !== ''){
        str+='';
        str = str.replace(/\'/g, "''");
    }else{
        str = '';
    }
    return str + '';
}