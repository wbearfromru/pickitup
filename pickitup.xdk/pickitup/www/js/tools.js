/**
 * 
 */

var Tools = {
	initializeMap: function(mapContainer){
		var defaultMapOptions = {
				zoom : 13,
				mapTypeId : google.maps.MapTypeId.ROADMAP
			};
		return new google.maps.Map(document.getElementById(mapContainer), defaultMapOptions);
	}
}