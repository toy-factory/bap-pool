package com.toyfactory.bappool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class EateryResponse {
    private String id;

    private String place_name;

    private String thumbnail;

    private String distance;

    private int click;

    private String category_name;

    private String place_url;

    public EateryResponse(KakaoPlaceDocumentResponse kakaoResponse, String thumbnail, int click) {
        this.id = kakaoResponse.getId();
        this.place_name = kakaoResponse.getPlace_name();
        this.distance = kakaoResponse.getDistance();
        this.category_name = kakaoResponse.getCategory_name();
        this.place_url = kakaoResponse.getPlace_url();
        this.thumbnail = thumbnail;
        this.click = click;
    }
}
