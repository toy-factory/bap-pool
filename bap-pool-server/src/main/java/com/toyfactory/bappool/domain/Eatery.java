package com.toyfactory.bappool.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Lob;
import javax.validation.constraints.NotNull;

@Getter
@NoArgsConstructor
@Entity
public class Eatery {
    @Id
    private Long id;

    @NotNull
    private int click;

    @Lob
    private String thumbnail;

    @Builder
    public Eatery(Long id, int click, String thumbnail) {
        this.id = id;
        this.click = click;
        this.thumbnail = thumbnail;
    }
}
