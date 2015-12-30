// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
       
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
            //------------------------------------------------------------------
            /**
             * Init data
             */
            var DB = new DBAdapter(_DICT_TYPE_AV_);
            if (!navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/)
                || typeof cordova == 'undefined') {
                DB.initDBWeb();
            }
           
            /**
             * Admob
             */
            //------------------------------------------------------------------
            if(ionic.Platform.isAndroid() && typeof window.plugins.AdMob != 'undefined' && window.plugins.AdMob != null){
                try {
                    var _adMob = window.plugins.AdMob;
                    // more callback to handle Ad events
                    document.addEventListener('onReceiveAd', function(){
                        _adMob.showAd(false);
                    });
                    document.addEventListener('onFailedToReceiveAd', function(data){
                        _adMob.showAd(false);
                    });
       
                    var _dummySuccessCallback = function() {
                        _adMob.showAd(false);
                    //alert('_dummySuccessCallback');
                    };
                    var _dummyErrorCallback = function() {
                        alert('_dummyErrorCallback');
                    //_adMob.showAd(false);
                    };
                    _adMob.createBannerView(
                    {
                        'publisherId': AD_UNIT_ID, 
                        'adSize': _adMob.AD_SIZE.BANNER, 
                        'bannerAtTop': false
                    }
                    , function() {
                        //alert('Ad Banner Created');
                        _adMob.requestAd({
                            'isTesting': true
                        }, _dummySuccessCallback, _dummyErrorCallback);
                    }
                    , function() {
                        console.debug('[!!!!!] Unable To Create Ad Banner');
                    }
                    );
                }
                catch(e){
                    console.debug('Missing Admob Plugin (Cordova):', e);
                }
            }
           
        });
    })
