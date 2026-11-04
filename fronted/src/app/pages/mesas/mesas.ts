import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { Mesas, Mesa } from '../../services/mesas';

@Component({
  selector: 'app-mesas',
  imports: [CommonModule, FormsModule],
  templateUrl: './mesas.html',
  styleUrl: './mesas.scss'
})
export class MesasComponent implements OnInit {

  mesas: Mesa[] = [];
  mesaSeleccionada: Mesa | null = null;
  
  constructor(private mesasService: Mesas) {}

  ngOnInit(): void {
    this.cargarMesas();
  }

  cargarMesas(): void {
    this.mesasService.obtenerMesas().subscribe({
      next: (data) => {
        this.mesas = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error al cargar mesas', error);
        alert('No se pudo conectar con el servidor para cargar las mesas.');
      }
    });
  }

  seleccionarMesa(mesa: Mesa): void {
    // Clonamos el objeto para evitar modificar la lista directamente sin confirmar
    this.mesaSeleccionada = { ...mesa };
  }

  cerrarDetalle(): void {
    this.mesaSeleccionada = null;
  }

  cambiarEstado(nuevoEstado: 'LIBRE' | 'OCUPADA' | 'LIMPIEZA'): void {
    if (this.mesaSeleccionada && this.mesaSeleccionada.id) {
      
      this.mesasService.cambiarEstado(this.mesaSeleccionada.id, nuevoEstado).subscribe({
        next: (mesaActualizada) => {
          // Buscamos la mesa en nuestra lista local y la reemplazamos con los datos del backend
          const index = this.mesas.findIndex(m => m.id === mesaActualizada.id);
          if (index !== -1) {
            this.mesas[index] = mesaActualizada;
          }
          this.cerrarDetalle();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error al cambiar el estado de la mesa', error);
          alert('No se pudo actualizar el estado de la mesa en la base de datos.');
        }
      });
    }
  }
}