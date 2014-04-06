package be.pickitup.bean.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;

import be.pickitup.entity.Game;
import be.pickitup.handler.GameHandler;

@Name("GamesNearMe")
public class GamesNearMe {

	private static final String glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	@In("#{GameHandler}")
	private GameHandler gameHandler;

	public String getLocations() {
		String json = "{\"position\":{\"lat\":\"50.8738191\", \"lng\":\"4.7039937\"},\"locations\" :[";
		List<Game> games = gameHandler.getGames();
		boolean first = true;
		for (Game game : games) {
			if (!first) {

				json += ",";
			}
			json += "{\"title\":\"" + game.getName() + "\", \"lat\":\"" + game.getLocation().getLat().toString() + "\", \"lng\":\"" + game.getLocation().getLng().toString() + "\"}";
			first = false;
		}
		json += "]}";
		return json;
	}

	public String formatGameDate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("EEEE d @ HH:mm", Locale.US);
		return format.format(date);
	}

	public Character getGlyph(Integer index) {
		return glyphs.charAt(index);
	}
}
