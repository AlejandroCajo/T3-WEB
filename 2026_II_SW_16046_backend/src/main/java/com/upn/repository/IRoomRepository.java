package com.upn.repository;

import com.upn.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

//public interface IRoomRepository extends JpaRepository<Room, Integer> {
public interface IRoomRepository extends IGenericRepository<Room, Integer> {
    //List<Room> findRoomTopTen();
    //List<Room> findRoomBottonTen();
}
