package com.upn.controller;

import com.upn.dto.CustomerDTO;
import com.upn.model.Customer;
import com.upn.service.ICustomerService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/customers")
@RequiredArgsConstructor
public class CustomerController {
    private final ICustomerService service;

    @Qualifier("defaultMapper")
    private final ModelMapper modelMapper;

    @GetMapping // 200 -> ok
    public ResponseEntity<List<CustomerDTO>> findAll() throws Exception{
        List<CustomerDTO> list = service.findAll().stream().map(e->modelMapper.map(e, CustomerDTO.class)).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}") // 200 -> ok
    public ResponseEntity<CustomerDTO> findById(@PathVariable Integer id) throws Exception{
        Customer obj = service.findById(id);
        return ResponseEntity.ok(modelMapper.map(obj, CustomerDTO.class));
    }

    @PostMapping // 201 --> Created
    public ResponseEntity<Void> save(@Valid @RequestBody CustomerDTO dto) throws Exception{
        Customer obj = service.save(modelMapper.map(dto, Customer.class));
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdCustomer()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}") // 200 ok
    public ResponseEntity<CustomerDTO> update(@Valid @PathVariable Integer id, @RequestBody CustomerDTO dto) throws Exception{
        Customer obj = service.update(id, modelMapper.map(dto, Customer.class));
        return ResponseEntity.ok(modelMapper.map(obj, CustomerDTO.class));
    }

    @DeleteMapping("/{id}") // 204 no content
    public ResponseEntity<Void> delete(@PathVariable Integer id) throws Exception{
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
