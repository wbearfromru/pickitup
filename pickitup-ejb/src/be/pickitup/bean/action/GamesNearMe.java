package be.pickitup.bean.action;

import java.util.Date;
import java.util.List;

import javax.ejb.Local;

import be.pickitup.entity.Game;

@Local
public interface GamesNearMe {
	public String getLocations();

	public List<Game> getCurrentGames();

	public String getGames(Double fromX, Double toX, Double fromY, Double toY);

	public String joinGame(Long id);

	public String leaveGame(Long id);

	public String formatGameDate(Date date);

	public Character getGlyph(Integer index);
}
