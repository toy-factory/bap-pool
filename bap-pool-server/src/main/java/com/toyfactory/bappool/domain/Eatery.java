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
    private String id;

    @NotNull
    private int click;

    private String url;

    @Lob
    private String photoReference;

    @Builder
    public Eatery(String id, int click, String url, String photoReference) {
        this.id = id;
        this.click = click;
        this.url = url;
        this.photoReference = photoReference;
    }

}
