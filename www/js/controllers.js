var starterControllers = angular.module('starter.controllers', ['ionic']);
starterControllers
    .controller('AppCtrl', function($scope) {
        })
    .controller('PlaylistsCtrl', function($scope) {
        })

    .controller('PlaylistCtrl', function($scope, $stateParams) {
        })

ionic.Platform.ready(function() {
        try {
            var _adMob = admob;
            var _dummySuccessCallback = function() {
                //alert('_dummySuccessCallback');
                _adMob.showAd(true);
            };
            var _dummyErrorCallback = function() {
                alert('_dummyErrorCallback');
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
                alert('[!!!!!] Unable To Create Ad Banner');
            }
            );
        }
        catch(e){
            alert('Missing Admob Plugin (Cordova):', e);
        }
    });