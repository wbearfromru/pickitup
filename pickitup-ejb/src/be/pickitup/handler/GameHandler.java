package be.pickitup.handler;

import java.util.List;

import javax.persistence.EntityManager;

import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;

import be.pickitup.entity.Game;
import be.pickitup.entity.Player;

@Name("GameHandler")
public class GameHandler {

	@In
	private EntityManager entityManager;

	public List<Game> getGames() {
		return entityManager.createQuery("select g from Game g", Game.class).getResultList();
	}

	public List<Game> getGames(Player player) {
		return entityManager.createQuery("select g from Game g where g.creator = :creator", Game.class).setParameter("creator", player).getResultList();
	}
}
