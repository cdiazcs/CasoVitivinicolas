package com.vitivinicolas.backend.repository;

import com.vitivinicolas.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Método original (ya no lo usaremos para login, pero lo mantenemos)
    Optional<Usuario> findByUsuarioAndPasswordAndRol(
            String usuario,
            String password,
            String rol
    );

    // NUEVO: Buscar solo por usuario (para login con BCrypt)
    Optional<Usuario> findByUsuario(String usuario);
}