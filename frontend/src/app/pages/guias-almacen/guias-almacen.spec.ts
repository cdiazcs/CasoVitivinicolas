import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuiasAlmacen } from './guias-almacen';
import { GuiasAlmacenService } from './guias-almacen.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GuiasAlmacen (Pruebas Unitarias)', () => {
  let component: GuiasAlmacen;
  let fixture: ComponentFixture<GuiasAlmacen>;
  let guiasServiceMock: any;

  beforeEach(async () => {
    // Definimos un mock simple y directo para el servicio
    guiasServiceMock = {
      listar: () => of([{ id: 1, nroGuia: 'G-001', tipoMovimiento: 'Compra', encargado: '10', motivo: 'Prod: Cabernet' }]),
      crear: (guia: any) => of({ id: 2, nroGuia: 'G-002', tipoMovimiento: 'Compra', encargado: '15', motivo: '' }),
      eliminar: (id: number) => of('Registro removido con éxito')
    };

    await TestBed.configureTestingModule({
      imports: [GuiasAlmacen, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: GuiasAlmacenService, useValue: guiasServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GuiasAlmacen);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta ngOnInit
  });

  it('Debería instanciar el componente de guías de almacén', () => {
    expect(component).toBeTruthy();
  });

  // 🧪 CASO CP-05
  it('CP-05: Debería procesar la guía de ingreso para un producto existente', () => {
    component.esProductoNuevo = false;
    component.formulario = {
      tipo: 'Compra',
      producto: 'Malbec Gran Reserva',
      cantidad: 15,
      origen: 'Almacén Central',
      destino: 'Cava Principal',
      observacion: 'Reponer Stock',
      categoria: 'Tintos',
      precio: 0,
      ubicacion: 'Cava Principal'
    };

    spyOn(guiasServiceMock, 'crear').and.callThrough();
    component.registrarGuia();
    expect(guiasServiceMock.crear).toHaveBeenCalled();
  });

  // 🧪 CASO CP-06
  it('CP-06: Debería lanzar una alerta ante un error de Stock insuficiente', () => {
    spyOn(guiasServiceMock, 'crear').and.returnValue(throwError(() => new Error('Stock insuficiente')));
    spyOn(window, 'alert');

    component.registrarGuia();
    expect(window.alert).toHaveBeenCalledWith('Error al procesar el movimiento en la base de datos.');
  });
});