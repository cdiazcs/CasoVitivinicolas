import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { provideRouter } from '@angular/router';

import { CajaComponent } from './caja';
import { CajaService } from '../../core/services/caja';

describe('CajaComponent', () => {
  let component: CajaComponent;
  let fixture: ComponentFixture<CajaComponent>;

  const cajaServiceMock = {
    listarMovimientos: jasmine.createSpy('listarMovimientos').and.returnValue(of([])),
    registrarMovimiento: jasmine.createSpy('registrarMovimiento').and.returnValue(of({})),
    actualizarMovimiento: jasmine.createSpy('actualizarMovimiento').and.returnValue(of({})),
    eliminarMovimiento: jasmine.createSpy('eliminarMovimiento').and.returnValue(of(undefined)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CajaComponent],
      providers: [
        provideRouter([]),
        { provide: CajaService, useValue: cajaServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe calcular totales correctamente', () => {
    component.movimientos = [
      { tipo: 'Depósito', cuenta: 'Caja Principal', monto: 100, fecha: '2026-06-10', motivo: 'Venta' },
      { tipo: 'Retiro', cuenta: 'Caja Principal', monto: 40, fecha: '2026-06-10', motivo: 'Pago' },
    ];

    component.calcularTotales();

    expect(component.totalIngresos).toBe(100);
    expect(component.totalRetiros).toBe(40);
    expect(component.saldoCaja).toBe(60);
  });

  it('debe limpiar el formulario correctamente', () => {
    component.movimiento = {
      tipo: 'Depósito',
      cuenta: 'Caja Principal',
      monto: 200,
      fecha: '2026-06-10',
      motivo: 'Venta',
    };

    component.editando = true;
    component.idEditando = 1;

    component.limpiarFormulario();

    expect(component.movimiento.tipo).toBe('');
    expect(component.movimiento.cuenta).toBe('');
    expect(component.movimiento.monto).toBe(0);
    expect(component.movimiento.fecha).toBe('');
    expect(component.movimiento.motivo).toBe('');
    expect(component.editando).toBeFalse();
    expect(component.idEditando).toBeUndefined();
  });
});
