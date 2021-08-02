package com.toyfactory.bappool.service;

import com.toyfactory.bappool.domain.Eatery;
import com.toyfactory.bappool.domain.EateryRepository;
import com.toyfactory.bappool.dto.*;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedList;
import java.util.List;

import javax.persistence.EntityNotFoundException;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class EateryService {

	private final EateryRepository eateryRepository;

	@Value("${api-key}")
	private String apiKey;

	private String create(EateryCreate request) {
		Eatery eatery = request.toEntity();
		Eatery saved = eateryRepository.save(eatery);

		return saved.getId();
	}

	public List<EateryResponse> findAll(double lng, double lat) {
		List<EateryResponse> openPlace = new LinkedList<>();

		// Google API 호출
		List<GooglePlaceSearchResultResponse> places = callGooglePlaceSearchApi(lng, lat);
		places.forEach(place -> {
			String id = place.getPlace_id();
			if (!eateryRepository.existsById(id)) {
				EateryCreate request = new EateryCreate(id, 0);
				create(request);
			}
			EateryResponse response = new EateryResponse(place, lat, lng);
			if (openPlace.size() < 5) {
				EateryDetailResponse eateryDetail = findById(id);
				response.updateDetail(eateryDetail);
			}
			openPlace.add(response);
		});
		return openPlace;
	}

	public EateryDetailResponse findById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		if (eatery.getUrl() == null) {
			String url = callGooglePlaceDetailApi(id).getUrl();
			// TODO: 썸네일 처리
			EateryUpdate updateEatery = new EateryUpdate(eatery, url, null);
			updateById(id, updateEatery);
		}

		return new EateryDetailResponse(eatery);
	}

	private void updateById(String id, EateryUpdate updateEatery) {
		Eatery newEatery = updateEatery.toEntity(id);
		eateryRepository.save(newEatery);
	}

	public void updateClickById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		EateryUpdate updateEatery = new EateryUpdate(eatery);
		Eatery newEatery = updateEatery.toEntity(id);
		eateryRepository.save(newEatery);
	}

	private GooglePlaceDetailResultResponse callGooglePlaceDetailApi(String id) {
		String baseUrl = "https://maps.googleapis.com/maps/api/place/details/json";

		UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl)
			.queryParam("place_id", id)
			.queryParam("fields", "url")
			.queryParam("key", apiKey)
			.build();

		ResponseEntity<GooglePlaceDetailResponse> response = setRestTemplate().getForEntity(uriComponents.toUriString(),
			GooglePlaceDetailResponse.class);
		log.info("[Google Place Details API Response Code] " + response.getStatusCode());

		return response.getBody().getResult();
	}

	private List<GooglePlaceSearchResultResponse> callGooglePlaceSearchApi(double lng, double lat) {
		String baseUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json";

		UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl)
			.queryParam("language", "ko")
			.queryParam("location", lat + ", " + lng)
			.queryParam("radius", "500")
			.queryParam("type", "restaurant")
			.queryParam("opennow", true)
			.queryParam("key", apiKey)
			.build();

		ResponseEntity<GooglePlaceSearchResponse> response = setRestTemplate().getForEntity(uriComponents.toUriString(),
			GooglePlaceSearchResponse.class);
		log.info("[Google Place Nearby Search API Response Code] " + response.getStatusCode());

		return response.getBody().getResults();
	}

	private RestTemplate setRestTemplate() {
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setConnectTimeout(5000); // api 호출 타임아웃
		factory.setReadTimeout(5000);   // api 읽기 타임아웃

		return new RestTemplate(factory);
	}

}
