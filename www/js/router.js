
angular.module('starter', ['ionic', 'starter.controllers'])

    .config(function($stateProvider, $urlRouterProvider) {

                // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise("/app/home");
        $stateProvider
        .state('app', {
            url: "/app",
            abstract: true,
            templateUrl: "templates/menu.html",
            controller: 'AppCtrl'
        })
        .state('tab',{
            url: "/tab",
            abstract: true,
            templateUrl: "templates/tabs.html"
        })
        .state('tab.home', {
              url: "/home",
              views: {
                'home-tab': {
                    templateUrl: "templates/home.html",
                    controller: "DictHomeCtrl"
                }
              }
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
        .state('app.learningword.addword', {
            url: "learningword/addword",
          
                templateUrl: "templates/addword.html",
                controller: "LearningWordCtrl"
     
        })
        .state('app.learnstat', {
            url: "/learnstat",
            views: {
                
                    templateUrl: "templates/addword.html",
                    controller: "LearningWordCtrl"
              
            }
        })
        .state('learnflashcard', {
            url: "/learnflashcard",
            views: {
                'menuContent' :{
                    templateUrl: "templates/addword.html",
                    controller: "LearningWordCtrl"
                }
            }
        })
        /*community */
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

    });