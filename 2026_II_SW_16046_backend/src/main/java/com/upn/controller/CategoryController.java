package com.upn.controller;

import com.upn.dto.CategoryDTO;
import com.upn.model.Category;
import com.upn.service.ICategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/categories")
@RequiredArgsConstructor
//@CrossOrigin(origins = "http://localhost:4200")
// @CrossOrigin(origins = {"http://localhost:4200","http://localhost:5200"})
// @CrossOrigin(origins = "*")
public class CategoryController {
    private final ICategoryService service;

    @Qualifier("defaultMapper")
    private final ModelMapper modelMapper;

    @GetMapping("/paginado")
    private ResponseEntity<Page<Category>> listPaginable(Pageable pageable) {
        Page<Category> paginado = service.listPaginable(pageable);
        return ResponseEntity.ok(paginado);
    }

    @GetMapping // 200 -> ok
    public ResponseEntity<List<CategoryDTO>> findAll() throws Exception{
        // ModelMapper modelMapper = new ModelMapper();
        // List<CategoryDTO> list = service.findAll().stream().map(e -> new CategoryDTO(e.getIdCategory(), e.getName(), e.getDescription(), e.getStatus())).toList();
        List<CategoryDTO> list = service.findAll().stream().map(e->modelMapper.map(e, CategoryDTO.class)).toList();
        return ResponseEntity.ok(list);
    }

    @Operation(summary = "Obtener categoría por ID", description = "Busca y retorna los detalles de una categoría usando su identificador único.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría encontrada con éxito"),
            @ApiResponse(responseCode = "404", description = "La categoría solicitado no existe")
    })
    @GetMapping("/{id}") // 200 -> ok
    public ResponseEntity<CategoryDTO> findById(@PathVariable Integer id) throws Exception{
        Category obj = service.findById(id);
        return ResponseEntity.ok(modelMapper.map(obj, CategoryDTO.class));
    }

    @PostMapping // 201 --> Created
    public ResponseEntity<Void> save(@Valid @RequestBody CategoryDTO dto) throws Exception{
        Category obj = service.save(modelMapper.map(dto, Category.class));
        //return new ResponseEntity(obj, HttpStatus.CREATED);
        // http://localhost:9494/v1/categories/6
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdCategory()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}") // 200 ok
    public ResponseEntity<CategoryDTO> update(@Valid @PathVariable Integer id, @RequestBody CategoryDTO dto) throws Exception{
        Category obj = service.update(id, modelMapper.map(dto, Category.class));
        return ResponseEntity.ok(modelMapper.map(obj, CategoryDTO.class));
    }

    @DeleteMapping("/{id}") // 204 no content
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
