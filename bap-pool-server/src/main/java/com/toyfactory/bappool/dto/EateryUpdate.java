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

	private String url;

	private String photoReference;

	private String photoUrl;

	public EateryUpdate(Eatery eatery, String url, String photoUrl) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.photoReference = eatery.getPhotoReference();
		this.url = url;
		this.photoUrl = photoUrl;
	}

	public EateryUpdate(Eatery eatery) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.url = eatery.getUrl();
		this.photoReference = eatery.getPhotoReference();
		this.photoUrl = eatery.getPhotoUrl();
	}

	public void updateClick() {
		this.click++;
	}

	public Eatery toEntity() {
		return Eatery.builder()
			.id(id)
			.click(click)
			.photoUrl(photoUrl)
			.url(url)
			.photoReference(photoReference)
			.photoUrl(photoUrl)
			.build();
	}

}
