package be.pickitup.bean.action;

import javax.ejb.Local;

import be.pickitup.entity.Game;

@Local
public interface CreateGame {

	public String saveGame();

	public Game getGame();

	public Double getLocationLat();

	public void setLocationLat(Double locationLat);

	public Double getLocationLng();

	public void setLocationLng(Double locationLng);

	void destroy();

	void create();

}
