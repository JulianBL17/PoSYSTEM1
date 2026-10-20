import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/auth';
  private readonly claveSesion = 'pos.usuario';

  usuario: UsuarioSesion | null = this.leerSesion();

  login(correo: string, password: string): Observable<UsuarioSesion> {
    return this.http
      .post<UsuarioSesion>(`${this.apiUrl}/login`, { correo, password })
      .pipe(
        tap((usuario) => {
          this.usuario = usuario;
          this.guardarSesion(usuario);
        })
      );
  }

  logout(): void {
    this.usuario = null;
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.claveSesion);
    }
  }

  estaAutenticado(): boolean {
    return this.usuario !== null;
  }

  private guardarSesion(usuario: UsuarioSesion): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.claveSesion, JSON.stringify(usuario));
    }
  }

  private leerSesion(): UsuarioSesion | null {
    if (typeof sessionStorage === 'undefined') {
      return null;
    }
    try {
      const texto = sessionStorage.getItem(this.claveSesion);
      return texto ? (JSON.parse(texto) as UsuarioSesion) : null;
    } catch {
      return null;
    }
  }
}
