package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.repository.GuiaAlmacenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GuiaAlmacenService {

    @Autowired
    private GuiaAlmacenRepository repository;

    // READ (Listar todo)
    public List<GuiaAlmacen> listarTodas() {
        return repository.findAll();
    }

    // INSERT (Crear)
    public GuiaAlmacen guardar(GuiaAlmacen guia) {
        return repository.save(guia);
    }

    // UPDATE (Actualizar)
    public GuiaAlmacen actualizar(Long id, GuiaAlmacen datosNuevos) {
        return repository.findById(id).map(guia -> {
            guia.setNroGuia(datosNuevos.getNroGuia());
            guia.setTipoMovimiento(datosNuevos.getTipoMovimiento());
            guia.setEncargado(datosNuevos.getEncargado());
            guia.setMotivo(datosNuevos.getMotivo());
            return repository.save(guia);
        }).orElseThrow(() -> new RuntimeException("Guía de almacén no encontrada con ID: " + id));
    }

    // DELETE (Eliminar)
    public void eliminar(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("No existe la guía con ID: " + id);
        }
        repository.deleteById(id);
    }
}