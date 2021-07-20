package com.toyfactory.bappool.dto;

import com.toyfactory.bappool.domain.Eatery;
import lombok.AllArgsConstructor;
import lombok.Getter;

import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

@AllArgsConstructor
@Getter
public class EateryCreateRequest {
    @NotNull
    private Long id;

    @NotNull
    private int click;

    @Lob
    private String thumbnail;

    public Eatery toEntity() {
        return Eatery.builder()
                .id(id)
                .click(click)
                .thumbnail(thumbnail)
                .build();
    }
}
