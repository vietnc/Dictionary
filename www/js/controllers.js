angular.module('starter.controllers', ["ngTouch", "angucomplete-alt", 'ionic'])
        .controller('AppCtrl', function($scope) {
        })
        .controller('DictHomeCtrl', ['$ionicScrollDelegate', function($scope, $ionicScrollDelegate) {
        }])
        .controller('PlaylistsCtrl', function($scope) {
        })

        .controller('PlaylistCtrl', function($scope, $stateParams) {
        })
