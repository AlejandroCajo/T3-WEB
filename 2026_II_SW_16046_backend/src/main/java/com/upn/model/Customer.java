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
public class Customer {
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idCustomer;

    @Column(nullable = false, length = 5)
    private String documentType; // DNI CE

    @Column(nullable = false, length = 15)
    private String documentNumber; // 78954612 0004284512

    @Column(nullable = false, length = 50)
    private String firstName;

    @Column(nullable = false, length = 50)
    private String lastName;

    @Column(length = 70)
    private String email;

    @Column(length = 150)
    private String address;

    @Column(length = 20)
    private String phoneNumber;
}
