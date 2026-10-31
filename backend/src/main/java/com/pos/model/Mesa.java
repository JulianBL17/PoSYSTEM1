package com.pos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 50)
    private String numero; // Ej: "Mesa 1", "Terraza 2"

    @Column(nullable = false)
    private Integer capacidad;

    @Column(nullable = false, length = 20)
    private String estado; // "LIBRE", "OCUPADA", "LIMPIEZA"

    @Column(name = "total_consumo")
    private Double totalConsumo;

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Double getTotalConsumo() { return totalConsumo; }
    public void setTotalConsumo(Double totalConsumo) { this.totalConsumo = totalConsumo; }
}