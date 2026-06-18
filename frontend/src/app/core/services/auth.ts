
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = 'https://casovitivinicolas.onrender.com';

  constructor(private http: HttpClient) {}

  // Envía las credenciales al backend para iniciar sesión.
  login(usuario: string, password: string, rol: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      usuario,
      password,
      rol
    });
  }

  // Guarda los datos de sesión en localStorage.
  guardarSesion(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario);
    localStorage.setItem('rol', data.rol);
  }

  // Devuelve el token guardado si existe.
  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  // Devuelve el usuario guardado si existe.
  obtenerUsuario(): string | null {
    return localStorage.getItem('usuario');
  }

  // Devuelve el rol guardado si existe.
  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  // Comprueba si hay una sesión activa.
  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  // Elimina los datos de sesión almacenados.
  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
  }
}
