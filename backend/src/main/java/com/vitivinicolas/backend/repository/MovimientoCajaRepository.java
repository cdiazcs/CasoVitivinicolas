package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.MovimientoCaja;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MovimientoCajaRepository
        extends JpaRepository<MovimientoCaja, Long> {
}
