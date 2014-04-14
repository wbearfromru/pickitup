package be.pickitup.bean.action;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.ejb.Stateful;
import javax.persistence.EntityManager;

import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;

import be.pickitup.entity.Game;
import be.pickitup.entity.Player;
import be.pickitup.handler.GameHandler;

@Name("GamesNearMe")
@Stateful
@Scope(ScopeType.SESSION)
public class GamesNearMeBean extends StatefulBean implements GamesNearMe {

	private static final String glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

	@In("#{GameHandler}")
	private GameHandler gameHandler;

	@In
	private Player player;

	@In
	private EntityManager entityManager;

	private List<Game> currentGames;

	public List<Game> getCurrentGames() {
		return currentGames;
	}

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

	public String getGames(Double fromX, Double toX, Double fromY, Double toY) {
		currentGames = entityManager.createQuery("select g from Game g inner join g.location l where l.lng between :fromX and :toX and l.lat between :fromY and :toY", Game.class)
				.setParameter("fromX", fromX)
				.setParameter("toX", toX)
				.setParameter("fromY", fromY)
				.setParameter("toY", toY)
				.getResultList();
		System.out.println(currentGames.size());
		return null;
	}

	public String joinGame(Long id) {
		Game game = entityManager.find(Game.class, id);
		game.getPlayers().add(player);
		entityManager.merge(game);
		return null;
	}

	public String leaveGame(Long id) {
		Game game = entityManager.find(Game.class, id);
		game.getPlayers().remove(player);
		entityManager.flush();
		return null;
	}

	public String formatGameDate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("EEEE d @ HH:mm", Locale.US);
		return format.format(date);
	}

	public Character getGlyph(Integer index) {
		return glyphs.charAt(index);
	}
}
