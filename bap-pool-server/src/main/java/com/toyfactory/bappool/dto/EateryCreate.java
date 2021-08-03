package com.toyfactory.bappool.dto;

import com.toyfactory.bappool.domain.Eatery;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class EateryCreate {
    @NotNull
    private String id;

    @NotNull
    private int click;

    private String photoReference;

    public Eatery toEntity() {
        return Eatery.builder()
                .id(id)
                .click(click)
                .photoReference(photoReference)
                .build();
    }
}
