package com.toyfactory.bappool.dto;

import lombok.Getter;

import java.util.List;

@Getter
public class GooglePlaceSearchResponse {
	private List<?> html_attributions;
	private String next_page_token;
	private List<GooglePlaceSearchResultResponse> results;
	private String status;
}
