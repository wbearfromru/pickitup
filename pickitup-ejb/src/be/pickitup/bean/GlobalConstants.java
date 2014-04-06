package be.pickitup.bean;

import org.jboss.seam.annotations.Name;

@Name("GlobalConstants")
public class GlobalConstants {

	private static final String GOOGLEMAPSAPIKEY = "AIzaSyCguaBqXor1eNT7a-S-cJH_PqN5tnaCtfw";
	private static final String GOOGLEMAPSURLNOKEY = "https://maps.googleapis.com/maps/api/js?key=%s&sensor=false";
	private static final String GOOGLEMAPSURLWKEY = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCguaBqXor1eNT7a-S-cJH_PqN5tnaCtfw&sensor=false";

	public String getPrefix() {
		return "pickitup-war";
	}

	public String getGoogleMapsKey() {
		return GOOGLEMAPSURLWKEY;
	}

}
