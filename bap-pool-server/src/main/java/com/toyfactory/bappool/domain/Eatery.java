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
	private String category;

	@NotNull
	private int click;

	private String url;

	@Lob
	private String photoReference;

	@Lob
	private String photoUrl;

	@Builder
	public Eatery(String id, String category, int click, String url, String photoReference, String photoUrl) {
		this.id = id;
		this.category = category;
		this.click = click;
		this.url = url;
		this.photoReference = photoReference;
		this.photoUrl = photoUrl;
	}

}
