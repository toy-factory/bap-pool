package com.toyfactory.bappool.service;

import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import javax.persistence.EntityNotFoundException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.toyfactory.bappool.domain.Eatery;
import com.toyfactory.bappool.domain.EateryRepository;
import com.toyfactory.bappool.dto.EateryCreate;
import com.toyfactory.bappool.dto.EateryDetailResponse;
import com.toyfactory.bappool.dto.EateryResponse;
import com.toyfactory.bappool.dto.EateryUpdate;
import com.toyfactory.bappool.dto.GooglePlaceDetailResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchPhotoResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchResponse;
import com.toyfactory.bappool.dto.GooglePlaceSearchResultResponse;
import com.toyfactory.bappool.dto.KakaoKeywordSearchResponse;
import com.toyfactory.bappool.exception.GoogleApiLimitException;
import com.toyfactory.bappool.util.S3Bucket;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import reactor.core.Disposable;
import reactor.core.publisher.Mono;
import reactor.core.scheduler.Schedulers;
import reactor.util.function.Tuple2;
import reactor.util.function.Tuple3;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class EateryService {

	private final EateryRepository eateryRepository;
	private final S3Bucket s3Bucket;
	private final WebClient webClient;

	@Value("${google-api-key}")
	private String googleApiKey;

	@Value("${kakao-api-key}")
	private String kakaoApiKey;

	private String create(EateryCreate request) {
		Eatery eatery = request.toEntity();
		Eatery saved = eateryRepository.save(eatery);

		return saved.getId();
	}

	public List<EateryResponse> findAll(double lng, double lat) {
		// Google API 호출: 주변 음식점 전체 검색
		List<GooglePlaceSearchResultResponse> places = callGooglePlaceSearchApi(lng, lat);
		List<Eatery> newPlace = new LinkedList<>();

		places.forEach(place -> {
			String id = place.getPlace_id();
			if (!eateryRepository.existsById(id)) {
				double placeLat = place.getGeometry().getLocation().getLat();
				double placeLng = place.getGeometry().getLocation().getLng();
				String placeName = place.getName();
				String imageReference = Optional.ofNullable(place.getPhotos())
					.flatMap(ref -> ref.stream()
						.findFirst()
						.map(GooglePlaceSearchPhotoResponse::getPhoto_reference))
					.orElse(null);

				EateryCreate request = new EateryCreate(id, 0, placeName, placeLat, placeLng, imageReference);
				newPlace.add(request.toEntity());
			}
		});

		// 새로운 음식점 DB 저장
		eateryRepository.saveAll(newPlace);

		// 상위 (최대) 5개 음식점 Response
		List<EateryResponse> openPlace = new LinkedList<>();
		places.subList(0, Math.min(5, places.size())).forEach(place -> {
			EateryResponse response = new EateryResponse(place, lat, lng);

			// 음식점 세부정보 업데이트
			updateById(place.getPlace_id());
			response.updateDetail(findById(place.getPlace_id()));

			openPlace.add(response);
		});
		return openPlace;
	}

	public EateryDetailResponse findById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		return new EateryDetailResponse(eatery);
	}

	private void updateById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		if (eatery.getUrl() != null && eatery.getPhotoUrl() != null && eatery.getCategory() != null) {
			return;
		}

		Mono<KakaoKeywordSearchResponse> categoryMono = callKakaoKeywordSearchApi(eatery.getName(), eatery.getLng(),
			eatery.getLat()).subscribeOn(Schedulers.boundedElastic());

		Mono<GooglePlaceDetailResponse> urlMono = callGooglePlaceDetailApi(id).subscribeOn(Schedulers.boundedElastic());

		if (eatery.getPhotoReference() == null) {
			Tuple2<KakaoKeywordSearchResponse, GooglePlaceDetailResponse> tuple2 = Mono.zip(categoryMono, urlMono)
				.block();

			String category = tuple2.getT1().getMeta().getTotal_count() == 0 ? null :
				tuple2.getT1().getDocuments().get(0).getCategory_name();
			String url = tuple2.getT2().getResult().getUrl();

			EateryUpdate newEatery = new EateryUpdate(eatery, category, url, null);
			eateryRepository.save(newEatery.toEntity());
		} else {
			Mono<byte[]> photoUrlMono = callGooglePlacePhotoApi(eatery.getPhotoReference()).subscribeOn(
				Schedulers.boundedElastic());
			Tuple3<KakaoKeywordSearchResponse, GooglePlaceDetailResponse, byte[]> tuple3 = Mono.zip(categoryMono,
				urlMono, photoUrlMono).block();

			String category = tuple3.getT1().getMeta().getTotal_count() == 0 ? null :
				tuple3.getT1().getDocuments().get(0).getCategory_name();
			String url = tuple3.getT2().getResult().getUrl();
			String photoUrl = s3Bucket.upload(tuple3.getT3());

			EateryUpdate newEatery = new EateryUpdate(eatery, category, url, photoUrl);
			eateryRepository.save(newEatery.toEntity());
		}

	}

	public void updateClickById(String id) {
		Eatery eatery = eateryRepository.findById(id)
			.orElseThrow(() -> new EntityNotFoundException("해당하는 Eatery를 찾을 수 없습니다."));

		EateryUpdate updateEatery = new EateryUpdate(eatery);
		updateEatery.updateClick();
		Eatery newEatery = updateEatery.toEntity();
		eateryRepository.save(newEatery);
	}

	private Mono<GooglePlaceDetailResponse> callGooglePlaceDetailApi(String id) {
		return webClient.mutate()
			.baseUrl("https://maps.googleapis.com/maps/api/place/details/json")
			.build()
			.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("place_id", id)
				.queryParam("fields", "url")
				.queryParam("key", googleApiKey)
				.build())
			.retrieve()
			.bodyToMono(GooglePlaceDetailResponse.class);
	}

	private List<GooglePlaceSearchResultResponse> callGooglePlaceSearchApi(double lng, double lat) {
		return webClient.mutate()
			.baseUrl("https://maps.googleapis.com/maps/api/place/nearbysearch/json")
			.build()
			.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("language", "ko")
				.queryParam("location", lat + ", " + lng)
				.queryParam("radius", "500")
				.queryParam("type", "restaurant")
				.queryParam("opennow", true)
				.queryParam("key", googleApiKey)
				.build())
			.retrieve()
			.bodyToMono(GooglePlaceSearchResponse.class)
			.map(googlePlaceSearchResponse -> {
				if (googlePlaceSearchResponse.getStatus().equals("OVER_QUERY_LIMIT")) {
					log.error("[Google API OVER QUERY LIMIT] ");
					throw new GoogleApiLimitException();
				}
				return googlePlaceSearchResponse.getResults();
			}).block();
	}

	private Mono<byte[]> callGooglePlacePhotoApi(String photoReference) {
		return webClient.mutate()
			.baseUrl("https://maps.googleapis.com/maps/api/place/photo")
			.build()
			.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("maxwidth", 150)
				.queryParam("maxheight", 150)
				.queryParam("photoreference", photoReference)
				.queryParam("key", googleApiKey)
				.build())
			.retrieve()
			.bodyToMono(byte[].class);
	}

	private Mono<KakaoKeywordSearchResponse> callKakaoKeywordSearchApi(String placeName, double lng, double lat) {

		return webClient.mutate()
			.baseUrl("https://dapi.kakao.com/v2/local/search/keyword.json")
			.build()
			.get()
			.uri(uriBuilder -> uriBuilder
				.queryParam("query", placeName)
				.queryParam("category_group_code", "FD6")
				.queryParam("x", lng)
				.queryParam("y", lat)
				.queryParam("radius", 100)
				.queryParam("page", 1)
				.queryParam("size", 1)
				.queryParam("sort", "accuracy")
				.build())
			.header("Authorization", kakaoApiKey)
			.retrieve()
			.bodyToMono(KakaoKeywordSearchResponse.class);
	}
}
