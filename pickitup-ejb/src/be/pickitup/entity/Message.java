package be.pickitup.entity;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.ForeignKey;

/**
 * @author sergey.dobrynin
 * 
 */
@Entity
@Table(name = "message")
public class Message extends EntityBase {
	private Player player;
	private Location location;
	private String mesageText;

	@ManyToOne
	@JoinColumn(name = "player_id", nullable = false)
	@ForeignKey(name = "FK_M_Player")
	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	@ManyToOne
	@JoinColumn(name = "location_id", nullable = false)
	@ForeignKey(name = "FK_M_Location")
	public Location getLocation() {
		return location;
	}

	public void setLocation(Location location) {
		this.location = location;
	}

	public String getMesageText() {
		return mesageText;
	}

	public void setMesageText(String mesageText) {
		this.mesageText = mesageText;
	}

}
