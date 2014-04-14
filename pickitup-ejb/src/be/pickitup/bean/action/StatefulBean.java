package be.pickitup.bean.action;

import javax.annotation.security.PermitAll;
import javax.ejb.Remove;

import org.jboss.beans.metadata.api.annotations.Create;
import org.jboss.seam.annotations.Destroy;

public class StatefulBean {

	public StatefulBean() {
		super();
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