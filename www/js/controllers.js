angular.module('starter.controllers', ["ngTouch", "angucomplete-alt", 'ionic'])
    .controller('AppCtrl', function($scope) {
        })
    .controller('DictHomeCtrl', function($scope) {
        $scope.wordSelected = false;
        $scope.selectResult = function(result) {
            $scope.wordSelected = true;
            $scope.selectedObject = result;
            $scope.resultsCollection = [];
            $scope.searchStr = null;
            document.getElementById('search_input').value = '';
        };
    })
    .controller('PlaylistsCtrl', function($scope) {
        })

    .controller('PlaylistCtrl', function($scope, $stateParams) {
        })
