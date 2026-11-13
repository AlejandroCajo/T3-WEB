package com.upn.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDTO {
  private Integer idCustomer;
  private String documentType;
  private String documentNumber;
  private String firstName;
  private String lastName;
  private String email;
  private String address;
  private String phoneNumber;
}
