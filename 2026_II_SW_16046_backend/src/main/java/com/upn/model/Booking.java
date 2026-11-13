package com.upn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
public class Booking {
    @Id
    @EqualsAndHashCode.Include
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idBooking;

    @Column(nullable = false)
    private LocalDate fromDate;

    @Column(nullable = false)
    private LocalDate toDate;

    @ManyToOne
    @JoinColumn(name = "id_customer", nullable = false,
            foreignKey = @ForeignKey(name="FK_BOOKING_CUSTOMER"))
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "id_user", nullable = false,
            foreignKey = @ForeignKey(name="FK_BOOKING_USER"))
    private User user;

    @ManyToOne
    @JoinColumn(name = "id_room", nullable = false,
            foreignKey = @ForeignKey(name="FK_BOOKING_ROOM"))
    private Room room;

    private String details;
}
