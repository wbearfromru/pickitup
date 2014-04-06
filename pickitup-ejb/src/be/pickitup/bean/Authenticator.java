package be.pickitup.bean;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;

import org.jboss.seam.ScopeType;
import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Logger;
import org.jboss.seam.annotations.Name;
import org.jboss.seam.annotations.Out;
import org.jboss.seam.log.Log;
import org.jboss.seam.security.Credentials;
import org.jboss.seam.security.Identity;

import be.pickitup.entity.Player;

@Name("authenticator")
public class Authenticator
{
	@Logger
	private Log log;

	@In
	private Identity identity;
	@In
	private Credentials credentials;
	@In
	private EntityManager entityManager;
	@Out(required = false, scope = ScopeType.SESSION)
	private Player player;

	public boolean authenticate()
	{
		Player player = null;

		try {
			player = entityManager.createQuery("select p from Player p where p.email = :email", Player.class).setParameter("email", credentials.getUsername()).setMaxResults(1).getSingleResult();
		} catch (NonUniqueResultException ex) {
			throw new RuntimeException("Non unique user found in database");
		} catch (NoResultException ex) {
			return false;
		}

		// User with empty password is inactive
		if (player.getPasswordHash() == null || player.getPasswordHash().trim().length() == 0)
			return false;

		if (player.getPasswordHash().equals(credentials.getPassword())) {
			this.player = player;
			identity.addRole("player");
			return true;
		}
		return false;
	}

}
