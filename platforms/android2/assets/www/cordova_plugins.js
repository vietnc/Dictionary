cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.sqlite/www/SQLitePlugin.js",
        "id": "com.phonegap.plugins.sqlite.SQLitePlugin",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "file": "plugins/com.google.cordova.plugin.AdMobPlugin/www/AdMobPlugin.js",
        "id": "com.google.cordova.plugin.AdMobPlugin.AdMob",
        "clobbers": [
            "window.admob"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.sqlite": "1.0.0",
    "com.google.cordova.plugin.AdMobPlugin": "0.0.2"
}
// BOTTOM OF METADATA
});