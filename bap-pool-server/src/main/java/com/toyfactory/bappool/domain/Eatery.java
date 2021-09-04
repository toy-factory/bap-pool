package com.toyfactory.bappool.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class Eatery {
	@Id
	private String id;

	@NotNull
	private int click;

	@NotNull
	private String name;

	@NotNull
	private double lat;

	@NotNull
	private double lng;

	private String category;

	private String url;

	@Lob
	private String photoReference;

	@Lob
	private String photoUrl;

	@Builder
	public Eatery(String id, int click, String name, double lat, double lng, String category, String url,
		String photoReference, String photoUrl) {
		this.id = id;
		this.click = click;
		this.name = name;
		this.lat = lat;
		this.lng = lng;
		this.category = category;
		this.url = url;
		this.photoReference = photoReference;
		this.photoUrl = photoUrl;
	}

}
