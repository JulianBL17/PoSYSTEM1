import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

// Reutilizamos la interfaz Producto de tu servicio existente
import { Producto } from './productos';

@Injectable({
  providedIn: 'root'
})
export class StockAlertsService {
  
  // Asume la ruta configurada en tu proxy o enviroment
  private apiUrl = '/api/productos'; 
  
  // Almacena el estado actual de las alertas
  private alertasSubject = new BehaviorSubject<Producto[]>([]);

  // Observable público al que se suscribirá el componente Toast
  public alertas$: Observable<Producto[]> = this.alertasSubject.asObservable();

  constructor(private http: HttpClient) {
    this.iniciarMonitoreo();
  }

  /**
   * Inicia un ciclo de consultas en segundo plano (Polling).
   * Consulta inmediatamente (0) y luego cada 30 segundos (30000 ms).
   */
  private iniciarMonitoreo(): void {
    timer(0, 30000).pipe(
      switchMap(() => this.http.get<Producto[]>(this.apiUrl).pipe(
        // Si falla la petición, devolvemos un arreglo vacío para no romper el timer principal
        catchError(() => of([])) 
      )),
      // Filtramos únicamente los productos cuyo stock es crítico (<= 5)
      map((productos: Producto[]) => productos.filter(p => p.stock <= 5))
    ).subscribe({
      next: (productosBajoStock) => {
        this.alertasSubject.next(productosBajoStock);
      }
    });
  }

  /**
   * Permite forzar una actualización inmediata de las alertas.
   * Útil para llamarlo desde VentasComponent justo después de registrar una venta exitosa.
   */
  public forzarVerificacion(): void {
    this.http.get<Producto[]>(this.apiUrl).pipe(
      map((productos: Producto[]) => productos.filter(p => p.stock <= 5)),
      catchError(() => of([]))
    ).subscribe({
      next: (productosBajoStock) => {
        this.alertasSubject.next(productosBajoStock);
      }
    });
  }
}