package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.model.Producto;
import com.vitivinicolas.backend.repository.GuiaAlmacenRepository;
import com.vitivinicolas.backend.repository.ProductoRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

public class GuiaAlmacenServiceTest {

    @InjectMocks
    private GuiaAlmacenService guiaAlmacenService;

    @Mock
    private GuiaAlmacenRepository guiaRepository;

    @Mock
    private ProductoRepository productoRepository;

    @BeforeEach
    public void setUp() {
        // Inicializa los mocks antes de cada método de prueba
        MockitoAnnotations.openMocks(this);
    }

    // ==========================================
    // UNIT TEST PARA CP-05
    // ==========================================
    @Test
    public void testCP05_RegistroGuiaIngresoProductoExistente() {
        // 1. ESCENARIO (Precondición: El producto existe con stock de 45)
        Producto productoSimulado = new Producto();
        productoSimulado.setId(1L);
        productoSimulado.setNombre("Malbec Gran Reserva");
        productoSimulado.setStock(45);
        productoSimulado.setCodigo("VIN-001");

        GuiaAlmacen guiaEntrada = new GuiaAlmacen();
        guiaEntrada.setNroGuia("G-001");
        guiaEntrada.setTipoMovimiento("Compra");
        guiaEntrada.setEncargado("15"); // Cantidad a ingresar
        guiaEntrada.setMotivo("Prod: Malbec Gran Reserva | Cant: 15");

        // Simular comportamiento de los Repositorios (Mocks)
        Mockito.when(productoRepository.findByNombre("Malbec Gran Reserva"))
               .thenReturn(Optional.of(productoSimulado));
        Mockito.when(guiaRepository.save(Mockito.any(GuiaAlmacen.class)))
               .thenReturn(guiaEntrada);

        // 2. ACCIÓN
        GuiaAlmacen resultado = guiaAlmacenService.guardar(guiaEntrada);

        // 3. VERIFICACIÓN (QA Assertions)
        Assertions.assertNotNull(resultado);
        // Validamos que la regla aritmética funcionó: 45 + 15 = 60
        Assertions.assertEquals(60, productoSimulado.getStock());
        
        // Verifica que se llamó al guardado en la base de datos
        Mockito.verify(productoRepository, Mockito.times(1)).save(productoSimulado);
    }

    // ==========================================
    // UNIT TEST PARA CP-06
    // ==========================================
    @Test
    public void testCP06_RegistroGuiaSalidaControlStockNegativo() {
        // 1. ESCENARIO (Precondición: Solo hay 15 unidades disponibles)
        Producto productoSimulado = new Producto();
        productoSimulado.setId(9L);
        productoSimulado.setNombre("Sangiovese Italiano");
        productoSimulado.setStock(15);

        GuiaAlmacen guiaEntrada = new GuiaAlmacen();
        guiaEntrada.setNroGuia("G-002");
        guiaEntrada.setTipoMovimiento("Venta");
        guiaEntrada.setEncargado("20"); // Intento de retirar 20 unidades
        guiaEntrada.setMotivo("Prod: Sangiovese Italiano | Cant: 20");

        Mockito.when(productoRepository.findByNombre("Sangiovese Italiano"))
               .thenReturn(Optional.of(productoSimulado));

        // 2. ACCIÓN Y VERIFICACIÓN DE EXCEPCIÓN
        // Verificamos que el sistema explote con una RuntimeException por falta de stock
        RuntimeException excepcion = Assertions.assertThrows(RuntimeException.class, () -> {
            guiaAlmacenService.guardar(guiaEntrada);
        });

        // Validamos que el mensaje del error sea el correcto para el usuario
        Assertions.assertTrue(excepcion.getMessage().contains("Stock insuficiente"));
        
        // Verificamos que el stock se congeló en 15 y JAMÁS bajó a -5
        Assertions.assertEquals(15, productoSimulado.getStock());
        
        // Aseguramos que nunca se guardó un stock corrupto en la base de datos
        Mockito.verify(productoRepository, Mockito.never()).save(Mockito.any(Producto.class));
    }

    // ==========================================
    // UNIT TEST PARA CP-07
    // ==========================================
    @Test
    public void testCP07_AltaEInsercionDinamicaProductoNuevo() {
        // 1. ESCENARIO (Precondición: El producto no existe en el catálogo)
        GuiaAlmacen guiaEntrada = new GuiaAlmacen();
        guiaEntrada.setNroGuia("G-003");
        guiaEntrada.setTipoMovimiento("Compra");
        guiaEntrada.setEncargado("30"); // Stock inicial
        // Trama compuesta idéntica a la que envía tu Angular de forma dinámica
        guiaEntrada.setMotivo("Prod: Merlot Reserva 2026 | Cat: Vino Tinto | Precio: 45.00 | Ubic: Estante B-Z");

        Mockito.when(productoRepository.findByNombre("Merlot Reserva 2026"))
               .thenReturn(Optional.empty()); // Retorna vacío simulando que no existe
        Mockito.when(guiaRepository.save(Mockito.any(GuiaAlmacen.class)))
               .thenReturn(guiaEntrada);

        // 2. ACCIÓN
        GuiaAlmacen resultado = guiaAlmacenService.guardar(guiaEntrada);

        // 3. VERIFICACIÓN
        Assertions.assertNotNull(resultado);
        // Verificamos que el repositorio de productos ejecutó un .save() para insertar el nuevo vino
        Mockito.verify(productoRepository, Mockito.times(1)).save(Mockito.any(Producto.class));
    }

    // ==========================================
    // UNIT TEST PARA CP-08
    // ==========================================
    @Test
    public void testCP08_EliminacionFisicaGuiaAlmacen() {
        // 1. ESCENARIO
        Long idEliminar = 5L;

        // Simulamos que el repositorio borra correctamente por ID sin lanzar errores
        Mockito.doNothing().when(guiaRepository).deleteById(idEliminar);

        // 2. ACCIÓN
        guiaAlmacenService.eliminar(idEliminar);

        // 3. VERIFICACIÓN
        // QA certifica que el servicio invocó de forma correcta el comando de borrado del JPA
        Mockito.verify(guiaRepository, Mockito.times(1)).deleteById(idEliminar);
    }
}