package com.pos.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.model.Usuario;
import com.pos.repository.UsuarioRepository;

/**
 * Inicio de sesión para el frontend Angular.
 * Recibe { correo, password } y devuelve los datos del usuario (sin contraseña).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;

    public AuthController(UsuarioRepository usuarioRepo) {
        this.usuarioRepo = usuarioRepo;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {

        String correo = credenciales.get("correo");
        String password = credenciales.get("password");

        if (correo == null || correo.isBlank() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Ingrese el correo y la contraseña."));
        }

        // Mismo criterio que SecurityConfig (NoOpPasswordEncoder): comparación directa
        return usuarioRepo.findByCorreo(correo.trim())
                .filter(usuario -> password.equals(usuario.getPassword()))
                .<ResponseEntity<?>>map(usuario -> ResponseEntity.ok(datosSesion(usuario)))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("mensaje", "Correo o contraseña incorrectos.")));
    }

    private Map<String, Object> datosSesion(Usuario usuario) {
        return Map.of(
                "id", usuario.getId(),
                "nombre", usuario.getNombre(),
                "correo", usuario.getCorreo(),
                "rol", usuario.getRol()
        );
    }
}
