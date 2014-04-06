package be.pickitup.bean.action;

import java.text.DateFormat;
import java.util.Date;

import org.jboss.seam.annotations.Name;

@Name("MyProfile")
public class MyProfile {

	public String formatBirthDate(Date dateOfBirth) {
		return DateFormat.getDateInstance(DateFormat.LONG).format(dateOfBirth);
	}
}
