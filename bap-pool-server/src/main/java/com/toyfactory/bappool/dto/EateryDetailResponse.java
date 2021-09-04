package com.toyfactory.bappool.dto;

import com.toyfactory.bappool.domain.Eatery;

import lombok.Getter;

@Getter
public class EateryDetailResponse {
	private String id;
	private int click;
	private String category;
	private String url;
	private String thumbnailUrl;

	public EateryDetailResponse(Eatery eatery) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.category = eatery.getCategory();
		this.url = eatery.getUrl();
		this.thumbnailUrl = eatery.getPhotoUrl();
	}
}
