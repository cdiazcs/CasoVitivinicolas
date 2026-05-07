
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginComponent {
  usuario = '';
  password = '';
  rol = '';

  constructor(
    private router: Router,
    private authService: Auth
  ) {}

  login() {
    if (!this.usuario || !this.password || !this.rol) {
      alert('Complete todos los campos');
      return;
    }

    this.authService.login(this.usuario, this.password, this.rol).subscribe({
      next: (resp) => {
        if (resp.success) {
          this.authService.guardarSesion(resp);
          this.router.navigate(['/dashboard']);
        } else {
          alert(resp.mensaje);
        }
      },
      error: () => {
        alert('Error al conectar con el backend');
      }
    });
  }
}
