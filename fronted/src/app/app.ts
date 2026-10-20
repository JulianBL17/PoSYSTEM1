import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    @if (auth.estaAutenticado()) {
      <header class="pos-navbar">
        <nav class="navbar navbar-expand">
          <div class="container-fluid pos-navbar-inner px-3 px-lg-4">
            <a class="pos-brand" routerLink="/ventas" aria-label="POS, ir a ventas">
              <span class="pos-brand-mark"><i class="bi bi-shop"></i></span>
              <span>
                POS
                <span class="pos-brand-caption">Sistema de ventas</span>
              </span>
            </a>

            <div class="navbar-nav pos-nav ms-auto flex-row gap-1">
              <a class="pos-nav-link nav-link px-3 py-2" routerLink="/ventas" routerLinkActive="active">
                <i class="bi bi-receipt"></i> Ventas
              </a>
              <a class="pos-nav-link nav-link px-3 py-2" routerLink="/productos" routerLinkActive="active">
                <i class="bi bi-box-seam"></i> Productos
              </a>
              <a class="pos-nav-link nav-link px-3 py-2" routerLink="/usuarios" routerLinkActive="active">
                <i class="bi bi-people"></i> Usuarios
              </a>
              <span class="d-none d-md-inline-flex align-items-center px-2 text-secondary small">
                <i class="bi bi-person-circle me-1"></i> {{ auth.usuario?.nombre }}
              </span>
              <button type="button" class="pos-nav-link nav-link px-3 py-2 border-0 bg-transparent" (click)="cerrarSesion()">
                <i class="bi bi-box-arrow-right"></i> Salir
              </button>
            </div>
          </div>
        </nav>
      </header>
    }
    <router-outlet />
  `
})
export class App {
  readonly auth = inject(Auth);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
