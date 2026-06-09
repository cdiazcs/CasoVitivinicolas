package com.vitivinicolas.backend.controller;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.service.GuiaAlmacenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/guias-almacen")
@CrossOrigin(origins = "*") // Permite que tu Frontend se conecte sin bloqueos de CORS
public class GuiaAlmacenController {

    @Autowired
    private GuiaAlmacenService service;

    // GET: http://localhost:8080/api/guias-almacen
    @GetMapping
    public List<GuiaAlmacen> listar() {
        return service.listarTodas();
    }

    // POST (Insert): http://localhost:8080/api/guias-almacen
    @PostMapping
    public ResponseEntity<GuiaAlmacen> crear(@RequestBody GuiaAlmacen guia) {
        GuiaAlmacen nuevaGuia = service.guardar(guia);
        return ResponseEntity.ok(nuevaGuia);
    }

    // PUT (Update): http://localhost:8080/api/guias-almacen/{id}
    @PutMapping("/{id}")
    public ResponseEntity<GuiaAlmacen> actualizar(@PathVariable Long id, @RequestBody GuiaAlmacen guia) {
        GuiaAlmacen guiaActualizada = service.actualizar(id, guia);
        return ResponseEntity.ok(guiaActualizada);
    }

    // DELETE: http://localhost:8080/api/guias-almacen/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<String> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.ok("Guía eliminada correctamente");
    }
}