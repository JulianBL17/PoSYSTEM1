import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Descuento {
  id?: number;
  nombre: string;
  porcentaje: number;
  alcance: string;
  estado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class Descuentos {
  private apiUrl = '/api/descuentos'; 

  constructor(private http: HttpClient) {}

  obtenerDescuentos(): Observable<Descuento[]> {
    return this.http.get<Descuento[]>(this.apiUrl);
  }

  crearDescuento(descuento: Descuento): Observable<Descuento> {
    return this.http.post<Descuento>(this.apiUrl, descuento);
  }

  actualizarDescuento(id: number, descuento: Descuento): Observable<Descuento> {
    return this.http.put<Descuento>(`${this.apiUrl}/${id}`, descuento);
  }

  eliminarDescuento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}