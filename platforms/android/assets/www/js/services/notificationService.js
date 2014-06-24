/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
starterControllers.factory('NotificationService',function(LocalDataService, $location){
    function register(){
        if(typeof window.plugin != 'undefined' 
            && typeof window.plugin.notification.local != 'undefined'){
            var notifiPlugin = window.plugin.notification.local;
            notifiPlugin.cancelAll();
            registerFavWord();
            notifiPlugin.onclick = function(id, state, json){
                notifiPlugin.cancel(id);
                registerFavWord();
                $location.path('/#/app/wordDetail/' + id);
            }
        }
    }
    function registerFavWord(){
        LocalDataService.getRandomFavWord().done(function(result){
            var id  = result.id,
            title   = result.title,
            message = result.content,
            json    = {};
            add(id, title, message, json);
        });
    }
    function add(id, title, message, json){
        if(typeof window.plugin.notification.local != 'undefined'){
            var time = new Date();
            time.setDate(date.getDay() + 1);
            time.setHours(_HOUR_NOTIFICATION_,0,0,0);
            window.plugin.notification.local.add({
                id:      id,
                title:   title,
                message: message,
                repeat:  _REPEAT_NOTIFICATION_,
                date:    time,
                autoCancel: true
            });
        }
    }
    return {
        register: register
    }
});

