import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  private auth = inject(Auth);
  private router = inject(Router);

  email = '';
  password = '';
  cargando = false;
  error = '';

  iniciarSesion(): void {

    if (!this.email || !this.password) {
      this.error = 'Ingrese el correo y la contraseña.';
      return;
    }

    this.cargando = true;
    this.error = '';

    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/ventas']);
      },
      error: (err) => {
        this.cargando = false;
        this.error = err.status === 401
          ? 'Correo o contraseña incorrectos.'
          : 'No se pudo conectar con el servidor. Verifica que el backend esté activo.';
      }
    });
  }
}
