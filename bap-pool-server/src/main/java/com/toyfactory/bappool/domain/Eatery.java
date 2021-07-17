package com.toyfactory.bappool.domain;

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
    private Long click;

    @Lob
    private String thumbnail;
}
