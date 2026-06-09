package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.GuiaAlmacen; // <-- Corregido al paquete .model
import com.vitivinicolas.backend.model.Producto;    // <-- Corregido al paquete .model
import com.vitivinicolas.backend.repository.GuiaAlmacenRepository;
import com.vitivinicolas.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GuiaAlmacenService {

    @Autowired
    private GuiaAlmacenRepository guiaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    // Métodos que el controlador necesita obligatoriamente para compilar:

    public List<GuiaAlmacen> listarTodas() {
        return guiaRepository.findAll();
    }

    @Transactional
    public GuiaAlmacen guardar(GuiaAlmacen guia) {
        // 1. Extrae el nombre del producto (ej: "Malbec Gran Reserva") desde el campo motivo de la guía
        String nombreProducto = extraerNombreProducto(guia.getMotivo()); 
        
        // 2. Busca el producto en la tabla 'producto'
        Producto producto = productoRepository.findByNombre(nombreProducto)
                .orElseThrow(() -> new RuntimeException("El producto no existe: " + nombreProducto));

        // 3. Obtiene la cantidad enviada desde Angular (usando la variable 'encargado' que mapea el número)
        int cantidadMovimiento = Integer.parseInt(guia.getEncargado());

        // 4. Modifica el stock en base al tipo de guía
        if (guia.getTipoMovimiento().equalsIgnoreCase("Compra") || guia.getTipoMovimiento().equalsIgnoreCase("Ingreso")) {
            producto.setStock(producto.getStock() + cantidadMovimiento);
        } else if (guia.getTipoMovimiento().equalsIgnoreCase("Venta") || guia.getTipoMovimiento().equalsIgnoreCase("Salida")) {
            if (producto.getStock() < cantidadMovimiento) {
                throw new RuntimeException("Stock insuficiente para la venta de: " + nombreProducto);
            }
            producto.setStock(producto.getStock() - cantidadMovimiento);
        }

        // 5. Guarda el nuevo stock en la tabla 'producto'
        productoRepository.save(producto);

        // 6. Guarda el historial en la tabla 'guia_almacen'
        return guiaRepository.save(guia);
    }

    @Transactional
    public GuiaAlmacen actualizar(Long id, GuiaAlmacen guiaDetalles) {
        GuiaAlmacen guia = guiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada con id: " + id));
        
        guia.setNroGuia(guiaDetalles.getNroGuia());
        guia.setTipoMovimiento(guiaDetalles.getTipoMovimiento());
        guia.setEncargado(guiaDetalles.getEncargado());
        guia.setMotivo(guiaDetalles.getMotivo());
        
        return guiaRepository.save(guia);
    }

    @Transactional
    public void eliminar(Long id) {
        guiaRepository.deleteById(id);
    }

    // Método de soporte para limpiar el texto enviado por Angular ("Prod: Malbec | Cant: 23")
    private String extraerNombreProducto(String motivo) {
        if (motivo != null && motivo.contains("Prod:")) {
            try {
                String parteProd = motivo.split("\\|")[0];
                return parteProd.replace("Prod:", "").trim();
            } catch (Exception e) {
                return motivo;
            }
        }
        return motivo;
    }
}