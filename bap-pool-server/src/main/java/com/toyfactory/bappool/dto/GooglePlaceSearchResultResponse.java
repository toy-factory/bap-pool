package com.toyfactory.bappool.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class GooglePlaceSearchResultResponse {
	private String place_id;
	private String name;
	private List<GooglePlaceSearchPhotoResponse> photos;
	private List<String> types;
	private GooglePlaceSearchGeometry geometry;
}
