package com.pos.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.pos.model.Usuario;
import com.pos.repository.UsuarioRepository;

/**
 * Si la tabla de usuarios está vacía, crea un administrador inicial
 * para poder iniciar sesión desde Angular la primera vez.
 * CAMBIA esta contraseña después del primer ingreso.
 */
@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner crearAdministradorInicial(UsuarioRepository usuarioRepo) {
        return args -> {
            if (usuarioRepo.count() == 0) {
                Usuario admin = new Usuario();
                admin.setNombre("Administrador");
                admin.setCorreo("admin@pos.com");
                admin.setPassword("admin123");
                admin.setRol("ADMIN");
                usuarioRepo.save(admin);
                log.info("Usuario inicial creado -> correo: admin@pos.com | contraseña: admin123");
            }
        };
    }
}
