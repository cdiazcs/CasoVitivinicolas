import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Reportes } from './reportes';
import { ReportesService } from '../../core/services/reportes.service';

describe('Reportes', () => {
  let component: Reportes;
  let fixture: ComponentFixture<Reportes>;

  const reportesMock = [
    {
      id: 1,
      codigo: 'R001',
      tipo: 'Caja',
      periodo: 'Junio 2026',
      responsable: 'Administrador',
      estado: 'Generado',
      fecha: '2026-06-10',
      fechaCreacion: '2026-06-10',
      totalIngresos: 1000,
      totalEgresos: 400,
      saldoFinal: 600,
    },
    {
      id: 2,
      codigo: 'R002',
      tipo: 'Almacén',
      periodo: 'Junio 2026',
      responsable: 'Administrador',
      estado: 'Pendiente',
      fecha: '2026-06-10',
      fechaCreacion: '2026-06-10',
    },
  ];

  const reportesServiceMock = {
    obtenerTodos: jasmine.createSpy('obtenerTodos').and.returnValue(of(reportesMock)),
    generarReporte: jasmine.createSpy('generarReporte').and.returnValue(of(reportesMock[0])),
    eliminarReporte: jasmine.createSpy('eliminarReporte').and.returnValue(of(undefined)),
  };

  beforeEach(async () => {
    spyOn(window, 'alert').and.stub();
    spyOn(window, 'confirm').and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [Reportes],
      providers: [
        provideRouter([]),
        { provide: ReportesService, useValue: reportesServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Reportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar reportes correctamente', () => {
    expect(component.reportes.length).toBe(2);
    expect(component.reportesFiltrados.length).toBe(2);
  });

  it('debe filtrar reportes por tipo', () => {
    component.filtroTipo = 'Caja';
    component.aplicarFiltro();

    expect(component.reportesFiltrados.length).toBe(1);
    expect(component.reportesFiltrados[0].tipo).toBe('Caja');
  });

  it('debe limpiar el filtro', () => {
    component.filtroTipo = 'Caja';
    component.aplicarFiltro();

    component.limpiarFiltro();

    expect(component.filtroTipo).toBe('');
    expect(component.reportesFiltrados.length).toBe(2);
  });

  it('debe calcular totales de reportes', () => {
    expect(component.totalReportes).toBe(2);
    expect(component.generados).toBe(1);
    expect(component.pendientes).toBe(1);
  });

  it('debe generar un reporte', () => {
    component.generarReporte('Caja');

    expect(reportesServiceMock.generarReporte).toHaveBeenCalledWith(
      'Caja',
      'Administrador'
    );
  });

  it('debe eliminar un reporte', () => {
    component.eliminarReporte(1);

    expect(reportesServiceMock.eliminarReporte).toHaveBeenCalledWith(1);
  });
});
