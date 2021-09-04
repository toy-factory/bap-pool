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

	@NotNull
	private String name;

	@NotNull
	private double lat;

	@NotNull
	private double lng;

	private String category;

	private String url;

	private String photoReference;

	private String photoUrl;

	public EateryUpdate(Eatery eatery, String category, String url, String photoUrl) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.name = eatery.getName();
		this.lat = eatery.getLat();
		this.lng = eatery.getLng();
		this.photoReference = eatery.getPhotoReference();
		this.category = category;
		this.url = url;
		this.photoUrl = photoUrl;
	}

	public EateryUpdate(Eatery eatery) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.name = eatery.getName();
		this.lat = eatery.getLat();
		this.lng = eatery.getLng();
		this.category = eatery.getCategory();
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
			.name(name)
			.lat(lat)
			.lng(lng)
			.category(category)
			.url(url)
			.photoReference(photoReference)
			.photoUrl(photoUrl)
			.build();
	}

}
