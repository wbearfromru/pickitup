package be.pickitup.service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import javax.persistence.EntityManager;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;

import be.pickitup.entity.Game;
import be.pickitup.entity.Player;

@Name("GamesService")
@Path("/games")
public class GamesListService {

	@In
	private EntityManager entityManager;

	@In
	private Player player;

	@GET
	@Path("/list")
	@Produces({ "text/plain" })
	public String getGames(@QueryParam("fromX") Double fromX, @QueryParam("toX") Double toX, @QueryParam("fromY") Double fromY, @QueryParam("toY") Double toY, @QueryParam("ts") Integer timeSpan) {
		List<Game> gamesList = entityManager.createQuery("select g from Game g inner join g.location l where l.lng between :fromX and :toX and l.lat between :fromY and :toY and g.startDate between :startDate and :endDate", Game.class)
				.setParameter("fromX", fromX)
				.setParameter("toX", toX)
				.setParameter("fromY", fromY)
				.setParameter("toY", toY)
				.setParameter("startDate", getStartDate(timeSpan))
				.setParameter("endDate", getEndDate(timeSpan))
				.getResultList();
		String result = "";
		boolean first = true;
		for (Game game : gamesList) {
			if (!first)
				result += ",";
			result += "{\"name\":\"" + game.getName() +
					"\",\"description\":\"" + game.getDescription() +
					"\",\"date\":\"" + formatGameDate(game.getStartDate()) +
					"\",\"creator\":{" +
					"\"name\":\"" + game.getCreator().getScreenName() +
					"\"}" +
					",\"lat\":\"" + game.getLocation().getLat().toString() +
					"\",\"lng\":\"" + game.getLocation().getLng().toString() +
					"\",\"uniqueId\":\"" + game.getId().toString() +
					"\",\"alreadyJoined\":" + game.getPlayers().contains(player) +
					"}";
			if (first) {
				first = false;
			}
		}
		return "[" + result + "]";
	}

	private Date getStartDate(Integer type) {
		switch (type) {
		case 2:
			// Begin of tomorrow
			Calendar cal = Calendar.getInstance();
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			return cal.getTime();
		default:
			return new Date();
		}
	}

	private Date getEndDate(Integer type) {
		Calendar cal = Calendar.getInstance();
		switch (type) {
		case 0:
			// Next 2 hours
			cal.add(Calendar.HOUR_OF_DAY, 2);
			return cal.getTime();
		case 1:
			// end of today
			cal.add(Calendar.DAY_OF_MONTH, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			return cal.getTime();
		case 2:
			// end of tomorrow
			cal.add(Calendar.DAY_OF_MONTH, 2);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			return cal.getTime();
		case 3:
			// Begin of next day
			cal.add(Calendar.WEEK_OF_YEAR, 1);
			cal.set(Calendar.HOUR_OF_DAY, 0);
			cal.set(Calendar.MINUTE, 0);
			cal.set(Calendar.SECOND, 0);
			return cal.getTime();
		default:
			return new Date();
		}
	}

	private String formatGameDate(Date date) {
		SimpleDateFormat format = new SimpleDateFormat("EEEE d @ HH:mm", Locale.US);
		return format.format(date);
	}
}
