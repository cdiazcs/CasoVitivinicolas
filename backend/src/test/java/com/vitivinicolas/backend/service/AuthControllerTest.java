package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.Usuario;
import com.vitivinicolas.backend.repository.UsuarioRepository;
import com.vitivinicolas.backend.security.JwtService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.vitivinicolas.backend.controller.AuthController;

import java.util.Map;
import java.util.Optional;

public class AuthControllerTest {

    @InjectMocks
    private AuthController authController;

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private JwtService jwtService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        // Inicializa los mocks antes de cada prueba.
        MockitoAnnotations.openMocks(this);
    }

    // ==========================================
    // UNIT TEST PARA CP-IS-LOG-01
    // ==========================================
    @Test
    public void testCP_IS_LOG_01_LoginExitoso() {
        Usuario usuarioBD = new Usuario();
        usuarioBD.setUsuario("admin");
        usuarioBD.setPassword("hashPassword");
        usuarioBD.setRol("admin");

        Usuario datosLogin = new Usuario();
        datosLogin.setUsuario("admin");
        datosLogin.setPassword("admin123");
        datosLogin.setRol("admin");

        Mockito.when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuarioBD));

        Mockito.when(passwordEncoder.matches("admin123", "hashPassword"))
                .thenReturn(true);

        Mockito.when(jwtService.generarToken("admin", "admin"))
                .thenReturn("token-jwt-prueba");

        Map<String, Object> respuesta =
                (Map<String, Object>) authController.login(datosLogin);

        Assertions.assertNotNull(respuesta);
        Assertions.assertEquals(true, respuesta.get("success"));
        Assertions.assertEquals("Login correcto", respuesta.get("mensaje"));
        Assertions.assertEquals("admin", respuesta.get("usuario"));
        Assertions.assertEquals("admin", respuesta.get("rol"));
        Assertions.assertEquals("token-jwt-prueba", respuesta.get("token"));

        Mockito.verify(jwtService, Mockito.times(1))
                .generarToken("admin", "admin");
    }

    // ==========================================
    // UNIT TEST PARA CP-IS-LOG-02
    // ==========================================
    @Test
    public void testCP_IS_LOG_02_PasswordIncorrecta() {
        Usuario usuarioBD = new Usuario();
        usuarioBD.setUsuario("admin");
        usuarioBD.setPassword("hashPassword");
        usuarioBD.setRol("admin");

        Usuario datosLogin = new Usuario();
        datosLogin.setUsuario("admin");
        datosLogin.setPassword("passwordIncorrecta");
        datosLogin.setRol("admin");

        Mockito.when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuarioBD));

        Mockito.when(passwordEncoder.matches("passwordIncorrecta", "hashPassword"))
                .thenReturn(false);

        Map<String, Object> respuesta =
                (Map<String, Object>) authController.login(datosLogin);

        Assertions.assertNotNull(respuesta);
        Assertions.assertEquals(false, respuesta.get("success"));
        Assertions.assertEquals("Usuario o contraseña incorrectos", respuesta.get("mensaje"));

        Mockito.verify(jwtService, Mockito.never())
                .generarToken(Mockito.anyString(), Mockito.anyString());
    }

    // ==========================================
    // UNIT TEST PARA CP-IS-ROL-01
    // ==========================================
    @Test
    public void testCP_IS_ROL_01_RolIncorrecto() {
        Usuario usuarioBD = new Usuario();
        usuarioBD.setUsuario("admin");
        usuarioBD.setPassword("hashPassword");
        usuarioBD.setRol("admin");

        Usuario datosLogin = new Usuario();
        datosLogin.setUsuario("admin");
        datosLogin.setPassword("admin123");
        datosLogin.setRol("dueno");

        Mockito.when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuarioBD));

        Map<String, Object> respuesta =
                (Map<String, Object>) authController.login(datosLogin);

        Assertions.assertNotNull(respuesta);
        Assertions.assertEquals(false, respuesta.get("success"));
        Assertions.assertEquals("Rol incorrecto", respuesta.get("mensaje"));

        Mockito.verify(jwtService, Mockito.never())
                .generarToken(Mockito.anyString(), Mockito.anyString());
    }

    // ==========================================
    // UNIT TEST PARA CP-IS-JWT-01
    // ==========================================
    @Test
    public void testCP_IS_JWT_01_GeneracionTokenJWT() {
        Usuario usuarioBD = new Usuario();
        usuarioBD.setUsuario("admin");
        usuarioBD.setPassword("hashPassword");
        usuarioBD.setRol("admin");

        Usuario datosLogin = new Usuario();
        datosLogin.setUsuario("admin");
        datosLogin.setPassword("admin123");
        datosLogin.setRol("admin");

        Mockito.when(usuarioRepository.findByUsuario("admin"))
                .thenReturn(Optional.of(usuarioBD));

        Mockito.when(passwordEncoder.matches("admin123", "hashPassword"))
                .thenReturn(true);

        Mockito.when(jwtService.generarToken("admin", "admin"))
                .thenReturn("token-jwt-prueba");

        Map<String, Object> respuesta =
                (Map<String, Object>) authController.login(datosLogin);

        Assertions.assertNotNull(respuesta);
        Assertions.assertEquals(true, respuesta.get("success"));
        Assertions.assertNotNull(respuesta.get("token"));
        Assertions.assertEquals("token-jwt-prueba", respuesta.get("token"));
    }
}
