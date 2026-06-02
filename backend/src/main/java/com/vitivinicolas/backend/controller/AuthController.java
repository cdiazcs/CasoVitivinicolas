
package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.Usuario;
import com.vitivinicolas.backend.repository.UsuarioRepository;
import com.vitivinicolas.backend.security.JwtService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;

    public AuthController(UsuarioRepository usuarioRepository, JwtService jwtService) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public Object login(@RequestBody Usuario datosLogin) {

        Optional<Usuario> usuarioEncontrado =
                usuarioRepository.findByUsuarioAndPasswordAndRol(
                        datosLogin.getUsuario(),
                        datosLogin.getPassword(),
                        datosLogin.getRol()
                );

        if (usuarioEncontrado.isPresent()) {

            Usuario usuario = usuarioEncontrado.get();

            String token = jwtService.generarToken(
                    usuario.getUsuario(),
                    usuario.getRol()
            );

            return Map.of(
                    "success", true,
                    "token", token,
                    "usuario", usuario.getUsuario(),
                    "rol", usuario.getRol(),
                    "mensaje", "Login correcto"
            );
        }

        return Map.of(
                "success", false,
                "mensaje", "Usuario o contraseña incorrectos"
        );
    }
}