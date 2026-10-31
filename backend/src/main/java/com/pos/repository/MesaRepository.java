package com.pos.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.pos.model.Mesa;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Integer> {
}