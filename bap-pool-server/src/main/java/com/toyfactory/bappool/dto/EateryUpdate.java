package com.toyfactory.bappool.dto;

import javax.validation.constraints.NotNull;

import com.toyfactory.bappool.domain.Eatery;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class EateryUpdate {
	@NotNull
	private String id;

	@NotNull
	private int click;

	private String photoReference;

	private String url;

	public EateryUpdate(Eatery eatery, String url) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.photoReference = eatery.getPhotoReference();
		this.url = url;
	}

	public EateryUpdate(Eatery eatery) {
		this.id = eatery.getId();
		this.click = eatery.getClick() + 1;
		this.url = eatery.getUrl();
	}

	public Eatery toEntity(String id) {
		return Eatery.builder()
			.id(id)
			.click(click)
			.photoReference(photoReference)
			.url(url)
			.build();
	}
}
