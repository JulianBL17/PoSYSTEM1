import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  
  // Variables simuladas para las métricas del dashboard
  ventasDelDia: number = 0;
  ticketPromedio: number = 0;
  mesasActivas: number = 0;
  totalMesas: number = 15;
  alertasStock: number = 0;

  ngOnInit(): void {
    this.cargarMetricas();
  }

  cargarMetricas(): void {
    // Aquí a futuro conectarás con un servicio (ej. DashboardService) 
    // para traer los datos reales desde el backend.
    this.ventasDelDia = 1250000;
    this.ticketPromedio = 45000;
    this.mesasActivas = 8;
    this.alertasStock = 3;
  }
}