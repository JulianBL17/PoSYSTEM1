import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { Usuarios, Usuario } from '../../services/usuarios';

@Component({
  selector: 'app-usuarios',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  mensaje = '';
  claseAviso: 'alert-success' | 'alert-danger' | 'alert-warning' = 'alert-success';

  usuario: Usuario = {
    nombre: '',
    correo: '',
    rol: '',
    password: ''
  };

  editando = false;
  usuarioEditandoId?: number;

  constructor(
    private usuariosService: Usuarios
  ) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'cargar los usuarios');
      }
    });
  }

  guardarUsuario(): void {

    if (!this.usuario.nombre || !this.usuario.correo) {
      this.mostrarAviso('Completa el nombre y el correo electrónico del usuario.', 'alert-warning');
      return;
    }

    if (!this.editando && !this.usuario.password) {
      this.mostrarAviso('Escribe una contraseña para el nuevo usuario.', 'alert-warning');
      return;
    }

    if (this.editando && this.usuarioEditandoId !== undefined) {

      this.usuariosService
        .actualizarUsuario(
          this.usuarioEditandoId,
          this.usuario
        )
        .subscribe({
          next: () => {
            this.mostrarAviso('Usuario actualizado correctamente.', 'alert-success');
            this.limpiarFormulario();
            this.cargarUsuarios();
          },
          error: (error: HttpErrorResponse) => {
            this.mostrarError(error, 'actualizar el usuario');
          }
        });

    } else {

      this.usuariosService
        .crearUsuario(this.usuario)
        .subscribe({
          next: () => {
            this.mostrarAviso('Usuario creado correctamente.', 'alert-success');
            this.limpiarFormulario();
            this.cargarUsuarios();
          },
          error: (error: HttpErrorResponse) => {
            this.mostrarError(error, 'crear el usuario');
          }
        });
    }
  }

  editarUsuario(usuario: Usuario): void {

    this.usuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      password: ''   // el servidor nunca la devuelve; vacío = conservar la actual
    };

    this.editando = true;
    this.usuarioEditandoId = usuario.id;
  }

  eliminarUsuario(id?: number): void {

    if (id === undefined) return;

    if (!confirm('¿Deseas eliminar este usuario? Esta acción no se puede deshacer.')) return;

    this.usuariosService
      .eliminarUsuario(id)
      .subscribe({
        next: () => {
          this.mostrarAviso('Usuario eliminado correctamente.', 'alert-success');
          this.cargarUsuarios();
        },
        error: (error: HttpErrorResponse) => {
          this.mostrarError(error, 'eliminar el usuario');
        }
      });
  }

  limpiarFormulario(): void {

    this.usuario = {
      nombre: '',
      correo: '',
      rol: '',
      password: ''
    };

    this.editando = false;
    this.usuarioEditandoId = undefined;
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
        : error.status === 409
          ? 'Ya existe un usuario con ese correo electrónico.'
        : error.status === 404
          ? 'No se encontró el usuario. Actualiza la lista e inténtalo de nuevo.'
          : 'Inténtalo de nuevo. Si el problema continúa, contacta al administrador.';

    this.mostrarAviso(`No se pudo ${accion}. ${detalle}`, 'alert-danger');
  }
}