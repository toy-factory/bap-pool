package com.toyfactory.bappool.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class GooglePlaceSearchResponse {
	private List<?> html_attributions;
	private String next_page_token;
	private List<GooglePlaceSearchResultResponse> results;
	private String status;
}
