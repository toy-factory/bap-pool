package com.toyfactory.bappool.dto;

import javax.validation.constraints.NotNull;

import com.toyfactory.bappool.domain.Eatery;

import lombok.Getter;

@Getter
public class EateryUpdate {
	@NotNull
	private String id;

	@NotNull
	private int click;

	private String url;

	public EateryUpdate(Eatery eatery, String url, String thumbnail) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.url = url;
	}

	public Eatery toEntity(String id) {
		return Eatery.builder()
			.id(id)
			.click(click)
			.url(url)
			.build();
	}
}
