import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

/**
 * Protege las rutas verificando que el rol del usuario logueado
 * coincida con los roles permitidos definidos en la ruta.
 */
export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  // Obtenemos el arreglo de roles permitidos desde el atributo data de la ruta
  const rolesPermitidos = route.data['roles'] as Array<string>;
  const usuario = auth.usuario;

  // Si no hay roles definidos en la ruta, se permite el acceso por defecto
  if (!rolesPermitidos || rolesPermitidos.length === 0) {
    return true;
  }

  // Si hay un usuario activo y su rol está dentro de los permitidos, conceder acceso
  if (usuario && rolesPermitidos.includes(usuario.rol)) {
    return true;
  }

  // Si el usuario no tiene los permisos suficientes, se bloquea la navegación
  // y se redirige a la raíz para que las rutas por defecto lo reubiquen
  // de manera segura, evitando bucles de redirección.
  return router.createUrlTree(['/']); 
};