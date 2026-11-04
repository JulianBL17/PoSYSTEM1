import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Descuentos, Descuento } from '../../services/descuentos';

@Component({
  selector: 'app-descuentos',
  imports: [CommonModule, FormsModule],
  templateUrl: './descuentos.html',
  styleUrl: './descuentos.scss'
})
export class DescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];
  
  nuevoDescuento: Descuento = {
    nombre: '',
    porcentaje: 0,
    alcance: 'GLOBAL',
    estado: true
  };

  mensaje = '';
  claseAviso: 'alert-success' | 'alert-danger' | 'alert-warning' = 'alert-success';

  constructor(private descuentosService: Descuentos) {}

  ngOnInit(): void {
    this.cargarDescuentos();
  }

  cargarDescuentos(): void {
    this.descuentosService.obtenerDescuentos().subscribe({
      next: (data) => {
        this.descuentos = data;
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'cargar los descuentos');
      }
    });
  }

  guardarDescuento(): void {
    if (!this.nuevoDescuento.nombre || this.nuevoDescuento.porcentaje <= 0 || this.nuevoDescuento.porcentaje > 100) {
      this.mostrarAviso('Por favor ingresa un nombre y un porcentaje válido (1-100).', 'alert-warning');
      return;
    }

    this.descuentosService.crearDescuento(this.nuevoDescuento).subscribe({
      next: (descuentoCreado) => {
        // Agregamos el nuevo descuento al inicio de la tabla
        this.descuentos.unshift(descuentoCreado);
        this.mostrarAviso('Descuento configurado y guardado correctamente.', 'alert-success');
        
        // Limpiamos el formulario
        this.nuevoDescuento = {
          nombre: '',
          porcentaje: 0,
          alcance: 'GLOBAL',
          estado: true
        };
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'crear el descuento');
      }
    });
  }

  cambiarEstado(descuento: Descuento): void {
    if (descuento.id === undefined) return;

    // Preparamos el objeto con el estado invertido
    const nuevoEstado = !descuento.estado;
    const descuentoActualizado = { ...descuento, estado: nuevoEstado };
    
    this.descuentosService.actualizarDescuento(descuento.id, descuentoActualizado).subscribe({
      next: (data) => {
        // Actualizamos visualmente si el backend responde con éxito
        descuento.estado = data.estado;
        this.mostrarAviso(`El descuento "${descuento.nombre}" ha sido ${descuento.estado ? 'activado' : 'desactivado'}.`, 'alert-success');
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'actualizar el estado del descuento');
        // El checkbox se quedará en su estado anterior gracias a que no hemos modificado `descuento.estado`
      }
    });
  }

  eliminarDescuento(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('¿Estás seguro de eliminar esta promoción permanentemente?')) {
      this.descuentosService.eliminarDescuento(id).subscribe({
        next: () => {
          // Filtramos la lista local para remover el elemento borrado
          this.descuentos = this.descuentos.filter(d => d.id !== id);
          this.mostrarAviso('Descuento eliminado correctamente de la base de datos.', 'alert-success');
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarError(error, 'eliminar el descuento');
        }
      });
    }
  }

  cerrarAviso(): void {
    this.mensaje = '';
  }

  private mostrarAviso(mensaje: string, clase: typeof this.claseAviso): void {
    this.mensaje = mensaje;
    this.claseAviso = clase;
    
    // Ocultar mensaje automáticamente después de 4 segundos
    setTimeout(() => {
      this.mensaje = '';
    }, 4000);
  }

  private mostrarError(error: HttpErrorResponse, accion: string): void {
    const detalle = error.status === 0
      ? 'No hay conexión con el servidor. Verifica que tu backend de Spring Boot esté activo.'
      : 'Revisa tu conexión o inténtalo de nuevo.';
      
    this.mostrarAviso(`No se pudo ${accion}. ${detalle}`, 'alert-danger');
  }
}