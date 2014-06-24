/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
starterControllers.factory('NotificationService',function(LocalDataService, $location){
    function register(){
        if(typeof window.plugin != 'undefined' 
            && typeof window.plugin.notification.local != 'undefined'){
            window.plugin.notification.local.cancelAll();
            registerFavWord();
            window.plugin.notification.local.onclick = function(id, state, json){
                window.plugin.notification.local.cancel(id);
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
            var now                  = new Date().getTime(),
            _60_seconds_from_now = new Date(now + 60*1000);
            window.plugin.notification.local.add({
                id:      id,
                title:   title,
                message: message,
                repeat:  1,
                date:    _60_seconds_from_now,
                autoCancel: true
            });
        }
    }
    return {
        register: register
    }
});

