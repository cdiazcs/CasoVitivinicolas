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
    return this.http.post(this.apiUrl, {
      usuario,
      password,
      rol
    });
  }

  guardarSesion(data: any) {
    localStorage.setItem('usuario', data.usuario);
    localStorage.setItem('rol', data.rol);
  }

  cerrarSesion() {
    localStorage.clear();
  }

  estaLogueado(): boolean {
    return localStorage.getItem('usuario') !== null;
  }
}
