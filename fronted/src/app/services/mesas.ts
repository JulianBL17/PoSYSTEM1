import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Mesa {
  id?: number;
  numero: string;
  capacidad: number;
  estado: 'LIBRE' | 'OCUPADA' | 'LIMPIEZA';
  totalConsumo?: number;
}

@Injectable({
  providedIn: 'root'
})
export class Mesas {
  private apiUrl = '/api/mesas'; 

  constructor(private http: HttpClient) {}

  obtenerMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(this.apiUrl);
  }

  crearMesa(mesa: Mesa): Observable<Mesa> {
    return this.http.post<Mesa>(this.apiUrl, mesa);
  }

  cambiarEstado(id: number, estado: string): Observable<Mesa> {
    return this.http.put<Mesa>(`${this.apiUrl}/${id}/estado?nuevoEstado=${estado}`, {});
  }

  eliminarMesa(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}