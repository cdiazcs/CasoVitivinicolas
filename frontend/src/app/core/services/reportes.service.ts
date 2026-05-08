import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Reporte {
  id?: number;
  codigo: string;
  tipo: string;
  periodo: string;
  responsable: string;
  estado: string;
  fecha: string;
  contenido?: string;
  totalIngresos?: number;
  totalEgresos?: number;
  saldoFinal?: number;
  totalProductos?: number;
  productosCriticos?: number;
  totalCuentas?: number;
  saldoTotalCuentas?: number;
  totalGuias?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportesService {
  private apiUrl = 'http://localhost:8080/api/reportes';

  constructor(private http: HttpClient) { }

  generarReporte(tipo: string, responsable: string): Observable<Reporte> {
    return this.http.post<Reporte>(`${this.apiUrl}/generar/${tipo}?responsable=${responsable}`, {});
  }

  obtenerTodos(): Observable<Reporte[]> {
    return this.http.get<Reporte[]>(this.apiUrl);
  }

  eliminarReporte(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}