package be.pickitup.entity;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.hibernate.annotations.ForeignKey;

@Entity
@Table(name = "game")
public class Game extends EntityBase {
	private String name;
	private Date eventTime;
	private Location location;
	private List<Player> players;
	private List<Message> messages;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getEventTime() {
		return eventTime;
	}

	public void setEventTime(Date eventTime) {
		this.eventTime = eventTime;
	}

	@ManyToOne
	@JoinColumn(name = "location_id", nullable = false)
	@ForeignKey(name = "FK_G_Location")
	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	@ManyToMany
	@JoinTable(name = "game_players", joinColumns = { @JoinColumn(name = "game_id") }, inverseJoinColumns = { @JoinColumn(name = "player_id") })
	@ForeignKey(name = "FK_GP_Game", inverseName = "FK_GP_Player")
	public List<Player> getPlayers() {
		return players;
	}

	public void setPlayers(List<Player> players) {
		this.players = players;
	}

	@OneToMany(mappedBy = "location")
	public List<Message> getMessages() {
		return messages;
	}

	public void setMessages(List<Message> messages) {
		this.messages = messages;
	}

}
