/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
     * app controller
     */
var starterControllers = angular.module('starter.controllers', ['ionic']);
/**
 * appCtrl use for menu.html
 */
starterControllers.controller('AppCtrl', function($scope, $ionicPlatform,$location) {
    $scope.isItemActive = function(href) {
        return $location.path().indexOf(href) > -1;
    };

    $scope.tab1 ={url:"app/learningword/addword", name : "Add word", icon: "ion-ios-plus-outline"};
    $scope.tab2 ={url:"app/learnstat", name : "Stat", icon: "ion-ios-analytics-outline"};
    $scope.tab3 ={url:"app/learnflashcard", name : "flash Card", icon: "ion-ios-browsers-outline"};
});
