package com.toyfactory.bappool.controller;

import com.toyfactory.bappool.dto.EateryResponse;
import com.toyfactory.bappool.service.EateryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/eatery")
@RestController
public class EateryController {

    private final EateryService service;

    @GetMapping
    public ResponseEntity<List<EateryResponse>> findFive(@RequestParam double lng, @RequestParam double lat) {
        List<EateryResponse> responses = service.findFive(lng, lat);
        log.info(responses.toString());
        return (ResponseEntity<List<EateryResponse>>) responses;
    }
}
