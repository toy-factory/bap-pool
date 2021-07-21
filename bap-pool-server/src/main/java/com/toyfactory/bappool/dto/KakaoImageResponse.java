package com.toyfactory.bappool.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@NoArgsConstructor
@Getter
public class KakaoImageResponse {
    private List<KakaoImageResultResponse> documents;
}
