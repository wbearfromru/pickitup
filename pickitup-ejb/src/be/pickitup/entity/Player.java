package be.pickitup.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.Lob;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import org.hibernate.annotations.ForeignKey;

import be.pickitup.enums.Sex;

@Entity
@Table(name = "player")
public class Player extends EntityBase {
	private String firstname;
	private String lastname;
	private Sex sex;
	private Date dateOfBirth;
	private String email;
	private String passwordHash;
	private String about;
	private List<Player> friends;

	@Column(nullable = false)
	public String getFirstname() {
		return firstname;
	}

	public void setFirstname(String firstname) {
		this.firstname = firstname;
	}

	public String getLastname() {
		return lastname;
	}

	public void setLastname(String lastname) {
		this.lastname = lastname;
	}

	public Sex getSex() {
		return sex;
	}

	public void setSex(Sex sex) {
		this.sex = sex;
	}

	public Date getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(Date dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	@Column(nullable = false)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public void setPasswordHash(String passwordHash) {
		this.passwordHash = passwordHash;
	}

	@Lob
	public String getAbout() {
		return about;
	}

	public void setAbout(String about) {
		this.about = about;
	}

	@ManyToMany
	@JoinTable(name = "player_friends", joinColumns = { @JoinColumn(name = "player_id") }, inverseJoinColumns = { @JoinColumn(name = "friend_id") })
	@ForeignKey(name = "FK_GP_Player", inverseName = "FK_GP_Friend")
	public List<Player> getFriends() {
		return friends;
	}

	public void setFriends(List<Player> friends) {
		this.friends = friends;
	}

}
