package com.upn.model;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
@Embeddable
public class MenuRolePK {
    @ManyToOne
    @JoinColumn(name="id_menu", nullable = false,
                foreignKey = @ForeignKey(name = "FK_MENU_ROLE_MENU"))
    private Menu menu;

    @ManyToOne
    @JoinColumn(name="id_role", nullable = false,
            foreignKey = @ForeignKey(name = "FK_MENU_ROLE_ROLE"))
    private Role role;
}
