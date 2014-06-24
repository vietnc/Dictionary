/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var Notification = function(){
    this.plugin = null;
    // constructor
    var construct = function(that) {
        if(typeof window.plugin.notification.local != 'undefined'){
            that.plugin = window.plugin.notification.local;
        }
    }(this);
};
Notification.prototype.add = function(id, title, message, json){
    var now                  = new Date().getTime(),
    _60_seconds_from_now = new Date(now + 60*1000);
    this.plugin.add({
        id:      id,
        title:   title,
        message: message,
        json: json,
        repeat:  10,
        date:    _60_seconds_from_now
    });
}
Notification.prototype.register = function(){
    if(this.plugin != null){
        this.add(id, title, message);
    }
}