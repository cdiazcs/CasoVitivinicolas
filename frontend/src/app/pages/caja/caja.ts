import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { CajaService, MovimientoCaja } from '../../core/services/caja';

@Component({
  selector: 'app-caja',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './caja.html',
  styleUrl: './caja.scss',
})
export class CajaComponent implements OnInit {

  movimientos: MovimientoCaja[] = [];

  movimiento: MovimientoCaja = {
    tipo: '',
    cuenta: '',
    monto: 0,
    fecha: '',
    motivo: ''
  };

  editando = false;
  idEditando?: number;

  totalIngresos = 0;
  totalRetiros = 0;
  saldoCaja = 0;

  constructor(private cajaService: CajaService) {}

  ngOnInit(): void {
    this.cargarMovimientos();
  }

  cargarMovimientos(): void {
    this.cajaService.listarMovimientos().subscribe({
      next: (data) => {
        this.movimientos = data;
        this.calcularTotales();
      },
      error: () => {
        alert('Error al cargar movimientos');
      }
    });
  }

  calcularTotales(): void {
    this.totalIngresos = this.movimientos
      .filter(m => m.tipo === 'Depósito')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    this.totalRetiros = this.movimientos
      .filter(m => m.tipo === 'Retiro')
      .reduce((sum, m) => sum + Number(m.monto), 0);

    this.saldoCaja = this.totalIngresos - this.totalRetiros;
  }

  registrarMovimiento(): void {
    if (
      !this.movimiento.tipo ||
      !this.movimiento.cuenta ||
      !this.movimiento.monto ||
      !this.movimiento.fecha ||
      !this.movimiento.motivo
    ) {
      alert('Complete todos los campos');
      return;
    }

    if (this.editando && this.idEditando) {
      this.actualizarMovimiento();
      return;
    }

    this.cajaService.registrarMovimiento(this.movimiento).subscribe({
      next: () => {
        alert('Movimiento registrado correctamente');
        this.limpiarFormulario();
        this.cargarMovimientos();
      },
      error: () => {
        alert('Error al registrar movimiento');
      }
    });
  }

  seleccionarMovimiento(item: MovimientoCaja): void {
    this.editando = true;
    this.idEditando = item.id;

    this.movimiento = {
      tipo: item.tipo,
      cuenta: item.cuenta,
      monto: item.monto,
      fecha: item.fecha,
      motivo: item.motivo
    };
  }

  actualizarMovimiento(): void {
    if (!this.idEditando) return;

    this.cajaService.actualizarMovimiento(
      this.idEditando,
      this.movimiento
    ).subscribe({
      next: () => {
        alert('Movimiento actualizado correctamente');
        this.limpiarFormulario();
        this.cargarMovimientos();
      },
      error: () => {
        alert('Error al actualizar movimiento');
      }
    });
  }

  eliminarMovimiento(id?: number): void {
    if (!id) return;

    const confirmar = confirm('¿Seguro que deseas eliminar este movimiento?');
    if (!confirmar) return;

    this.cajaService.eliminarMovimiento(id).subscribe({
      next: () => {
        alert('Movimiento eliminado');
        this.cargarMovimientos();
      },
      error: () => {
        alert('Error al eliminar movimiento');
      }
    });
  }

  limpiarFormulario(): void {
    this.movimiento = {
      tipo: '',
      cuenta: '',
      monto: 0,
      fecha: '',
      motivo: ''
    };

    this.editando = false;
    this.idEditando = undefined;
  }
}
