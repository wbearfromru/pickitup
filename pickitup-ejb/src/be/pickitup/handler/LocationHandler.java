package be.pickitup.handler;

import java.util.List;

import javax.persistence.EntityManager;

import org.jboss.seam.annotations.In;
import org.jboss.seam.annotations.Name;

import be.pickitup.entity.Location;

@Name("LocationHandler")
public class LocationHandler {

	@In
	private EntityManager entityManager;

	public List<Location> getLocations() {
		return entityManager.createQuery("select l from Location l", Location.class).getResultList();
	}

}
