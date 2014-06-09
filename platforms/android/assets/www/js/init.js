/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var db = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var DB = new DBAdapter();
        db.receivedEvent('deviceready');
    //DB_Reader.getAllWords();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        db.addBanner();
        var parentElement = document.getElementById("ads_block");
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    }, 
    addBanner: function() {
        var successCreateBannerView = function() { 
            admob.requestAd({
                'isTesting': true
               
            },success,error);
        };
        var success = function() {

        };
        var error = function(message) {
        };
        
        var options = {
            'publisherId': AD_UNIT_ID,
            'adSize': admob.AD_SIZE.BANNER
        }
        admob.createBannerView(options,successCreateBannerView,error);
    },
    
    addInterstitial: function() {
        var successCreateBannerView = function() {
            admob.requestAd({
                'isTesting': true
            },success,error);
        };
        var success = function() {
            alert("success");
        };
        var error = function(message) {
                        alert("eror");

        };
        
        var options = {
            'publisherId': AD_UNIT_ID
        }
        admob.createInterstitialView(options,successCreateBannerView,error);
    },
    
    killAd: function() {
        var success = function() {
        };
        var error = function(message) {
        };
        admob.killAd(success,error);
    }
};
