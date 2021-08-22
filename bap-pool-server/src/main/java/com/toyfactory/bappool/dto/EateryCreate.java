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

	private String photoReference;

	public Eatery toEntity() {
		return Eatery.builder()
			.id(id)
			.click(click)
			.photoReference(photoReference)
			.build();
	}
}
