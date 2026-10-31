import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockAlertsService } from '../../services/stock-alerts.service';
import { Producto } from '../../services/productos';

@Component({
  selector: 'app-stock-toast',
  imports: [CommonModule],
  styles: [`
    .toast-container { 
      position: fixed; 
      bottom: 20px; 
      right: 20px; 
      z-index: 1055; 
    }
    .toast {
      transition: opacity 0.3s ease-in-out;
    }
  `],
  template: `
    <div class="toast-container">
      <div *ngFor="let prod of alertas" class="toast show bg-danger text-white mb-2 shadow" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header bg-danger text-white border-bottom border-light">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          <strong class="me-auto">Alerta de Stock</strong>
        </div>
        <div class="toast-body">
          El producto <strong>{{ prod.nombre }}</strong> está por agotarse. Stock actual: <strong>{{ prod.stock }}</strong>.
        </div>
      </div>
    </div>
  `
})
export class StockToastComponent implements OnInit {
  alertas: Producto[] = [];

  constructor(private stockAlerts: StockAlertsService) {}

  ngOnInit(): void {
    // Se suscribe al observable del servicio para reaccionar en tiempo real
    this.stockAlerts.alertas$.subscribe(data => {
      this.alertas = data;
    });
  }
}