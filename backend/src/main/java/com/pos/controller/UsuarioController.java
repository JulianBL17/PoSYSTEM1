package com.pos.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.model.Usuario;
import com.pos.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository repo;

    public UsuarioController(UsuarioRepository repo) {
        this.repo = repo;
    }

    // LISTAR USUARIOS
    @GetMapping
    public List<Usuario> listar() {
        return repo.findAll();
    }

    // CREAR USUARIO
    @PostMapping
    public ResponseEntity<Usuario> crear(@RequestBody Usuario usuario) {

        if (vacio(usuario.getNombre()) || vacio(usuario.getCorreo())
                || vacio(usuario.getPassword()) || vacio(usuario.getRol())) {
            return ResponseEntity.badRequest().build();
        }

        // El correo es único: evitamos el error 500 por clave duplicada
        if (repo.findByCorreo(usuario.getCorreo()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        usuario.setId(null);
        return ResponseEntity.ok(repo.save(usuario));
    }

    // ACTUALIZAR USUARIO
    @PutMapping("/{id}")
    public ResponseEntity<Usuario> actualizar(
            @PathVariable Integer id,
            @RequestBody Usuario usuario)
            {

        return repo.findById(id)
                .map(usuarioExistente -> {
                    // Ajusta los setters según los campos reales de la clase Usuario
                    usuarioExistente.setNombre(usuario.getNombre());
                    usuarioExistente.setRol(usuario.getRol());
                    usuarioExistente.setCorreo(usuario.getCorreo());

                    // La contraseña no viaja al navegador: si llega vacía, se conserva la actual
                    if (!vacio(usuario.getPassword())) {
                        usuarioExistente.setPassword(usuario.getPassword());
                    }

                    Usuario actualizado = repo.save(usuarioExistente);
                    return ResponseEntity.ok(actualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR USUARIO
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {

        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private boolean vacio(String texto) {
        return texto == null || texto.isBlank();
    }
}