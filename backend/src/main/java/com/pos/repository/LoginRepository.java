package com.pos.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.pos.model.Login;

@Repository
public interface LoginRepository extends JpaRepository<Login, Long> {

    // 1. Obtener historial de logins de un usuario ordenado por fecha más reciente
    List<Login> findByUsuarioIdOrderByFechaLoginDesc(Long usuarioId);

    // 2. Obtener únicamente los intentos fallidos de inicio de sesión (auditoría de seguridad)
    List<Login> findByExitosoFalse();

    // 3. Buscar logs entre un rango de fechas específico
    List<Login> findByFechaLoginBetween(LocalDateTime inicio, LocalDateTime fin);
}