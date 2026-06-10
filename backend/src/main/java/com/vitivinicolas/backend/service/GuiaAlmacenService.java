package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.GuiaAlmacen;
import com.vitivinicolas.backend.model.Producto;
import com.vitivinicolas.backend.repository.GuiaAlmacenRepository;
import com.vitivinicolas.backend.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class GuiaAlmacenService {

    @Autowired
    private GuiaAlmacenRepository guiaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    public List<GuiaAlmacen> listarTodas() {
        return guiaRepository.findAll();
    }

    @Transactional
    public GuiaAlmacen guardar(GuiaAlmacen guia) {
        // 1. Extraer el nombre del producto de la trama enviada por Angular
        String nombreProducto = extraerDato(guia.getMotivo(), "Prod:");
        int cantidadMovimiento = Integer.parseInt(guia.getEncargado()); // Viene el número mapeado desde Angular

        Producto producto;

        // 2. DETECTAR SI ES PRODUCTO NUEVO O EXISTENTE
        if (guia.getMotivo().contains("Cat:")) {
            // ¡Es un producto nuevo! Lo construimos desde cero (INSERT)
            producto = new Producto();
            producto.setNombre(nombreProducto);
            producto.setCategoria(extraerDato(guia.getMotivo(), "Cat:"));
            producto.setUbicacion(extraerDato(guia.getMotivo(), "Ubic:"));
            
            // Asignar stock inicial
            producto.setStock(cantidadMovimiento);
            
            // Generar un código único aleatorio o correlativo para tu catálogo (Ej: VIN-999)
            String codigoAutogenerado = "VIN-" + String.format("%03d", (int)(Math.random() * 900) + 100);
            producto.setCodigo(codigoAutogenerado);

            // Guardar el nuevo producto en la tabla public.producto
            productoRepository.save(producto);
        } else {
            // ¡Es un producto existente! Lo buscamos en la base de datos (SELECT)
            producto = productoRepository.findByNombre(nombreProducto)
                    .orElseThrow(() -> new RuntimeException("El producto '" + nombreProducto + "' no existe en el inventario."));

            // 3. Modificar el stock sumando o restando (UPDATE)
            if (guia.getTipoMovimiento().equalsIgnoreCase("Compra") || guia.getTipoMovimiento().equalsIgnoreCase("Ingreso")) {
                producto.setStock(producto.getStock() + cantidadMovimiento);
            } else if (guia.getTipoMovimiento().equalsIgnoreCase("Venta") || guia.getTipoMovimiento().equalsIgnoreCase("Salida")) {
                if (producto.getStock() < cantidadMovimiento) {
                    throw new RuntimeException("Stock insuficiente en BD para " + nombreProducto + ". Disponible: " + producto.getStock());
                }
                producto.setStock(producto.getStock() - cantidadMovimiento);
            }
            
            // Guardar cambios del stock en la base de datos
            productoRepository.save(producto);
        }

        // 4. Guardar el historial en la tabla 'guia_almacen'
        return guiaRepository.save(guia);
    }

    @Transactional
    public GuiaAlmacen actualizar(Long id, GuiaAlmacen guiaDetalles) {
        GuiaAlmacen staticGuia = guiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guía no encontrada con id: " + id));
        staticGuia.setNroGuia(guiaDetalles.getNroGuia());
        staticGuia.setTipoMovimiento(guiaDetalles.getTipoMovimiento());
        staticGuia.setEncargado(guiaDetalles.getEncargado());
        staticGuia.setMotivo(guiaDetalles.getMotivo());
        return guiaRepository.save(staticGuia);
    }

    @Transactional
    public void eliminar(Long id) {
        guiaRepository.deleteById(id);
    }

    // Método auxiliar avanzado para limpiar y extraer los datos de la trama ("Prod: X | Cat: Y")
    private String extraerDato(String motivo, String etiqueta) {
        if (motivo == null || !motivo.contains(etiqueta)) return "N/A";
        try {
            String[] partes = motivo.split("\\|");
            for (String parte : partes) {
                if (parte.trim().startsWith(etiqueta)) {
                    return parte.replace(etiqueta, "").trim();
                }
            }
        } catch (Exception e) {
            return "Error al parsear";
        }
        return "N/A";
    }
}