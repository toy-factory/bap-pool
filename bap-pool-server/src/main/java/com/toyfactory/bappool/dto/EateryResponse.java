package com.toyfactory.bappool.dto;

import java.util.List;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class EateryResponse {
	private String id;

	private String placeName;

	private String thumbnail;

	private double distance;

	private int click;

	private List<String> types;

	private String url;

	public EateryResponse(GooglePlaceSearchResultResponse place, double lat, double lng) {
		this.id = place.getPlace_id();
		this.placeName = place.getName();
		this.types = place.getTypes();
		this.distance = distanceMeter(lat, lng, place.getGeometry().getLocation());
	}

	public void updateDetail(EateryDetailResponse eateryDetail) {
		this.thumbnail = eateryDetail.getThumbnail();
		this.click = eateryDetail.getClick();
		this.url = eateryDetail.getUrl();
	}

	private static double distanceMeter(double curLat, double curLng, GooglePlaceSearchLocationResponse location) {
		double desLat = location.getLat();
		double desLng = location.getLng();

		double theta = curLng - desLng;
		double dist = Math.sin(deg2rad(curLat)) * Math.sin(deg2rad(desLat)) + Math.cos(deg2rad(curLat)) * Math.cos(
			deg2rad(desLat)) * Math.cos(deg2rad(theta));

		dist = Math.acos(dist);
		dist = rad2deg(dist);
		dist = dist * 60 * 1.1515;
		dist = dist * 1609.344;

		return dist;
	}

	private static double deg2rad(double deg) {
		return (deg * Math.PI / 180.0);
	}

	private static double rad2deg(double rad) {
		return (rad * 180 / Math.PI);
	}
}
