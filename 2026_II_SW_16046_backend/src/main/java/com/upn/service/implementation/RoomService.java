package com.upn.service.implementation;

import com.upn.model.Room;
import com.upn.repository.IGenericRepository;
import com.upn.repository.IRoomRepository;
import com.upn.service.IRoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoomService extends GenericService<Room, Integer> implements IRoomService {
    private final IRoomRepository repo;

    @Override
    protected IGenericRepository<Room, Integer> getRepo() {
        return repo;
    }

    /*@Override
    public List<Room> topTenMonth() {
        return repo.findRoomTopTen();
    }

    @Override
    public List<Room> bottonTenYear() {
        return repo.findRoomBottonTen();
    }

     */
}
