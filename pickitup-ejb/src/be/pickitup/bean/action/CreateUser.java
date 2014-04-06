package be.pickitup.bean.action;

import javax.ejb.Local;

import be.pickitup.entity.Player;

@Local
public interface CreateUser {

	public String saveUser();

	public Player getPlayer();

}
