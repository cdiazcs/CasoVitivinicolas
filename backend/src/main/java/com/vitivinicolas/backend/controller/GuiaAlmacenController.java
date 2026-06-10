package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.service.GuiaAlmacenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guias-almacen")
@CrossOrigin(origins = "http://localhost:4200") // Permite la comunicación con Angular sin errores de CORS
public class GuiaAlmacenController {

    @Autowired
    private GuiaAlmacenService service;

    @GetMapping
    public List<GuiaAlmacen> listarTodas() {
        return service.listarTodas();
    }

    @PostMapping
    public ResponseEntity<GuiaAlmacen> guardar(@RequestBody GuiaAlmacen guia) {
        GuiaAlmacen nuevaGuia = service.guardar(guia);
        return ResponseEntity.ok(nuevaGuia);
    }

    @PutMapping("/{id}")
    public ResponseEntity<GuiaAlmacen> actualizar(@PathVariable Long id, @RequestBody GuiaAlmacen guia) {
        return ResponseEntity.ok(service.actualizar(id, guia));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}