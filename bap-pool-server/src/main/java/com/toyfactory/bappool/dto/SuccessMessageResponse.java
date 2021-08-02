package com.toyfactory.bappool.dto;

import lombok.Getter;

@Getter
public class SuccessMessageResponse {
	private String message;

	public SuccessMessageResponse(String message) {
		this.message = message;
	}
}
