package com.upn.controller;

import com.upn.dto.RoomDTO;
import com.upn.model.Category;
import com.upn.model.Room;
import com.upn.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final IRoomService service;

    @Qualifier("roomMapper")
    private final ModelMapper modelMapper;

    @GetMapping // 200 -> ok
    public ResponseEntity<List<RoomDTO>> findAll() throws Exception{
        List<RoomDTO> list = service.findAll().stream().map(e -> {
            RoomDTO dto = modelMapper.map(e, RoomDTO.class);
            if (e.getCategory() != null) {
                dto.setIdCategory(e.getCategory().getIdCategory());
            }
            return dto;
        }).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}") // 200 -> ok
    public ResponseEntity<RoomDTO> findById(@PathVariable Integer id) throws Exception{
        Room obj = service.findById(id);
        RoomDTO dto = modelMapper.map(obj, RoomDTO.class);
        if (obj.getCategory() != null) {
            dto.setIdCategory(obj.getCategory().getIdCategory());
        }
        return ResponseEntity.ok(dto);
    }

    @PostMapping // 201 --> Created
    public ResponseEntity<Void> save(@RequestBody RoomDTO dto) throws Exception{
        Room room = modelMapper.map(dto, Room.class);
        if (dto.getIdCategory() != null) {
            Category cat = new Category();
            cat.setIdCategory(dto.getIdCategory());
            room.setCategory(cat);
        }
        Room obj = service.save(room);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdRoom()).toUri();

        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}") // 200 ok
    public ResponseEntity<RoomDTO> update(@PathVariable Integer id, @RequestBody RoomDTO dto) throws Exception{
        Room room = modelMapper.map(dto, Room.class);
        if (dto.getIdCategory() != null) {
            Category cat = new Category();
            cat.setIdCategory(dto.getIdCategory());
            room.setCategory(cat);
        }
        Room obj = service.update(id, room);
        RoomDTO res = modelMapper.map(obj, RoomDTO.class);
        if (obj.getCategory() != null) {
            res.setIdCategory(obj.getCategory().getIdCategory());
        }
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/{id}") // 204 no content
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) throws Exception{
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
