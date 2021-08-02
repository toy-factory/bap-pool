package com.toyfactory.bappool.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class GooglePlaceDetailResponse {
	private List<?> html_attributions;
	private GooglePlaceDetailResultResponse result;
	private String status;
}
