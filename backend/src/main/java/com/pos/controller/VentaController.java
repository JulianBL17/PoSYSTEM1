package com.pos.controller;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.pos.model.Producto;
import com.pos.model.Venta;
import com.pos.repository.ProductoRepository;
import com.pos.repository.UsuarioRepository;
import com.pos.repository.VentaRepository;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaRepository ventaRepo;
    private final ProductoRepository productoRepo;
    private final UsuarioRepository usuarioRepo;

    public VentaController(VentaRepository ventaRepo,
                           ProductoRepository productoRepo,
                           UsuarioRepository usuarioRepo) {
        this.ventaRepo = ventaRepo;
        this.productoRepo = productoRepo;
        this.usuarioRepo = usuarioRepo;
    }

    // LISTAR VENTAS
    @GetMapping
    public List<Venta> listar() {
        return ventaRepo.findAll();
    }

    // CREAR VENTA
    @PostMapping
    public ResponseEntity<Venta> crear(@RequestBody Venta venta) {
        if (venta.getProducto() == null || venta.getProducto().getId() == null
                || venta.getCantidad() == null || venta.getCantidad() <= 0
                || venta.getMetodoPago() == null || venta.getMetodoPago().isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        // Angular solo envía { id } del usuario: se carga el registro real (vendedor)
        if (venta.getUsuario() != null && venta.getUsuario().getId() != null) {
            venta.setUsuario(usuarioRepo.findById(venta.getUsuario().getId()).orElse(null));
        } else {
            venta.setUsuario(null);
        }

        // El id y la fecha los asigna el servidor, no el cliente
        venta.setId(null);
        venta.setFecha(LocalDateTime.now());

        return productoRepo.findById(venta.getProducto().getId())
                .map(producto -> {
                    venta.setProducto(producto);
                    venta.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(venta.getCantidad())));
                    Venta nuevaVenta = ventaRepo.save(venta);
                    return ResponseEntity.ok(nuevaVenta);
                })
                .orElse(ResponseEntity.badRequest().build());
    }

    // ACTUALIZAR VENTA
    @PutMapping("/{id}")
    public ResponseEntity<Venta> actualizar(
            @PathVariable Integer id,
            @RequestBody Venta ventaDetalles) {

        return ventaRepo.findById(id)
                .map(ventaExistente -> {
                    if (ventaDetalles.getProducto() != null && ventaDetalles.getProducto().getId() != null) {
                        Producto producto = productoRepo.findById(ventaDetalles.getProducto().getId()).orElse(null);
                        if (producto != null) {
                            ventaExistente.setProducto(producto);
                            ventaExistente.setTotal(producto.getPrecio().multiply(BigDecimal.valueOf(ventaDetalles.getCantidad())));
                        }
                    }

                    ventaExistente.setCantidad(ventaDetalles.getCantidad());
                    ventaExistente.setMetodoPago(ventaDetalles.getMetodoPago());
                    Venta actualizada = ventaRepo.save(ventaExistente);
                    return ResponseEntity.ok(actualizada);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ELIMINAR VENTA
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!ventaRepo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        ventaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}