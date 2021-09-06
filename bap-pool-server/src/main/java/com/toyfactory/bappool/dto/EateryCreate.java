package com.toyfactory.bappool.dto;

import javax.validation.constraints.NotNull;

import com.toyfactory.bappool.domain.Eatery;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class EateryCreate {
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

	private String photoReference;

	public Eatery toEntity() {
		return Eatery.builder()
			.id(id)
			.click(click)
			.name(name)
			.lat(lat)
			.lng(lng)
			.photoReference(photoReference)
			.build();
	}
}
