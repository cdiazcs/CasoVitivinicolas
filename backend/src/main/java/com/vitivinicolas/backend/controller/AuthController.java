package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.Usuario;
import com.vitivinicolas.backend.repository.UsuarioRepository;
import com.vitivinicolas.backend.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, 
                          JwtService jwtService,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public Object login(@RequestBody Usuario datosLogin) {

        System.out.println("=== LOGIN INTENTADO ===");
        System.out.println("Usuario: " + datosLogin.getUsuario());
        System.out.println("Rol: " + datosLogin.getRol());
        System.out.println("Password: " + datosLogin.getPassword());

        Optional<Usuario> usuarioEncontrado = usuarioRepository.findByUsuario(datosLogin.getUsuario());

        if (usuarioEncontrado.isPresent()) {
            Usuario usuario = usuarioEncontrado.get();
            System.out.println("Usuario encontrado en BD: " + usuario.getUsuario());
            System.out.println("Rol en BD: " + usuario.getRol());
            System.out.println("Hash en BD: " + usuario.getPassword());
            
            if (!usuario.getRol().equals(datosLogin.getRol())) {
                System.out.println("ERROR: Rol no coincide");
                return Map.of("success", false, "mensaje", "Rol incorrecto");
            }
            
            boolean passwordMatch = passwordEncoder.matches(datosLogin.getPassword(), usuario.getPassword());
            System.out.println("¿Password coincide? " + passwordMatch);
            
            if (passwordMatch) {
                String token = jwtService.generarToken(usuario.getUsuario(), usuario.getRol());
                return Map.of(
                        "success", true,
                        "token", token,
                        "usuario", usuario.getUsuario(),
                        "rol", usuario.getRol(),
                        "mensaje", "Login correcto"
                );
            } else {
                System.out.println("ERROR: Password no coincide con el hash");
            }
        } else {
            System.out.println("ERROR: Usuario no encontrado: " + datosLogin.getUsuario());
        }

        return Map.of("success", false, "mensaje", "Usuario o contraseña incorrectos");
    }
}