package com.upn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDTO {
    private Integer idBooking;
    private LocalDate fromDate;
    private LocalDate toDate;
    private Integer idCustomer;
    private String customerName;
    private Integer idRoom;
    private String roomNumber;
    private Integer idUser;
    private String details;
}
