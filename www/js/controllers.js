angular.module('starter.controllers', ["ngTouch", "angucomplete-alt", 'ionic'])
        .controller('AppCtrl', function($scope) {
            console.log('AppCtrl');
        })
        .controller('DictHomeCtrl', ['$ionicScrollDelegate', function($scope, $ionicScrollDelegate) {
            console.log('DictHomeCtrl');
            $scope.loadSearchResult = function() {
                console.log("load more!");
                $scope.$broadcast('scroll.infiniteScrollComplete');
            };
        }])

        .controller('PlaylistsCtrl', function($scope) {
        })

        .controller('PlaylistCtrl', function($scope, $stateParams) {
        })
