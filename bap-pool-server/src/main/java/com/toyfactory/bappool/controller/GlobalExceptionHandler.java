package com.toyfactory.bappool.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.toyfactory.bappool.dto.ErrorResponse;
import com.toyfactory.bappool.exception.GoogleApiLimitException;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(GoogleApiLimitException.class)
	protected ResponseEntity<ErrorResponse> handleGoogleApiLimitException() {
		log.error("[Exceeded daily request quota for Google API]");
		ErrorResponse response = new ErrorResponse("구글 API 하루 할당량 초과");
		return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
	}
}
