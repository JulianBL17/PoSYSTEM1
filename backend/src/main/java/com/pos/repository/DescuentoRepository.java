package com.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pos.model.Descuento;

@Repository
public interface DescuentoRepository extends JpaRepository<Descuento, Integer> {
}