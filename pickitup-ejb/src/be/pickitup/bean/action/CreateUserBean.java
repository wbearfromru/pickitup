package be.pickitup.bean.action;

import javax.ejb.Stateful;
import javax.persistence.EntityManager;

import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;

import be.pickitup.entity.Player;

@Stateful
@Scope(ScopeType.SESSION)
@Name("CreateUser")
public class CreateUserBean extends StatefulBean implements CreateUser {

	private Player player;

	@In
	private EntityManager entityManager;

	public String saveUser() {
		entityManager.merge(getPlayer());
		this.player = null;
		return "/index.xhtml";
	}

	public Player getPlayer() {
		if (player == null)
			player = new Player();
		return player;
	}

}
