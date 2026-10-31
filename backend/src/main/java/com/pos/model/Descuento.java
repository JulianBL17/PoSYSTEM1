package com.pos.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "descuentos")
public class Descuento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false)
    private Integer porcentaje;

    @Column(nullable = false, length = 50)
    private String alcance; // Ej: "GLOBAL", "COMIDAS", "BEBIDAS"

    @Column(nullable = false)
    private Boolean estado; // true = activo, false = inactivo

    // Getters y Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Integer getPorcentaje() { return porcentaje; }
    public void setPorcentaje(Integer porcentaje) { this.porcentaje = porcentaje; }
    public String getAlcance() { return alcance; }
    public void setAlcance(String alcance) { this.alcance = alcance; }
    public Boolean getEstado() { return estado; }
    public void setEstado(Boolean estado) { this.estado = estado; }
}