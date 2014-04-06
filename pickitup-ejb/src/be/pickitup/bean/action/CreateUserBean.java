package be.pickitup.bean.action;

import javax.annotation.security.PermitAll;
import javax.ejb.Remove;
import javax.ejb.Stateful;
import javax.persistence.EntityManager;

import org.jboss.beans.metadata.api.annotations.Create;
import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.Destroy;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Scope;

import be.pickitup.entity.Player;

@Stateful
@Scope(ScopeType.SESSION)
@Name("CreateUser")
public class CreateUserBean implements CreateUser {

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

	@Remove
	@Destroy
	@PermitAll
	public void destroy() {
		System.out.println("Destroy " + this.toString());
	}

	@Create
	public void create() {
		System.out.println("Create " + this.toString());
	}

}
