package com.pos.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.model.Usuario;
import com.pos.repository.UsuarioRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepo;
    private final AuthenticationManager authenticationManager;

    // Inyectamos también el AuthenticationManager para gestionar la sesión de Spring Security
    public AuthController(UsuarioRepository usuarioRepo, AuthenticationManager authenticationManager) {
        this.usuarioRepo = usuarioRepo;
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales, HttpServletRequest request) {

        String correo = credenciales.get("correo");
        String password = credenciales.get("password");

        if (correo == null || correo.isBlank() || password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Ingrese el correo y la contraseña."));
        }

        try {
            // 1. Delegamos la autenticación oficial a Spring Security (utiliza tu UsuarioService y NoOpPasswordEncoder)
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(correo.trim(), password)
            );

            // 2. Establecemos el contexto de seguridad en el hilo actual
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            securityContext.setAuthentication(authentication);
            SecurityContextHolder.setContext(securityContext);

            // 3. CRÍTICO: Creamos y guardamos la sesión HTTP para que el navegador mantenga las credenciales en peticiones futuras
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, securityContext);

            // 4. Buscamos el usuario en la BD para devolver sus datos al frontend tal como lo hacías
            return usuarioRepo.findByCorreo(correo.trim())
                    .map(usuario -> ResponseEntity.ok(datosSesion(usuario)))
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(Map.of("mensaje", "Usuario no encontrado.")));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("mensaje", "Correo o contraseña incorrectos."));
        }
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