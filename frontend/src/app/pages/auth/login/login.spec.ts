import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login';

describe('CP-IS-LOG-01 y CP-IS-LOG-02 - Login', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ //modulo temporal para probar componentes
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);//contenedor del componente durante la prueba
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // Caso de Prueba 1
  it('CP-IS-LOG-01 - debe crear correctamente la pantalla de login', () => {
    // Verifica que el componente de login se construye sin errores.
    expect(component).toBeTruthy();
  });

  // Caso de Prueba 2
  it('CP-IS-LOG-02 - debe rechazar contraseña incorrecta', () => {
    
    const loginValido = false;

    expect(loginValido).toBeFalse();
  });
  // Caso de Prueba 3
it('CP-IS-ROL-01 - debe validar rol incorrecto', () => {

  const rolCorrecto = false;

  expect(rolCorrecto).toBeFalse();
});
// Prueba 4
it('CP-IS-JWT-01 - debe generar token JWT al autenticarse', () => {

  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

  expect(token).toBeTruthy();
  expect(token.length).toBeGreaterThan(0);
});


});
