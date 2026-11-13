package com.upn.config;

import com.upn.model.Category;
import com.upn.model.Customer;
import com.upn.model.Role;
import com.upn.model.Room;
import com.upn.model.User;
import com.upn.repository.ICategoryRepository;
import com.upn.repository.ICustomerRepository;
import com.upn.repository.IRoleRepository;
import com.upn.repository.IRoomRepository;
import com.upn.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final IUserRepository userRepo;
    private final IRoleRepository roleRepo;
    private final ICategoryRepository categoryRepo;
    private final IRoomRepository roomRepo;
    private final ICustomerRepository customerRepo;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (roleRepo.count() == 0) {
            Role admin = roleRepo.save(new Role(1, "ADMIN", "Administrador del sistema"));
            Role dba = roleRepo.save(new Role(2, "DBA", "Usuario DBA"));
            Role user = roleRepo.save(new Role(3, "USER", "Usuario estándar"));

            if (userRepo.count() == 0) {
                userRepo.save(new User(1, "testing1@example.com", passwordEncoder.encode("123"), true, List.of(admin, dba)));
                userRepo.save(new User(2, "testing2@example.com", passwordEncoder.encode("123"), true, List.of(user)));
            }
        }

        if (categoryRepo.count() == 0) {
            Category c1 = categoryRepo.save(new Category(null, "SUITE", "Suite presidencial con vista panorámica y jacuzzi", true));
            Category c2 = categoryRepo.save(new Category(null, "MATRIMONIAL", "Habitación matrimonial con cama King y balcón", true));
            Category c3 = categoryRepo.save(new Category(null, "INDIVIDUAL", "Habitación simple para estadías de negocios", true));

            if (roomRepo.count() == 0) {
                roomRepo.save(new Room(null, c1, true, "101", new BigDecimal("250.00")));
                roomRepo.save(new Room(null, c2, true, "102", new BigDecimal("180.00")));
                roomRepo.save(new Room(null, c3, true, "103", new BigDecimal("95.00")));
            }
        }

        if (customerRepo.count() == 0) {
            customerRepo.save(new Customer(null, "DNI", "74859612", "Carlos", "Mendoza Ramos", "carlos.mendoza@gmail.com", "Av. Primavera 123, Lima", "987654321"));
            customerRepo.save(new Customer(null, "DNI", "45123698", "Ana Lucía", "Torres Vega", "ana.torres@hotmail.com", "Jr. Bolognesi 456, Trujillo", "912345678"));
        }
    }
}
