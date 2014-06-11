/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var initialLocation;
var browserSupportFlag =  new Boolean();
var marker = null;
var map = null;
var markers = [];
var timeSpan = 0;


function codeAddress(map, marker) {
    var geocoder = new google.maps.Geocoder();
    var address = $("#locateLocation").val();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            setTrackerLocation(results[0].geometry.location);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}






