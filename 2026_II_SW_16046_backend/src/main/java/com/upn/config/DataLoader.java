package com.upn.config;

import com.upn.model.Role;
import com.upn.model.User;
import com.upn.repository.IRoleRepository;
import com.upn.repository.IUserRepository;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {
    private final IUserRepository userRepo;
    private final IRoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;
    private String passwordText;

    /*public DataLoader(IUserRepository userRepo, IRoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }*/

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepo.count() > 0 || roleRepo.count() > 0) {
            return;
        }

        // Roles
        Role admin = roleRepo.save(new Role(1, "ADMIN", "Administrador del sistema"));
        Role dba = roleRepo.save(new Role(2, "DBA", "Usuario DBA"));
        Role user = roleRepo.save(new Role(3, "USER", "Usuario estándar"));

        // Usuarios (contraseñas encriptadas con BCrypt)
        // Tabla intermedia user_role: (1,1), (1,2), (2,2) -> 3 registros
        userRepo.save(new User(1, "testing1@example.com", passwordEncoder.encode("123"), true, List.of(admin, dba)));
        userRepo.save(new User(2, "testing2@example.com", passwordEncoder.encode("123"), true, List.of(user)));
    }
}
