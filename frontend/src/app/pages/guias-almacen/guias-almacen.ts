import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { GuiasAlmacenService, GuiaAlmacenBackend } from './guias-almacen.service';

@Component({
  selector: 'app-guias-almacen',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, HttpClientModule],
  templateUrl: './guias-almacen.html',
  styleUrl: './guias-almacen.scss',
  providers: [GuiasAlmacenService]
})
export class GuiasAlmacen implements OnInit {
  // Objeto enlazado al formulario de registro
  formulario = {  
    tipo: '',
    producto: '',
    cantidad: 0,
    origen: '',
    destino: '',
    observacion: ''
  };

  // Lista dinámica vinculada a la base de datos
  guias: GuiaAlmacenBackend[] = [];

  constructor(private guiasService: GuiasAlmacenService) {}

  ngOnInit(): void {
    this.cargarGuias();
  }

  cargarGuias(): void {
    this.guiasService.listar().subscribe({
      next: (data) => {
        this.guias = data;
      },
      error: (err) => console.error('Error al recuperar guías desde el backend:', err)
    });
  }

  // Contadores calculados reactivamente desde la base de datos
  get totalGuias(): number {
    return this.guias.length;
  }

  get totalCompras(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Compra' || g.tipoMovimiento === 'INGRESO').length;
  }

  get totalVentas(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Venta' || g.tipoMovimiento === 'SALIDA').length;
  }

  get totalTraslados(): number {
    return this.guias.filter(g => g.tipoMovimiento === 'Traslado').length;
  }

  registrarGuia(): void {
    if (!this.formulario.tipo || !this.formulario.producto || !this.formulario.cantidad) {
      alert('Por favor, complete los campos obligatorios.');
      return;
    }

    // Generar un correlativo para nroGuia (Ej: G-005)
    const proximoCodigo = 'G-' + String(this.guias.length + 1).padStart(3, '0');
    
    // Mapear la estructura para emparejar los campos requeridos por el Backend
    const nuevaGuia: GuiaAlmacenBackend = {
      nroGuia: proximoCodigo,
      tipoMovimiento: this.formulario.tipo,
      encargado: 'Operador Almacén', // Dinámico o asignado por sesión
      motivo: `Prod: ${this.formulario.producto} | Cant: ${this.formulario.cantidad} | De: ${this.formulario.origen || 'N/A'} a ${this.formulario.destino || 'N/A'} | Obs: ${this.formulario.observacion || 'Ninguna'}`
    };

    this.guiasService.crear(nuevaGuia).subscribe({
      next: () => {
        this.cargarGuias(); // Refresca la tabla automáticamente
        this.limpiarFormulario();
      },
      error: (err) => alert('Error al insertar el registro en la base de datos')
    });
  }

  eliminarGuia(id: number | undefined): void {
    if (!id) return;
    
    if (confirm('¿Está seguro de que desea eliminar permanentemente esta guía del almacén?')) {
      this.guiasService.eliminar(id).subscribe({
        next: () => {
          this.cargarGuias(); // Recarga la lista desde Postgres
        },
        error: (err) => console.error('Error al ejecutar el borrado:', err)
      });
    }
  }

  private limpiarFormulario(): void {
    this.formulario = {
      tipo: '',
      producto: '',
      cantidad: 0,
      origen: '',
      destino: '',
      observacion: ''
    };
  }
}