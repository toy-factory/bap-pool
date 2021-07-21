package com.toyfactory.bappool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class KakaoImageResultResponse {

    private String collection;

    private String datetime;

    private String display_sitename;

    private String doc_url;

    private int width;

    private int height;

    private String image_url;

    private String thumbnail_url;
}
