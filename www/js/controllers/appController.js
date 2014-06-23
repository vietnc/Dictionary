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
});
