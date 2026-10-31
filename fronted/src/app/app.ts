import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { Auth } from './services/auth';
import { StockToastComponent } from './components/stock-toast/stock-toast';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, StockToastComponent],
  template: `
    @if (auth.estaAutenticado()) {
      <header class="pos-navbar shadow-sm">
        <nav class="navbar navbar-expand">
          <div class="container-fluid pos-navbar-inner px-3 px-lg-4">
            <a class="pos-brand" routerLink="/ventas" aria-label="POS, ir a ventas">
              <span class="pos-brand-mark"><i class="bi bi-shop"></i></span>
              <span>
                POS
                <span class="pos-brand-caption">Sistema de ventas</span>
              </span>
            </a>

            <div class="navbar-nav pos-nav ms-auto flex-row gap-1 flex-wrap">
              
              <!-- Menús dinámicos según el Rol -->
              @if (tieneRol(['ADMIN'])) {
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/dashboard" routerLinkActive="active">
                  <i class="bi bi-graph-up"></i> <span class="d-none d-md-inline">Dashboard</span>
                </a>
              }

              @if (tieneRol(['ADMIN', 'MESERO'])) {
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/mesas" routerLinkActive="active">
                  <i class="bi bi-grid-3x3-gap"></i> <span class="d-none d-md-inline">Mesas</span>
                </a>
              }

              @if (tieneRol(['ADMIN', 'CAJERO', 'MESERO'])) {
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/ventas" routerLinkActive="active">
                  <i class="bi bi-receipt"></i> <span class="d-none d-md-inline">Ventas</span>
                </a>
              }

              @if (tieneRol(['ADMIN', 'INVENTARIO'])) {
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/productos" routerLinkActive="active">
                  <i class="bi bi-box-seam"></i> <span class="d-none d-md-inline">Productos</span>
                </a>
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/proveedores" routerLinkActive="active">
                  <i class="bi bi-truck"></i> <span class="d-none d-md-inline">Proveedores</span>
                </a>
              }

              @if (tieneRol(['ADMIN'])) {
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/descuentos" routerLinkActive="active">
                  <i class="bi bi-tags"></i> <span class="d-none d-md-inline">Descuentos</span>
                </a>
                <a class="pos-nav-link nav-link px-2 px-md-3 py-2" routerLink="/usuarios" routerLinkActive="active">
                  <i class="bi bi-people"></i> <span class="d-none d-md-inline">Usuarios</span>
                </a>
              }

              <!-- Perfil y Salida -->
              <span class="d-none d-lg-inline-flex align-items-center px-2 text-secondary small ms-2 border-start">
                <i class="bi bi-person-circle me-1"></i> {{ auth.usuario?.nombre }}
              </span>
              
              <button type="button" class="pos-nav-link nav-link px-2 px-md-3 py-2 border-0 bg-transparent text-danger" (click)="cerrarSesion()" title="Cerrar sesión">
                <i class="bi bi-box-arrow-right"></i> <span class="d-none d-md-inline">Salir</span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <!-- Componente global de Alertas de Stock (Invisible hasta que haya alertas) -->
      <app-stock-toast></app-stock-toast>
    }
    
    <!-- Renderizado principal de las vistas -->
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

  /**
   * Verifica si el usuario actual posee uno de los roles permitidos
   * para mostrar u ocultar opciones en la barra de navegación.
   */
  tieneRol(rolesPermitidos: string[]): boolean {
    const rolUsuario = this.auth.usuario?.rol;
    if (!rolUsuario) return false;
    return rolesPermitidos.includes(rolUsuario);
  }
}