var DBAdapter = function(dbType) {
    /**
     * all properties
     */
    this.db = null;
    this.result = null;
    // constructor
    var construct = function(that, dbType) {
        if (dbType == 'undefined' || dbType == '' || dbType == null) {
            dbType = _DICT_AV_;
        }
        if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
                && typeof cordova != 'undefined') {
            // on mobile device and cordova is loaded
            try {
                var self = that;
                that.db = window.sqlitePlugin.openDatabase({
                    name: 'av_dict'
                });
                that.checkDBExist().done(function(result) {
                    if (result == false) {
                        //self.initDBWeb();
                        alert("db not found");
                    }
                });
            } catch (error) {
                alert(error);
            }

        } else {
            // on web browser
            that.db = window.openDatabase(db_config[dbType]['web'], '1.0', db_config[dbType][1], _MAX_SIZE_);
            console.log("application is runing on web browser");
            that.initDBWeb();
        }
    }(this);
}
/**
 * Execute sql
 */
DBAdapter.prototype.query = function(sql) {
                console.log("done query");

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
DBAdapter.prototype.search = function(keyword) {
    var sql = "SELECT id, title, content FROM words WHERE title like '" + keyword + "%' ORDER by title ASC LIMIT 20";
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
    this.checkDBExist().done(function(result) {
        if (result == false || result.rows.length == 0) {
            // table is not exists
            // init database
            self.readSqlFile();
        } else {
            console.log('Data dictionary is existed');
        }
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