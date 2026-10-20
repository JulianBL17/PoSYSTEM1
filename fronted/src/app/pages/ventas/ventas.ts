import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Auth } from '../../services/auth';
import { Productos, Producto } from '../../services/productos';
import { NuevaVenta, Ventas, Venta } from '../../services/ventas';

@Component({
  selector: 'app-ventas',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './ventas.html',
  styleUrl: './ventas.scss'
})
export class VentasComponent implements OnInit {

  ventas: Venta[] = [];
  productos: Producto[] = [];
  mensaje = '';
  claseAviso: 'alert-success' | 'alert-danger' | 'alert-warning' = 'alert-success';

  venta: NuevaVenta = {
    producto: { id: 0 },
    cantidad: 1,
    metodoPago: ''
  };

  constructor(
    private ventasService: Ventas,
    private productosService: Productos,
    private auth: Auth
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'cargar los productos para la venta');
      }
    });
  }

  cargarVentas(): void {

    this.ventasService
      .obtenerVentas()
      .subscribe({
        next: (data) => {
          this.ventas = data;
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarError(error, 'cargar el historial de ventas');
        }
      });
  }

  guardarVenta(): void {

    if (this.venta.producto.id <= 0 || this.venta.cantidad <= 0 || !this.venta.metodoPago) {
      this.mostrarAviso('Selecciona un producto, indica una cantidad válida y elige el método de pago.', 'alert-warning');
      return;
    }

    const usuario = this.auth.usuario;
    const nuevaVenta: NuevaVenta = {
      ...this.venta,
      usuario: usuario ? { id: usuario.id } : null
    };

    this.ventasService
      .crearVenta(nuevaVenta)
      .subscribe({
        next: () => {
          this.mostrarAviso('Venta registrada correctamente.', 'alert-success');

          this.venta = {
            producto: { id: 0 },
            cantidad: 1,
            metodoPago: ''
          };

          this.cargarVentas();
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarError(error, 'registrar la venta');
        }
      });
  }

  cerrarAviso(): void {
    this.mensaje = '';
  }

  private mostrarAviso(mensaje: string, clase: typeof this.claseAviso): void {
    this.mensaje = mensaje;
    this.claseAviso = clase;
  }

  private mostrarError(error: HttpErrorResponse, accion: string): void {
    const detalle = error.status === 0
      ? 'No hay conexión con el servidor. Verifica que el backend esté activo.'
      : error.status === 400
        ? 'Verifica el producto, la cantidad y el método de pago.'
        : 'Inténtalo de nuevo. Si el problema continúa, contacta al administrador.';

    this.mostrarAviso(`No se pudo ${accion}. ${detalle}`, 'alert-danger');
  }
}