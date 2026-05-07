package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByUsuarioAndPasswordAndRol(
            String usuario,
            String password,
            String rol
    );
}
