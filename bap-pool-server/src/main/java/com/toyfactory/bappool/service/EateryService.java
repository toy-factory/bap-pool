package com.toyfactory.bappool.service;

import com.toyfactory.bappool.domain.Eatery;
import com.toyfactory.bappool.domain.EateryRepository;
import com.toyfactory.bappool.dto.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.openqa.selenium.By;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.springframework.http.*;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.persistence.EntityNotFoundException;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Transactional
@Service
public class EateryService {

    private final EateryRepository eateryRepository;

    private WebDriver driver;
    private WebElement element;
    private String url;

    public List<EateryResponse> findFive(double lng, double lat) {
        List<EateryResponse> openPlace = new LinkedList<>();

        // Kakao API 호출
        List<KakaoPlaceDocumentResponse> places = callKakaoApi(lng, lat);
        execChromeDriver();
        places.forEach(place -> {
            long id = Long.parseLong(place.getId());
            if (!eateryRepository.existsById(id)) {
                String thumbnailUrl = callKakaoImageApi(place.getPlace_name());
                EateryCreateRequest request = new EateryCreateRequest(Long.parseLong(place.getId()), 0, thumbnailUrl);
                create(request);
            }

            try {
                if (isOpen(place.getPlace_url())) {
                    Eatery eatery = eateryRepository.findById(id)
                            .orElseThrow(() -> new EntityNotFoundException("해당되는 음식점 정보가 없습니다."));

                    openPlace.add(new EateryResponse(place, eatery.getThumbnail(), eatery.getClick()));
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        driver.close();

        return openPlace.size() >= 5 ? openPlace.subList(0, 5) : openPlace;
    }

    private void execChromeDriver() {
        String WEB_DRIVER_ID = "webdriver.chrome.driver";
        String WEB_DRIVER_PATH = "/Users/suyeonchoi/Desktop/bap-pool/bap-pool-server/src/chromedriver";
        System.setProperty(WEB_DRIVER_ID, WEB_DRIVER_PATH);

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--start-maximized");
        options.addArguments("--disable-popup-blocking");

        driver = new ChromeDriver(options);
    }

    private boolean isOpen(String url) throws InterruptedException {
        driver.get(url);
        Thread.sleep(2000); // 3. 페이지 로딩 대기 시간

        try {
            driver.findElement(By.className("open"));
            return true;
        } catch (NoSuchElementException e) {
            return false;
        }
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

        // 반경 추가해야함.
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
