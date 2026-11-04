package com.pos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pos.model.Proveedor;
import com.pos.repository.ProveedorRepository;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedoresController {

    @Autowired
    private ProveedorRepository proveedorRepository;

    @GetMapping
    public List<Proveedor> obtenerTodos() {
        return proveedorRepository.findAll();
    }

    @PostMapping
    public Proveedor crear(@RequestBody Proveedor proveedor) {
        return proveedorRepository.save(proveedor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Proveedor> actualizar(@PathVariable Integer id, @RequestBody Proveedor detalles) {
        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedor.setNombreEmpresa(detalles.getNombreEmpresa());
                    proveedor.setNombreContacto(detalles.getNombreContacto());
                    proveedor.setTelefono(detalles.getTelefono());
                    proveedor.setCorreo(detalles.getCorreo());
                    return ResponseEntity.ok(proveedorRepository.save(proveedor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminar(@PathVariable Integer id) {
        return proveedorRepository.findById(id)
                .map(proveedor -> {
                    proveedorRepository.delete(proveedor);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}