package com.pos.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "logins")
public class Login {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación con el usuario que inicia sesión
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(nullable = false)
    private LocalDateTime fechaLogin = LocalDateTime.now();

    private LocalDateTime fechaLogout;

    @Column(length = 45)
    private String ipOrigen; // IP desde donde se conectó

    @Column(length = 150)
    private String dispositivo; // Ej: "Chrome - Windows", "Navegador POS Caja 1"

    @Column(nullable = false)
    private Boolean exitoso; // true si inició sesión, false si falló la contraseña

    public Login() {}

    public Login(Usuario usuario, String ipOrigen, String dispositivo, Boolean exitoso) {
        this.usuario = usuario;
        this.ipOrigen = ipOrigen;
        this.dispositivo = dispositivo;
        this.exitoso = exitoso;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public LocalDateTime getFechaLogin() { return fechaLogin; }
    public void setFechaLogin(LocalDateTime fechaLogin) { this.fechaLogin = fechaLogin; }

    public LocalDateTime getFechaLogout() { return fechaLogout; }
    public void setFechaLogout(LocalDateTime fechaLogout) { this.fechaLogout = fechaLogout; }

    public String getIpOrigen() { return ipOrigen; }
    public void setIpOrigen(String ipOrigen) { this.ipOrigen = ipOrigen; }

    public String getDispositivo() { return dispositivo; }
    public void setDispositivo(String dispositivo) { this.dispositivo = dispositivo; }

    public Boolean getExitoso() { return exitoso; }
    public void setExitoso(Boolean exitoso) { this.exitoso = exitoso; }
}