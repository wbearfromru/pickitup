package be.pickitup.handler;

import java.util.List;

import javax.persistence.EntityManager;

import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;

import be.pickitup.entity.Player;

@Name("PlayerHandler")
@Scope(ScopeType.STATELESS)
public class PlayerHandler {
	@In
	private EntityManager entityManager;

	public List<Player> getPlayers() {

		return entityManager.createQuery("select p from Player p", Player.class).getResultList();

	}
}
