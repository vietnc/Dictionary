var DBAdapter = function(dbType) {
    /**
     * all properties
     */
    this.db = null;
    this.result = null;
    this.dbName = _DB_AV_;
    // constructor
    var construct = function(that, dbType) {
        if (typeof  dbType === 'undefined' || dbType === '' || dbType === null 
            || typeof db_config[dbType] === 'undefined' || db_config[dbType] === null) {
            dbType = _DICT_TYPE_AV_;
        }
        var dbName = db_config[dbType];
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
            && typeof cordova !== 'undefined') {
            // on mobile device and cordova is loaded
            try {
                that.db = window.sqlitePlugin.openDatabase({
                    name: dbName
                });
                that.checkDBExist().done(function(result) {
                    if (result === false) {
                    }
                });
            } catch (error) {
                console.log(error);
            }

        } else {
            // on web browser
            that.db = window.openDatabase(dbName, '1.0', dbName, _MAX_SIZE_);
            that.initDBWeb();
        }
    }(this);
}
/**
 * Execute sql
 */
DBAdapter.prototype.query = function(sql) {
    var d = $.Deferred();
    try {
        this.db.transaction(function(tx) {
            tx.executeSql(sql, [], function(tx, results) {
                d.resolve(results);
            }, function(error) {
                alert(error);
                d.resolve(false);
            });
        }, function(error) {
            alert(error);

            d.resolve(false);
        });
    } catch (error) {
        alert(error);
        d.resolve(false);
    }
    return d.promise();
}
/**
* Get next word and previous word
*/
DBAdapter.prototype.getNextWord = function(currentId){
    var sql = "SELECT id, title, content, speech FROM words WHERE id >= '" + currentId + "' LIMIT 2";
    var result = this.query(sql);
    return result;
}
/**
 *  Search words
 */
DBAdapter.prototype.search = function(keyword, currentPage, numItemsPerPage) {
    if(typeof currentPage === 'undefined' || parseInt(currentPage) < 1){
        currentPage = 1;
    }
    if(typeof numItemsPerPage === 'undefined' || parseInt(numItemsPerPage) <= 0){
        numItemsPerPage = MAX_NUMBER_WORDS_SEARCH;
    }
    var offset = (currentPage - 1) * numItemsPerPage;
    var sql = "SELECT id, title, content, speech FROM words WHERE title like '" + keyword + "%' ORDER by title ASC LIMIT " + offset +  ", " + numItemsPerPage;
    console.log("EXECUTE: " + sql);
    var result = this.query(sql);
    return result;
};
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
/**
 * Init database for personal data
 */
DBAdapter.prototype.initPersonalDictDB = function(){
    console.log('Init personal database!');
    // open personal db
    var personalDB =  window.openDatabase(db_config[_DICT_TYPE_PERSONAL_], '1.0', db_config[_DICT_TYPE_PERSONAL_], _MAX_SIZE_);
   
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