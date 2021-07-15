package com.toyfactory.bappool.domain;

import com.sun.istack.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.Id;

@Getter
@NoArgsConstructor
@Entity
public class Eatery {
    @Id
    private Long id;

    @NotNull
    private Long click;
}
