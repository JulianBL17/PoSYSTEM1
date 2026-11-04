import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

import { LoginComponent } from './pages/login/login';
import { ProductosComponent } from './pages/productos/productos';
import { UsuariosComponent } from './pages/usuarios/usuarios';
import { VentasComponent } from './pages/ventas/ventas';

// Importaciones de los nuevos componentes a crear
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MesasComponent } from './pages/mesas/mesas';
import { DescuentosComponent } from './pages/descuentos/descuentos';
import { ProveedoresComponent } from './pages/proveedores/proveedores';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent, 
    canActivate: [guestGuard] 
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'descuentos', 
    component: DescuentosComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] }
  },
  { 
    path: 'productos', 
    component: ProductosComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] }
  },
  { 
    path: 'proveedores', 
    component: ProveedoresComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'INVENTARIO'] }
  },
  { 
    path: 'mesas', 
    component: MesasComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'MESERO'] }
  },
  { 
    path: 'ventas', 
    component: VentasComponent, 
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN', 'CAJERO', 'MESERO'] }
  },
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];