package com.toyfactory.bappool.dto;

import com.toyfactory.bappool.domain.Eatery;

import lombok.Getter;

@Getter
public class EateryDetailResponse {
	private String id;
	private int click;
	private String url;
	private String thumbnailUrl;

	public EateryDetailResponse(Eatery eatery, String apiKey) {
		this.id = eatery.getId();
		this.click = eatery.getClick();
		this.url = eatery.getUrl();
		this.thumbnailUrl = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=500&photoreference="
						+ eatery.getPhotoReference()
						+ "&key="
						+ apiKey;
	}
}
