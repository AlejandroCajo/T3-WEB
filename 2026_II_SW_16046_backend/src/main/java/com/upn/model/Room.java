package com.upn.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
// @Table(name="habitaciones", schema = "rrhh")
public class Room {
  @Id
  @EqualsAndHashCode.Include
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer idRoom;

  // private Integer idCategory;
  @ManyToOne // FK
  @JoinColumn(name = "id_category", nullable = false,
            foreignKey = @ForeignKey(name="FK_ROOM_CATEGORY")) // idCategory
  private Category category;  // room.category.name -> suite etc

  @Column(nullable = false)
  private Boolean available;

  @Column(nullable = false,length = 10)
  private String number;

  @Column(nullable = false)
  private BigDecimal price;

  //@Column(nullable = false, length = 50)
  //private String type; // Suite, Individual, Matrimonial
}
