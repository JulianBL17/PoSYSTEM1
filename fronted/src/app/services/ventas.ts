import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venta {
  id?: number;
  producto: {
    id: number;
    nombre: string;
  };
  cantidad: number;
  total: number;
  metodoPago: string;
  fecha?: string;
}

export interface NuevaVenta {
  producto: { id: number };
  usuario?: { id: number } | null;
  cantidad: number;
  metodoPago: string;
}

@Injectable({
  providedIn: 'root'
})
export class Ventas {

  private apiUrl = '/api/ventas';

  constructor(private http: HttpClient) {}

  obtenerVentas(): Observable<Venta[]> {
    return this.http.get<Venta[]>(this.apiUrl);
  }

  crearVenta(venta: NuevaVenta): Observable<Venta> {
    return this.http.post<Venta>(
      this.apiUrl,
      venta
    );
  }
}