package com.vitivinicolas.backend.service;

import com.vitivinicolas.backend.model.*;
import com.vitivinicolas.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ReporteService {
    
    @Autowired
    private ReporteRepository reporteRepository;
    
    @Autowired
    private MovimientoCajaRepository movimientoCajaRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private CuentaBancariaRepository cuentaBancariaRepository;
    
    public Reporte generarReporte(String tipo, String responsable) {
        System.out.println("=== SERVICE: Generando reporte ===");
        System.out.println("Tipo recibido: " + tipo);
        
        Reporte reporte = new Reporte();
        reporte.setCodigo(generarCodigo());
        reporte.setTipo(tipo);
        reporte.setPeriodo(getPeriodoActual());
        reporte.setResponsable(responsable);
        reporte.setEstado("Generado");
        reporte.setFecha(LocalDate.now());
        
        switch (tipo) {
            case "Caja":
                System.out.println("Ejecutando reporte de CAJA");
                generarReporteCaja(reporte);
                break;
            case "Almacen":
                System.out.println("Ejecutando reporte de ALMACEN");
                generarReporteAlmacen(reporte);
                break;
            case "Cuentas":
                System.out.println("Ejecutando reporte de CUENTAS");
                generarReporteCuentas(reporte);
                break;
            case "Guias":
                System.out.println("Ejecutando reporte de GUIAS");
                generarReporteGuias(reporte);
                break;
            default:
                System.out.println("Tipo no reconocido: " + tipo);
                break;
        }
        
        Reporte saved = reporteRepository.save(reporte);
        System.out.println("Reporte guardado con ID: " + saved.getId() + " y tipo: " + saved.getTipo());
        return saved;
    }
    
    private void generarReporteCaja(Reporte reporte) {
        List<MovimientoCaja> movimientos = movimientoCajaRepository.findAll();
        System.out.println("Movimientos encontrados: " + movimientos.size());
        
        Double totalIngresos = movimientos.stream()
                .filter(m -> "Deposito".equals(m.getTipo()))
                .mapToDouble(m -> m.getMonto().doubleValue())
                .sum();
        
        Double totalEgresos = movimientos.stream()
                .filter(m -> "Retiro".equals(m.getTipo()))
                .mapToDouble(m -> m.getMonto().doubleValue())
                .sum();
        
        System.out.println("Total Ingresos: " + totalIngresos);
        System.out.println("Total Egresos: " + totalEgresos);
        
        reporte.setTotalIngresos(totalIngresos);
        reporte.setTotalEgresos(totalEgresos);
        reporte.setSaldoFinal(totalIngresos - totalEgresos);
        
        String contenido = String.format(
            "REPORTE DE CAJA\nPeriodo: %s\nTotal Ingresos: $%.2f\nTotal Egresos: $%.2f\nSaldo Final: $%.2f\nTotal Movimientos: %d",
            reporte.getPeriodo(), totalIngresos, totalEgresos, reporte.getSaldoFinal(), movimientos.size()
        );
        reporte.setContenido(contenido);
    }
    
    private void generarReporteAlmacen(Reporte reporte) {
        List<Producto> productos = productoRepository.findAll();
        System.out.println("Productos encontrados: " + productos.size());
        
        Integer totalProductos = productos.size();
        
        Integer productosCriticos = (int) productos.stream()
                .filter(p -> p.getStock() < 10)
                .count();
        
        System.out.println("Productos criticos: " + productosCriticos);
        
        reporte.setTotalProductos(totalProductos);
        reporte.setProductosCriticos(productosCriticos);
        
        String contenido = String.format(
            "REPORTE DE ALMACEN\nPeriodo: %s\nTotal Productos: %d\nProductos con stock critico (<10): %d",
            reporte.getPeriodo(), totalProductos, productosCriticos
        );
        reporte.setContenido(contenido);
    }
    
    private void generarReporteCuentas(Reporte reporte) {
        List<CuentaBancaria> cuentas = cuentaBancariaRepository.findAll();
        System.out.println("Cuentas encontradas: " + cuentas.size());
        
        Integer totalCuentas = cuentas.size();
        
        Double saldoTotal = cuentas.stream()
                .mapToDouble(c -> c.getSaldo().doubleValue())
                .sum();
        
        System.out.println("Saldo total: " + saldoTotal);
        
        reporte.setTotalCuentas(totalCuentas);
        reporte.setSaldoTotalCuentas(saldoTotal);
        
        String contenido = String.format(
            "REPORTE DE CUENTAS BANCARIAS\nPeriodo: %s\nTotal Cuentas: %d\nSaldo Total: $%.2f",
            reporte.getPeriodo(), totalCuentas, saldoTotal
        );
        reporte.setContenido(contenido);
    }
    
    private void generarReporteGuias(Reporte reporte) {
        List<MovimientoCaja> movimientos = movimientoCajaRepository.findAll();
        List<Producto> productos = productoRepository.findAll();
        
        Integer totalGuias = movimientos.size();
        reporte.setTotalGuias(totalGuias);
        
        System.out.println("Total guias: " + totalGuias);
        
        String contenido = String.format(
            "REPORTE DE GUIAS\nPeriodo: %s\nTotal Guias Registradas: %d\nMovimientos: %d\nProductos en Inventario: %d",
            reporte.getPeriodo(), totalGuias, movimientos.size(), productos.size()
        );
        reporte.setContenido(contenido);
    }
    
    private String generarCodigo() {
        long count = reporteRepository.count() + 1;
        return String.format("R%03d", count);
    }
    
    private String getPeriodoActual() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy"));
    }
    
    public List<Reporte> getAllReportes() {
        return reporteRepository.findAllByOrderByFechaDesc();
    }
    
    public void eliminarReporte(Long id) {
        reporteRepository.deleteById(id);
    }
}