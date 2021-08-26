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

	private String url;

	@Lob
	private String photoReference;

	@Lob
	private String photoUrl;

	@Builder
	public Eatery(String id, int click, String url, String photoReference, String photoUrl) {
		this.id = id;
		this.click = click;
		this.url = url;
		this.photoReference = photoReference;
		this.photoUrl = photoUrl;
	}

}
