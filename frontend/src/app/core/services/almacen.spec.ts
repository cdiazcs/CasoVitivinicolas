import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AlmacenService } from './almacen';

describe('AlmacenService', () => {
  let service: AlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(AlmacenService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});
