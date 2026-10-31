package com.pos.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.pos.model.Mesa;
import com.pos.repository.MesaRepository;

@RestController
@RequestMapping("/api/mesas")
public class MesasController {

    @Autowired
    private MesaRepository mesaRepository;

    @GetMapping
    public List<Mesa> obtenerTodas() {
        return mesaRepository.findAll();
    }

    @PostMapping
    public Mesa crear(@RequestBody Mesa mesa) {
        if (mesa.getTotalConsumo() == null) {
            mesa.setTotalConsumo(0.0);
        }
        return mesaRepository.save(mesa);
    }

    // Endpoint específico para cambiar rápidamente el estado de la mesa desde la vista del Mesero
    @PutMapping("/{id}/estado")
    public ResponseEntity<Mesa> cambiarEstado(@PathVariable Integer id, @RequestParam String nuevoEstado) {
        return mesaRepository.findById(id)
                .map(mesa -> {
                    mesa.setEstado(nuevoEstado);
                    if ("LIBRE".equals(nuevoEstado) || "LIMPIEZA".equals(nuevoEstado)) {
                        mesa.setTotalConsumo(0.0);
                    }
                    return ResponseEntity.ok(mesaRepository.save(mesa));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> eliminar(@PathVariable Integer id) {
        return mesaRepository.findById(id)
                .map(mesa -> {
                    mesaRepository.delete(mesa);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}