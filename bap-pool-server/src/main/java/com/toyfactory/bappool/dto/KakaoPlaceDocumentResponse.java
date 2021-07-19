package com.toyfactory.bappool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class KakaoPlaceDocumentResponse {

    private String id;

    private String address_name;

    private String category_group_name;

    private String category_name;

    private String distance;

    private String phone;

    private String place_name;

    private String place_url;

    private String road_address_name;

    private String x;

    private String y;

    @Override
    public String toString() {
        return "KakaoPlaceDocumentResponse{" +
                "id='" + id + '\'' +
                ", address_name='" + address_name + '\'' +
                ", category_group_name='" + category_group_name + '\'' +
                ", category_name='" + category_name + '\'' +
                ", distance='" + distance + '\'' +
                ", phone='" + phone + '\'' +
                ", place_name='" + place_name + '\'' +
                ", place_url='" + place_url + '\'' +
                ", road_address_name='" + road_address_name + '\'' +
                ", x='" + x + '\'' +
                ", y='" + y + '\'' +
                '}';
    }
}
