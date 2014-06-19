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
            /**
             * Admob
             */
            //------------------------------------------------------------------
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
        });
    })

    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider

        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })

        .state('app.home', {
            url: "/home",
            views: {
                'menuContent' :{
                    templateUrl: "templates/home.html",
                    controller: "DictHomeCtrl"
                }
            }
        })

        .state('app.learningword', {
            url: "/learningword",
            views: {
                'menuContent' :{
                    templateUrl: "templates/learningword.html",
                    controller: "LearningWordCtrl"
                }
            }
        })
        .state('app.community', {
            url: "/community",
            views: {
                'menuContent' :{
                    templateUrl: "templates/community.html"
                }
            }
        })
        .state('app.about', {
            url: "/about",
            views: {
                'menuContent' :{
                    templateUrl: "templates/about.html"
                }
            }
        })
        /**
         * Word detail
         */
        .state('app.wordDetail', {
            url: "/wordDetail/:wordId",
            
            views: {
                'menuContent' :{
                    templateUrl: "templates/wordDetail.html",
                    controller: 'LearningWordCtrl'
                }
            }
        })
        .state('app.playlists', {
            url: "/playlists",
            views: {
                'menuContent' :{
                    templateUrl: "templates/playlists.html",
                    controller: 'PlaylistsCtrl'
                }
            }
        })

        .state('app.single', {
            url: "/playlists/:playlistId",
            views: {
                'menuContent' :{
                    templateUrl: "templates/playlist.html",
                    controller: 'PlaylistCtrl'
                }
            }
        });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/app/home');
    });