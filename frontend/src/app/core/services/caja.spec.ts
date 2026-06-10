import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CajaService } from './caja';

describe('CajaService', () => {
  let service: CajaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    service = TestBed.inject(CajaService);
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });
});
