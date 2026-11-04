package com.pos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pos.model.Descuento;
import com.pos.repository.DescuentoRepository;

@RestController
@RequestMapping("/api/descuentos")
public class DescuentosController {

    @Autowired
    private DescuentoRepository descuentoRepository;

    @GetMapping
    public List<Descuento> obtenerTodos() {
        return descuentoRepository.findAll();
    }

    @PostMapping
    public Descuento crear(@RequestBody Descuento descuento) {
        return descuentoRepository.save(descuento);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Descuento> actualizar(@PathVariable Integer id, @RequestBody Descuento detalles) {
        return descuentoRepository.findById(id)
                .map(descuento -> {
                    descuento.setNombre(detalles.getNombre());
                    descuento.setPorcentaje(detalles.getPorcentaje());
                    descuento.setAlcance(detalles.getAlcance());
                    descuento.setEstado(detalles.getEstado());
                    return ResponseEntity.ok(descuentoRepository.save(descuento));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminar(@PathVariable Integer id) {
        return descuentoRepository.findById(id)
                .map(descuento -> {
                    descuentoRepository.delete(descuento);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}