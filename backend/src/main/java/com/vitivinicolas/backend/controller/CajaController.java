package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.MovimientoCaja;
import com.vitivinicolas.backend.repository.MovimientoCajaRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/caja")
@CrossOrigin(origins = "http://localhost:4200")
public class CajaController {

    private final MovimientoCajaRepository movimientoCajaRepository;

    public CajaController(MovimientoCajaRepository movimientoCajaRepository) {
        this.movimientoCajaRepository = movimientoCajaRepository;
    }

    @GetMapping
    public List<MovimientoCaja> listarMovimientos() {
        return movimientoCajaRepository.findAll();
    }

    @PostMapping
    public MovimientoCaja registrarMovimiento(@RequestBody MovimientoCaja movimiento) {
        return movimientoCajaRepository.save(movimiento);
    }

    @PutMapping("/{id}")
    public MovimientoCaja actualizarMovimiento(
            @PathVariable Long id,
            @RequestBody MovimientoCaja movimientoActualizado
    ) {
        MovimientoCaja movimiento = movimientoCajaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movimiento no encontrado"));

        movimiento.setTipo(movimientoActualizado.getTipo());
        movimiento.setCuenta(movimientoActualizado.getCuenta());
        movimiento.setMonto(movimientoActualizado.getMonto());
        movimiento.setFecha(movimientoActualizado.getFecha());
        movimiento.setMotivo(movimientoActualizado.getMotivo());

        return movimientoCajaRepository.save(movimiento);
    }

    @DeleteMapping("/{id}")
    public void eliminarMovimiento(@PathVariable Long id) {
        movimientoCajaRepository.deleteById(id);
    }
}