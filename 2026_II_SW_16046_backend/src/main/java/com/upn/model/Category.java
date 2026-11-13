package com.upn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Category {
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCategory;

    @Column(nullable = false, unique = true,  length = 20)
    private String name; // SUITE, MATRIMONIAL, INDIVIDUAL, DOBLE, TRIPLE

    @Column(nullable = false, unique = true, length = 100)
    private String description;

    @Column(nullable = false)
    private boolean status;

    // private List<Room> rooms;
}
