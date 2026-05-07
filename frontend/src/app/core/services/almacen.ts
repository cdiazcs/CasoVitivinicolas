import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  private apiUrl = 'http://localhost:8080/productos';

  constructor(private http: HttpClient) {}

  filtrarStock(marca: string, ubicacion: string) {
    return this.http.get(
      `${this.apiUrl}/filtrar?marca=${marca}&ubicacion=${ubicacion}`
    );
  }

  obtenerProduccionActual() {
    return this.http.get<number>(
      `${this.apiUrl}/produccion-actual`
    );
  }
}
