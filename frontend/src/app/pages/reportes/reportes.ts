import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReportesService, Reporte } from '../../core/services/reportes.service';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './reportes.html',
  styleUrl: './reportes.scss',
})
export class Reportes implements OnInit {
  filtroTipo = '';
  reportes: Reporte[] = [];
  reportesFiltrados: Reporte[] = [];

  constructor(
    private reportesService: ReportesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarReportes();
  }

  cargarReportes() {
    this.reportesService.obtenerTodos().subscribe({
      next: (data) => {
        console.log('Reportes cargados:', data);
        this.reportes = data;
        this.aplicarFiltro();
      },
      error: (error) => {
        console.error('Error al cargar reportes:', error);
      }
    });
  }

  aplicarFiltro() {
    console.log('Aplicando filtro. Tipo actual:', this.filtroTipo);
    if (!this.filtroTipo || this.filtroTipo === '') {
      this.reportesFiltrados = [...this.reportes];
    } else {
      this.reportesFiltrados = this.reportes.filter(r => r.tipo === this.filtroTipo);
    }
    console.log('Reportes filtrados:', this.reportesFiltrados.length);
    this.cdr.detectChanges();
  }

  onFiltroChange() {
    console.log('Filtro cambio a:', this.filtroTipo);
    this.aplicarFiltro();
  }

  get totalReportes() {
    return this.reportes.length;
  }

  get generados() {
    return this.reportes.filter(r => r.estado === 'Generado').length;
  }

  get pendientes() {
    return this.reportes.filter(r => r.estado === 'Pendiente').length;
  }

  generarReporte(tipo: string) {
    console.log('Generando reporte de tipo:', tipo);
    const responsable = 'Administrador';
    
    this.reportesService.generarReporte(tipo, responsable).subscribe({
      next: (nuevoReporte) => {
        console.log('Reporte generado:', nuevoReporte);
        this.cargarReportes();
        alert('Reporte de ' + tipo + ' generado exitosamente');
      },
      error: (error) => {
        console.error('Error al generar reporte:', error);
        alert('Error al generar reporte de ' + tipo);
      }
    });
  }

  limpiarFiltro() {
    console.log('=== LIMPIANDO FILTRO ===');
    console.log('Filtro antes de limpiar:', this.filtroTipo);
    
    // Limpiar el filtro
    this.filtroTipo = '';
    
    // Aplicar filtro para mostrar todos
    this.aplicarFiltro();
    
    // Forzar actualización adicional
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 100);
    
    console.log('Filtro despues de limpiar:', this.filtroTipo);
    console.log('Total reportes a mostrar:', this.reportesFiltrados.length);
  }

  eliminarReporte(id: number) {
    if (confirm('Eliminar este reporte?')) {
      this.reportesService.eliminarReporte(id).subscribe({
        next: () => {
          this.cargarReportes();
          alert('Reporte eliminado');
        },
        error: (error) => {
          console.error('Error:', error);
          alert('Error al eliminar');
        }
      });
    }
  }
}