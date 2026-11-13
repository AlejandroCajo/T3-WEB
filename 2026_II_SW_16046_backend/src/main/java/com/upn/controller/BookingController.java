package com.upn.controller;

import com.upn.dto.BookingDTO;
import com.upn.model.Booking;
import com.upn.model.Customer;
import com.upn.model.Room;
import com.upn.model.User;
import com.upn.repository.IUserRepository;
import com.upn.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final IBookingService service;
    private final IUserRepository userRepo;

    @Qualifier("defaultMapper")
    private final ModelMapper modelMapper;

    @GetMapping
    public ResponseEntity<List<BookingDTO>> findAll() throws Exception {
        List<BookingDTO> list = service.findAll().stream().map(this::toDTO).toList();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingDTO> findById(@PathVariable Integer id) throws Exception {
        Booking obj = service.findById(id);
        return ResponseEntity.ok(toDTO(obj));
    }

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody BookingDTO dto) throws Exception {
        Booking booking = toEntity(dto);
        Booking obj = service.save(booking);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdBooking()).toUri();
        return ResponseEntity.created(location).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<BookingDTO> update(@PathVariable Integer id, @RequestBody BookingDTO dto) throws Exception {
        Booking booking = toEntity(dto);
        Booking obj = service.update(id, booking);
        return ResponseEntity.ok(toDTO(obj));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteById(@PathVariable Integer id) throws Exception {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private BookingDTO toDTO(Booking b) {
        BookingDTO dto = new BookingDTO();
        dto.setIdBooking(b.getIdBooking());
        dto.setFromDate(b.getFromDate());
        dto.setToDate(b.getToDate());
        dto.setDetails(b.getDetails());
        if (b.getCustomer() != null) {
            dto.setIdCustomer(b.getCustomer().getIdCustomer());
            dto.setCustomerName(b.getCustomer().getFirstName() + " " + b.getCustomer().getLastName());
        }
        if (b.getRoom() != null) {
            dto.setIdRoom(b.getRoom().getIdRoom());
            dto.setRoomNumber(b.getRoom().getNumber());
        }
        if (b.getUser() != null) {
            dto.setIdUser(b.getUser().getIdUser());
        }
        return dto;
    }

    private Booking toEntity(BookingDTO dto) {
        Booking b = new Booking();
        b.setIdBooking(dto.getIdBooking());
        b.setFromDate(dto.getFromDate());
        b.setToDate(dto.getToDate());
        b.setDetails(dto.getDetails());

        if (dto.getIdCustomer() != null) {
            Customer c = new Customer();
            c.setIdCustomer(dto.getIdCustomer());
            b.setCustomer(c);
        }
        if (dto.getIdRoom() != null) {
            Room r = new Room();
            r.setIdRoom(dto.getIdRoom());
            b.setRoom(r);
        }

        Integer userId = dto.getIdUser() != null ? dto.getIdUser() : 1;
        userRepo.findById(userId).ifPresent(b::setUser);

        return b;
    }
}
