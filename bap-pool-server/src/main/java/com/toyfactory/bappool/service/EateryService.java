package com.toyfactory.bappool.service;

import com.toyfactory.bappool.domain.Eatery;
import com.toyfactory.bappool.domain.EateryRepository;
import com.toyfactory.bappool.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class EateryService {

    private final EateryRepository eateryRepository;

    public List<EateryResponse> findFive(double lng, double lat) {
        // Kakao API 호출
        List<KakaoPlaceDocumentResponse> places = callKakaoApi(lng, lat);
        places.forEach(place -> {
            if (!eateryRepository.existsById(Long.parseLong(place.getId()))) {
                // 썸네일 크롤링 추가해야함
                String thumbnailUrl = callKakaoImageApi(place.getPlace_name());
                EateryCreateRequest request = new EateryCreateRequest(Long.parseLong(place.getId()), 0, thumbnailUrl);
                create(request);
            }
        });

        return null;
    }

    private String callKakaoImageApi(String placeName) {
        // Header Setting
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "KakaoAK fe670d5116d85d40e249b90580fca9ce");

        // Request REST API
        String baseUrl = "https://dapi.kakao.com/v2/search/image";

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("query", placeName)
                .queryParam("sort", "accuracy")
                .queryParam("size", 1)
                .build(false);

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // api 호출 타임아웃
        factory.setReadTimeout(5000);   // api 읽기 타임아웃

        RestTemplate restTemplate = new RestTemplate(factory);
        ResponseEntity<KakaoImageResponse> responseEntity = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, new HttpEntity<String>(httpHeaders), KakaoImageResponse.class);
        log.info("[Kakao Image API Reponse Code] " + responseEntity.getStatusCode().toString());

        List<KakaoImageResultResponse> image = Objects.requireNonNull(responseEntity.getBody()).getDocuments();
        return image.get(0).getThumbnail_url();
    }

    private Long create(EateryCreateRequest request) {
        Eatery eatery = request.toEntity();
        Eatery saved = eateryRepository.save(eatery);

        return saved.getId();
    }

    private List<KakaoPlaceDocumentResponse> callKakaoApi(double lng, double lat) {
        // Header Setting
        HttpHeaders httpHeaders = new HttpHeaders();
        httpHeaders.add("Authorization", "KakaoAK fe670d5116d85d40e249b90580fca9ce");

        // Request REST API
        String baseUrl = "https://dapi.kakao.com/v2/local/search/category.json";

        UriComponents uriComponents = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("category_group_code", "FD6")
                .queryParam("sort", "accuracy")
                .queryParam("x", lng)
                .queryParam("y", lat)
                .build(false);

        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // api 호출 타임아웃
        factory.setReadTimeout(5000);   // api 읽기 타임아웃

        RestTemplate restTemplate = new RestTemplate(factory);
        ResponseEntity<KakaoLocalResponse> responseEntity = restTemplate.exchange(uriComponents.toString(), HttpMethod.GET, new HttpEntity<String>(httpHeaders), KakaoLocalResponse.class);

        log.info("[Kakao Local API Reponse Code] " + responseEntity.getStatusCode().toString());
        return responseEntity.getBody().getDocuments();
    }
}
