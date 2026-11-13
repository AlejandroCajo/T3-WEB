package com.upn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoomDTO {
    private Integer idRoom;
    private Integer idCategory;
    private Boolean disponibilidad;
    private String numeroHabitacion;
    private BigDecimal precio;
}
