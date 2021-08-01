package com.toyfactory.bappool.dto;

import com.toyfactory.bappool.domain.Eatery;

import lombok.Getter;

@Getter
public class EateryDetailResponse {
	private String id;
	private int click;
	private String url;
	private String thumbnail;

	public EateryDetailResponse(Eatery eatery) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.url = eatery.getUrl();
		this.thumbnail = eatery.getThumbnail();
	}
}
