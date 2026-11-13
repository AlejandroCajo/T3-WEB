package com.upn.config;

import com.upn.dto.RoomDTO;
import com.upn.model.Room;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MapperConfig {
    @Bean
    public ModelMapper defaultMapper() {
        return new ModelMapper();
    }

    @Bean
    public ModelMapper roomMapper(){
        ModelMapper mapper = new ModelMapper();

        // LECTURA: get / Room -> RoomDTO
        mapper.createTypeMap(Room.class, RoomDTO.class)
                .addMapping(Room::getNumber, RoomDTO::setNumeroHabitacion)
                .addMapping(Room::getPrice, RoomDTO::setPrecio)
                .addMapping(Room::getAvailable, RoomDTO::setDisponibilidad);

        // ESCRITURA: post, put / RoomDTO -> Room
        mapper.createTypeMap(RoomDTO.class, Room.class)
                .addMapping(RoomDTO::getNumeroHabitacion, Room::setNumber)
                .addMapping(RoomDTO::getPrecio, Room::setPrice)
                .addMapping(RoomDTO::getDisponibilidad, Room::setAvailable);

        return mapper;
    }
}
