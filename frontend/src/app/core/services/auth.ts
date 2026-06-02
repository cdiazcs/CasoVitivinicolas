
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) {}

  login(usuario: string, password: string, rol: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      usuario,
      password,
      rol
    });
  }

  guardarSesion(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', data.usuario);
    localStorage.setItem('rol', data.rol);
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenerUsuario(): string | null {
    return localStorage.getItem('usuario');
  }

  obtenerRol(): string | null {
    return localStorage.getItem('rol');
  }

  estaLogueado(): boolean {
    return localStorage.getItem('token') !== null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
  }
}