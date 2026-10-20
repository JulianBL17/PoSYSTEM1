import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import {
  Productos,
  Producto
} from '../../services/productos';

@Component({
  selector: 'app-productos',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './productos.html',
  styleUrl: './productos.scss'
})
export class ProductosComponent implements OnInit {

  productos: Producto[] = [];
  mensaje = '';
  claseAviso: 'alert-success' | 'alert-danger' | 'alert-warning' = 'alert-success';

  producto: Producto = {
    nombre: '',
    precio: 0,
    stock: 0,
    categoria: ''
  };

  editando = false;
  productoEditandoId?: number;

  constructor(
    private productosService: Productos
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productosService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'cargar los productos');
      }
    });
  }

  guardarProducto(): void {

    if (!this.producto.nombre || this.producto.precio <= 0) {
      this.mostrarAviso('Escribe un nombre y un precio mayor que cero.', 'alert-warning');
      return;
    }

    // ACTUALIZAR
    if (this.editando && this.productoEditandoId !== undefined) {

      this.productosService
        .actualizarProducto(
          this.productoEditandoId,
          this.producto
        )
        .subscribe({
          next: () => {
            this.mostrarAviso('Producto actualizado correctamente.', 'alert-success');
            this.limpiarFormulario();
            this.cargarProductos();
          },
          error: (error: HttpErrorResponse) => {
            this.mostrarError(error, 'actualizar el producto');
          }
        });

    } else {

      // CREAR
      this.productosService
        .crearProducto(this.producto)
        .subscribe({
          next: () => {
            this.mostrarAviso('Producto creado y agregado al inventario.', 'alert-success');
            this.limpiarFormulario();
            this.cargarProductos();
          },
          error: (error: HttpErrorResponse) => {
            this.mostrarError(error, 'crear el producto');
          }
        });
    }
  }

  editarProducto(producto: Producto): void {

    this.producto = {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria
    };

    this.editando = true;
    this.productoEditandoId = producto.id;
  }

  eliminarProducto(id?: number): void {

    if (id === undefined) {
      return;
    }

    if (!confirm('¿Está seguro de eliminar este producto?')) {
      return;
    }

    this.productosService
      .eliminarProducto(id)
      .subscribe({
        next: () => {
          this.mostrarAviso('Producto eliminado del inventario.', 'alert-success');
          this.cargarProductos();
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarError(error, 'eliminar el producto');
        }
      });
  }

  limpiarFormulario(): void {

    this.producto = {
      nombre: '',
      precio: 0,
      stock: 0,
      categoria: ''
    };

    this.editando = false;
    this.productoEditandoId = undefined;
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
        ? 'Revisa los datos e inténtalo de nuevo.'
        : error.status === 404
          ? 'No se encontró el registro. Actualiza la lista e inténtalo de nuevo.'
          : 'Inténtalo de nuevo. Si el problema continúa, contacta al administrador.';

    this.mostrarAviso(`No se pudo ${accion}. ${detalle}`, 'alert-danger');
  }
}