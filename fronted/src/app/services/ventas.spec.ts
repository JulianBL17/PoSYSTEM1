import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Ventas } from './ventas';

describe('Ventas', () => {
  let service: Ventas;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(Ventas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
