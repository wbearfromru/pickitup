package be.pickitup.bean;

import org.jboss.seam.annotations.Name;

@Name("GlobalConstants")
public class GlobalConstants {

	public String getPrefix() {
		return "pickitup-war";
	}
}
