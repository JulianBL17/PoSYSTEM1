import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Proveedores, Proveedor } from '../../services/proveedores';

@Component({
  selector: 'app-proveedores',
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.scss'
})
export class ProveedoresComponent implements OnInit {

  proveedores: Proveedor[] = [];
  proveedor: Proveedor = { nombreEmpresa: '', nombreContacto: '', telefono: '', correo: '' };
  
  editando = false;
  proveedorEditandoId?: number;
  mensaje = '';
  claseAviso: 'alert-success' | 'alert-danger' | 'alert-warning' = 'alert-success';

  constructor(private proveedoresService: Proveedores) {}

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedoresService.obtenerProveedores().subscribe({
      next: (data) => this.proveedores = data,
      error: (error: HttpErrorResponse) => this.mostrarError(error, 'cargar los proveedores')
    });
  }

  guardarProveedor(): void {
    if (!this.proveedor.nombreEmpresa) {
      this.mostrarAviso('El nombre de la empresa es obligatorio.', 'alert-warning');
      return;
    }

    if (this.editando && this.proveedorEditandoId) {
      this.proveedoresService.actualizarProveedor(this.proveedorEditandoId, this.proveedor).subscribe({
        next: () => {
          this.mostrarAviso('Proveedor actualizado correctamente.', 'alert-success');
          this.limpiarFormulario();
          this.cargarProveedores();
        },
        error: (error: HttpErrorResponse) => this.mostrarError(error, 'actualizar el proveedor')
      });
    } else {
      this.proveedoresService.crearProveedor(this.proveedor).subscribe({
        next: () => {
          this.mostrarAviso('Proveedor registrado.', 'alert-success');
          this.limpiarFormulario();
          this.cargarProveedores();
        },
        error: (error: HttpErrorResponse) => this.mostrarError(error, 'registrar el proveedor')
      });
    }
  }

  editarProveedor(prov: Proveedor): void {
    this.proveedor = { ...prov };
    this.editando = true;
    this.proveedorEditandoId = prov.id;
  }

  eliminarProveedor(id?: number): void {
    if (!id || !confirm('¿Estás seguro de eliminar este proveedor?')) return;
    
    this.proveedoresService.eliminarProveedor(id).subscribe({
      next: () => {
        this.mostrarAviso('Proveedor eliminado.', 'alert-success');
        this.cargarProveedores();
      },
      error: (error: HttpErrorResponse) => this.mostrarError(error, 'eliminar el proveedor')
    });
  }

  limpiarFormulario(): void {
    this.proveedor = { nombreEmpresa: '', nombreContacto: '', telefono: '', correo: '' };
    this.editando = false;
    this.proveedorEditandoId = undefined;
  }

  cerrarAviso(): void { this.mensaje = ''; }

  private mostrarAviso(mensaje: string, clase: typeof this.claseAviso): void {
    this.mensaje = mensaje;
    this.claseAviso = clase;
    setTimeout(() => this.mensaje = '', 4000);
  }

  private mostrarError(error: HttpErrorResponse, accion: string): void {
    this.mostrarAviso(`No se pudo ${accion}. Verifica tu conexión.`, 'alert-danger');
  }
}