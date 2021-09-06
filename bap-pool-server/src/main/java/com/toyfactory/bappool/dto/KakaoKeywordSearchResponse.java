package com.toyfactory.bappool.dto;

import java.util.List;

import lombok.Getter;

@Getter
public class KakaoKeywordSearchResponse {
	private List<KakaoKeywordSearchDocumentResponse> documents;
	private KakaoKeywordSearchMetaResponse meta;
}
