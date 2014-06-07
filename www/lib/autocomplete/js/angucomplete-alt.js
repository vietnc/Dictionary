/*
 * angucomplete-extra
 * Autocomplete directive for AngularJS
 * This is a fork of Daryl Rowland's angucomplete with some extra features.
 * By Hidenari Nozaki
 *
 * Copyright (c) 2014 Hidenari Nozaki and contributors
 * Licensed under the MIT license
 */

'use strict';
var angucompleteAlt = angular.module('angucomplete-alt', []);

angucompleteAlt.directive('angucompleteAlt', ['$parse', '$http', '$sce', '$timeout', '$ionicScrollDelegate', function($parse, $http, $sce, $timeout, $ionicScrollDelegate) {
    var KEY_DW = 40,
    KEY_UP = 38,
    KEY_ES = 27,
    KEY_EN = 13,
    KEY_BS = 8,
    MIN_LENGTH = 3,
    PAUSE = 500;

    return {
        restrict: 'EA',
        scope: {
            selectedObject: '=',
            results : "=",
            localData: '=',
            remoteUrlRequestFormatter: '=',
            id: '@',
            placeholder: '@',
            remoteUrl: '@',
            remoteUrlDataField: '@',
            titleField: '@',
            descriptionField: '@',
            imageField: '@',
            inputClass: '@',
            pause: '@',
            searchFields: '@',
            minlength: '@',
            matchClass: '@',
            clearSelected: '@',
            overrideSuggestions: '@'
        },
        templateUrl: 'lib/autocomplete/angucomplete.html',
        link: function(scope, elem, attrs) {
             
            var minlength = MIN_LENGTH,
            searchTimer = null,
            lastSearchTerm = null,
            hideTimer;
            // For lazy loading searching
            scope.numberSearchItem = 15;
            scope.currentPage = 1;
            scope.hasMoreResult = true;
            scope.isLoadMore = false;
            //---------------------------
            scope.currentIndex = null;
            scope.searching = false;
            scope.searchStr = null;
            scope.autofocus = null;
            scope.isMouseMove = false;
            var isNewSearchNeeded = function(newTerm, oldTerm) {
                return newTerm.length >= minlength && newTerm !== oldTerm;
            };

            var extractValue = function(obj, key) {
                var keys, result;
                if (key) {
                    keys = key.split('.');
                    result = obj;
                    keys.forEach(function(k) {
                        result = result[k];
                    });
                }
                else {
                    result = obj;
                }
                return result;
            };

            if (scope.minlength && scope.minlength !== '') {
                minlength = scope.minlength;
            }

            if (!scope.pause) {
                scope.pause = PAUSE;
            }

            if (!scope.clearSelected) {
                scope.clearSelected = false;
            }

            if (!scope.overrideSuggestions) {
                scope.overrideSuggestions = false;
            }
            scope.loadSearchResult = function() {
                $timeout(function() {
                    scope.isLoadMore = true;
                    scope.currentPage++;
                    scope.searchTimerComplete(scope.searchStr);
                }, 500);
                scope.$broadcast('scroll.infiniteScrollComplete');
               
            };
           
            /**
                 * Hide result dropdown
                 * @returns {undefined}
                 */
            scope.hideResults = function() {
                hideTimer = $timeout(function() {
                    scope.showDropdown = false;
                }, scope.pause);
            };

            scope.resetHideResults = function() {
                if (hideTimer) {
                    $timeout.cancel(hideTimer);
                }
            };

            scope.processResults = function(responseData, str) {
               scope.results = responseData;
                //DAT LQ
                scope.$apply();
            };

            scope.searchTimerComplete = function(str) {
                // Begin the search
                var searchFields, matches, i, match, s, params;
                if(scope.isLoadMore === false){
                    scope.currentPage = 1;
                }
                scope.localData = [];
                scope.selectedObject = null;
                if (str.length >= minlength) {
                    // search 
                    var db = new DBAdapter();
                    var data = db.search(str, scope.currentPage, scope.numberSearchItem).done(function(result) {
                        scope.searching = false;
                        if (result.rows.length < scope.numberSearchItem) {
                            scope.hasMoreResult = false;
                        } else {
                            scope.hasMoreResult = true;
                        }
                                                console.log(0);

                        var res = [];
                        for (var i = 0; i < result.rows.length; i++) {
                            var row = result.rows.item(i);
                            scope.localData.push(row);
                        }
                        searchFields = scope.searchFields.split(',');

                        matches = [];

                        for (i = 0; i < scope.localData.length; i++) {
                            match = false;

                            for (s = 0; s < searchFields.length; s++) {
                                match = match || (scope.localData[i][searchFields[s]].toLowerCase().indexOf(str.toLowerCase()) >= 0);
                            }

                            if (match) {
                                matches[matches.length] = scope.localData[i];
                            }
                        }
                        scope.searching = false;
                        scope.processResults(matches, str);
                    });
                    if (scope.localData) {

                    } else if (scope.remoteUrlRequestFormatter) {
                        params = scope.remoteUrlRequestFormatter(str);
                        $http.get(scope.remoteUrl, {
                            params: params
                        }).
                        success(function(responseData, status, headers, config) {
                            scope.searching = false;
                            scope.processResults(extractValue(responseData, scope.remoteUrlDataField), str);
                        }).
                        error(function(data, status, headers, config) {
                            });

                    } else {
                        $http.get(scope.remoteUrl + str, {}).
                        success(function(responseData, status, headers, config) {
                            scope.searching = false;
                            scope.processResults(extractValue(responseData, scope.remoteUrlDataField), str);
                        }).
                        error(function(data, status, headers, config) {
                            });
                    }
                }

            };

            scope.hoverRow = function(index) {
                scope.currentIndex = index;
            };

            scope.keyPressed = function(event) {
                if (!(event.which === KEY_UP || event.which === KEY_DW || event.which === KEY_EN)) {
                    if (!scope.searchStr || scope.searchStr === '') {
                      
                    } else if (isNewSearchNeeded(scope.searchStr, lastSearchTerm)) {
                        lastSearchTerm = scope.searchStr;
                        scope.showDropdown = true;
                        scope.currentIndex = -1;
                        scope.results = [];
                        scope.isLoadMore = false;

                        if (searchTimer) {
                            $timeout.cancel(searchTimer);
                        }

                        scope.searching = true;

                        searchTimer = $timeout(function() {
                            scope.searchTimerComplete(scope.searchStr);
                        }, scope.pause);
                    }
                } else {
                    event.preventDefault();
                }
            };
            elem.on('keyup', scope.keyPressed);

        }
    };
}]);
