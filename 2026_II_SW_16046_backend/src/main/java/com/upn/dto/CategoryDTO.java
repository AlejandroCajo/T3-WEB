package com.upn.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    private Integer idCategory;

    @NotBlank(message = "El nombre no puede estar vacío")
    //@NotBlank
    //@NotEmpty
    @Size(min=3, max=20, message = "El nombre no puede ser menor a 3 caracteres ni mayor a 20")
    private String name;

    @NotNull
    private String description;

    @NotNull
    //@Pattern(regexp = "\\d{9}", message = "El teléfono solo permite valores numéricos")
    private String status;

    // Numericos
    // @Min(10)
    // @Max(100)
}
