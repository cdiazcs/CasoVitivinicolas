import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

type Tema = 'light' | 'dark' | 'system';

interface Modulo {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
  roles: string[];
}

interface Notificacion {
  texto: string;
  tiempo: string;
  leida: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
})
export class Dashboard implements OnInit {
  searchTerm = signal('');
  mostrar = signal(true);
  selected = signal('');
  tema = signal<Tema>((localStorage.getItem('tema') as Tema) || 'light');

  rolUsuario = localStorage.getItem('rol') || '';
  usuario = localStorage.getItem('usuario') || '';

  themeMenuOpen = signal(false);
  notifMenuOpen = signal(false);
  userMenuOpen = signal(false);

  produccionActual = 842;
  metaProduccion = 1200;

  notificaciones: Notificacion[] = [
    { texto: 'Tienes una nueva orden pendiente', tiempo: 'Hace 10 min', leida: false },
    { texto: 'El inventario de vino tinto está bajo', tiempo: 'Hace 1 h', leida: true },
    { texto: 'Reporte mensual disponible', tiempo: 'Ayer', leida: false },
  ];

  get porcentajeProduccion(): number {
    return Math.round((this.produccionActual / this.metaProduccion) * 100);
  }

  modulos: Modulo[] = [
    {
      nombre: 'Caja',
      descripcion: 'Gestión de ingresos y egresos de caja.',
      icono: '💼',
      ruta: '/caja',
      roles: ['dueno'],
    },
    {
      nombre: 'Almacén',
      descripcion: 'Control de inventario y productos.',
      icono: '📦',
      ruta: '/almacen',
      roles: ['admin', 'dueno'],
    },
    {
      nombre: 'Cuentas Bancarias',
      descripcion: 'Administración de cuentas bancarias.',
      icono: '🏦',
      ruta: '/cuentas-bancarias',
      roles: ['dueno'],
    },
    {
      nombre: 'Guías de Almacén',
      descripcion: 'Registro de movimientos de inventario.',
      icono: '📋',
      ruta: '/guias-almacen',
      roles: ['admin', 'dueno'],
    },
    {
      nombre: 'Reportes',
      descripcion: 'Generación de reportes empresariales.',
      icono: '📊',
      ruta: '/reportes',
      roles: ['admin', 'dueno'],
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.aplicarTema(this.tema());
  }

  puedeVerModulo(modulo: Modulo): boolean {
    return modulo.roles.includes(this.rolUsuario);
  }

  modulosPorRol(): Modulo[] {
    return this.modulos.filter((modulo) => this.puedeVerModulo(modulo));
  }

  filteredModulos(): Modulo[] {
    const term = this.searchTerm();

    return this.modulosPorRol().filter((modulo) =>
      !term ||
      modulo.nombre.toLowerCase().includes(term) ||
      modulo.descripcion.toLowerCase().includes(term)
    );
  }

  esDueno(): boolean {
    return this.rolUsuario === 'dueno';
  }

  esAdmin(): boolean {
    return this.rolUsuario === 'admin';
  }

  get nombreRol(): string {
    if (this.rolUsuario === 'dueno') return 'Dueño';
    if (this.rolUsuario === 'admin') return 'Administrador';
    return 'Usuario';
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.trim().toLowerCase());
  }

  activarModulos(): void {
    this.mostrar.set(!this.mostrar());
  }

  mostrarModulos(): boolean {
    return this.mostrar();
  }

  selectModulo(nombre: string): void {
    this.selected.set(nombre);
  }

  moduloSeleccionado(): string {
    return this.selected();
  }

  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.router.navigate(['/login']);
  }

  cambiarTemaDirecto(tema: Tema): void {
    this.tema.set(tema);
    localStorage.setItem('tema', tema);
    this.aplicarTema(tema);
    this.themeMenuOpen.set(false);
  }

  temaIcono(): string {
    if (this.tema() === 'dark') return '🌙';
    if (this.tema() === 'system') return '🖥️';
    return '☀️';
  }

  aplicarTema(tema: Tema): void {
    document.body.classList.remove('theme-light', 'theme-dark', 'dark');
    document.body.classList.add(tema === 'dark' ? 'theme-dark' : 'theme-light');

    if (tema === 'dark') {
      document.body.classList.add('dark');
    }
  }

  toggleThemeMenu(): void {
    this.themeMenuOpen.set(!this.themeMenuOpen());
  }

  notifNoLeidas(): number {
    return 3;
  }

  marcarTodasLeidas(): void {}
}
