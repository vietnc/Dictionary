angular.module('starter.controllers', ["ngTouch", "angucomplete-alt", 'ionic'])
    .controller('AppCtrl', function($scope) {
        })
    .controller('DictHomeCtrl', function($scope) {
        $scope.wordSelected = false;
        $scope.selectResult = function(result) {
            $scope.wordSelected = true;
            if ($scope.clearSelected) {
                $scope.searchStr = null;
            }
            else {
            }
            $scope.selectedObject = result;
            $scope.results = [];
        };
    })
    .controller('PlaylistsCtrl', function($scope) {
        })

    .controller('PlaylistCtrl', function($scope, $stateParams) {
        })
