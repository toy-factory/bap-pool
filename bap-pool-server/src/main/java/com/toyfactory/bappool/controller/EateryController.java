package com.toyfactory.bappool.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.toyfactory.bappool.dto.EateryDetailResponse;
import com.toyfactory.bappool.dto.EateryResponse;
import com.toyfactory.bappool.dto.SuccessMessageResponse;
import com.toyfactory.bappool.service.EateryService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@CrossOrigin("*")
@RequiredArgsConstructor
@RequestMapping("/api/eateries")
@RestController
public class EateryController {

	private final EateryService service;

	@GetMapping
	public ResponseEntity<List<EateryResponse>> findAll(@RequestParam double lng, @RequestParam double lat) {
		List<EateryResponse> responses = service.findAll(lng, lat);
		log.info(responses.toString());
		return ResponseEntity.ok(responses);
	}

	@GetMapping("/{id}")
	public ResponseEntity<EateryDetailResponse> findById(@PathVariable String id) {
		EateryDetailResponse response = service.findById(id);
		log.info(response.toString());
		return ResponseEntity.ok(response);
	}

	@PutMapping("/click/{id}")
	public ResponseEntity<SuccessMessageResponse> updateClickById(@PathVariable String id) {
		service.updateClickById(id);

		SuccessMessageResponse response = new SuccessMessageResponse("eatery 클릭횟수 업데이트 성공");
		log.info(response.toString());
		return ResponseEntity.ok(response);
	}

}
