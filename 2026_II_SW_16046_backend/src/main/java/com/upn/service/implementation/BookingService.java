package com.upn.service.implementation;

import com.upn.model.Booking;
import com.upn.repository.IBookingRepository;
import com.upn.repository.IGenericRepository;
import com.upn.service.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookingService extends GenericService<Booking, Integer> implements IBookingService {
    private final IBookingRepository repo;

    @Override
    protected IGenericRepository<Booking, Integer> getRepo() {
        return repo;
    }
}
