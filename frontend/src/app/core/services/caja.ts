import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MovimientoCaja {
  id?: number;
  tipo: string;
  cuenta: string;
  monto: number;
  fecha: string;
  motivo: string;
}

@Injectable({
  providedIn: 'root',
})
export class CajaService {

  private apiUrl = 'http://localhost:8080/caja';

  constructor(private http: HttpClient) {}

  listarMovimientos(): Observable<MovimientoCaja[]> {
    return this.http.get<MovimientoCaja[]>(this.apiUrl);
  }

  registrarMovimiento(movimiento: MovimientoCaja): Observable<MovimientoCaja> {
    return this.http.post<MovimientoCaja>(this.apiUrl, movimiento);
  }

  actualizarMovimiento(id: number, movimiento: MovimientoCaja): Observable<MovimientoCaja> {
    return this.http.put<MovimientoCaja>(`${this.apiUrl}/${id}`, movimiento);
  }

  eliminarMovimiento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
