package be.pickitup.bean.action;

import javax.annotation.security.PermitAll;
import javax.ejb.Remove;
import javax.ejb.Stateful;
import javax.interceptor.Interceptors;
import javax.persistence.EntityManager;

import org.jboss.beans.metadata.api.annotations.Create;
import org.jboss.seam.annotations.Destroy;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.ejb.SeamInterceptor;

import be.pickitup.entity.Game;
import be.pickitup.entity.Location;
import be.pickitup.entity.Player;

@Stateful
@Name("CreateGame")
@Interceptors(SeamInterceptor.class)
public class CreateGameBean implements CreateGame {

	@In
	private EntityManager entityManager;
	private Double locationLat;
	private Double locationLng;
	private Game game;
	@In
	private Player player;

	public Game getGame() {
		if (this.game == null) {
			this.game = new Game();
		}
		return game;
	}

	public String saveGame() {
		if (this.locationLat == null || this.locationLng == null)
			return null;

		Location location = new Location();
		location.setName("Name");
		location.setDescription("Description");
		location.setLat(locationLat);
		location.setLng(locationLng);
		location = entityManager.merge(location);
		this.game.setCreator(player);
		this.game.setLocation(location);
		entityManager.merge(this.game);

		this.game = null;
		return "/nearme.xhtml";
	}

	public Double getLocationLat() {
		return locationLat;
	}

	public void setLocationLat(Double locationLat) {
		this.locationLat = locationLat;
	}

	public Double getLocationLng() {
		return locationLng;
	}

	public void setLocationLng(Double locationLng) {
		this.locationLng = locationLng;
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
