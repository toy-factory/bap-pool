package com.toyfactory.bappool.service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import com.toyfactory.bappool.domain.Eatery;
import com.toyfactory.bappool.domain.EateryRepository;
import com.toyfactory.bappool.dto.EateryCreate;
import com.toyfactory.bappool.dto.EateryDetailResponse;
import com.toyfactory.bappool.dto.EateryResponse;
import com.toyfactory.bappool.dto.EateryUpdate;
import com.toyfactory.bappool.dto.GooglePlaceDetailResponse;
import com.toyfactory.bappool.dto.GooglePlaceDetailResultResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchPhotoResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchResultResponse;
import com.toyfactory.bappool.exception.GoogleApiLimitException;
import com.toyfactory.bappool.util.S3Bucket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class EateryService {

	private final EateryRepository eateryRepository;
	private final S3Bucket s3Bucket;

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
				String imageReference = Optional.ofNullable(place.getPhotos())
					.flatMap(ref -> ref.stream()
						.findFirst()
						.map(GooglePlaceSearchPhotoResponse::getPhoto_reference))
					.orElse(null);

				EateryCreate request = new EateryCreate(id, 0, imageReference);
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

		if (eatery.getUrl() == null || eatery.getPhotoUrl() == null) {
			updateById(id);
		}

		return new EateryDetailResponse(eatery);
	}

	private void updateById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		String url = Optional.ofNullable(eatery.getUrl())
			.orElseGet(() -> Optional.ofNullable(callGooglePlaceDetailApi(id).getUrl()).orElse(null));

		String photoUrl = Optional.ofNullable(eatery.getPhotoUrl())
			.orElseGet(() -> Optional.ofNullable(eatery.getPhotoReference())
				.map(ref -> s3Bucket.upload(callGooglePlacePhotoApi(ref)))
				.orElse(null));

		EateryUpdate newEatery = new EateryUpdate(eatery, url, photoUrl);
		eateryRepository.save(newEatery.toEntity());
	}

	public void updateClickById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		EateryUpdate updateEatery = new EateryUpdate(eatery);
		updateEatery.updateClick();
		Eatery newEatery = updateEatery.toEntity();
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

		if (response.getBody().getStatus().equals("OVER_QUERY_LIMIT")) {
			throw new GoogleApiLimitException();
		}

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

		if (response.getBody().getStatus().equals("OVER_QUERY_LIMIT")) {
			throw new GoogleApiLimitException();
		}

		return response.getBody().getResults();
	}

	private byte[] callGooglePlacePhotoApi(String photoReference) {
		String baseUrl = "https://maps.googleapis.com/maps/api/place/photo";

		UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl)
			.queryParam("maxwidth", 150)
			.queryParam("maxheight", 150)
			.queryParam("photoreference", photoReference)
			.queryParam("key", apiKey)
			.build();

		ResponseEntity<byte[]> response = setRestTemplate().getForEntity(uriComponents.toUriString(),
			byte[].class);

		if (response.getStatusCodeValue() == 403) {
			throw new GoogleApiLimitException();
		}

		return response.getBody();
	}

	private RestTemplate setRestTemplate() {
		HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
		factory.setConnectTimeout(5000); // api 호출 타임아웃
		factory.setReadTimeout(5000);   // api 읽기 타임아웃

		return new RestTemplate(factory);
	}

}
