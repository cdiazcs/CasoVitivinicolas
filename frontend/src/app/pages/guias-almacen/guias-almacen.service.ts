import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// REVISAR: Tiene que decir "export interface" obligatoriamente
export interface GuiaAlmacenBackend {
  id?: number;
  nroGuia: string;
  tipoMovimiento: string;
  encargado: string;
  motivo: string;
  fechaCreacion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GuiasAlmacenService {
 private apiUrl = 'https://casovitivinicolas.onrender.com/api/guias-almacen';

  constructor(private http: HttpClient) {}

  listar(): Observable<GuiaAlmacenBackend[]> {
    return this.http.get<GuiaAlmacenBackend[]>(this.apiUrl);
  }

  crear(guia: GuiaAlmacenBackend): Observable<GuiaAlmacenBackend> {
    return this.http.post<GuiaAlmacenBackend>(this.apiUrl, guia);
  }

  actualizar(id: number, guia: GuiaAlmacenBackend): Observable<GuiaAlmacenBackend> {
    return this.http.put<GuiaAlmacenBackend>(`${this.apiUrl}/${id}`, guia);
  }

  eliminar(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}
