import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { Productos } from './productos';

describe('Productos', () => {
  let service: Productos;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });
    service = TestBed.inject(Productos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
