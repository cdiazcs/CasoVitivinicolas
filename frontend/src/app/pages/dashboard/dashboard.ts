import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

type Tema = 'light' | 'dark' | 'system';

interface Modulo {
  nombre: string;
  descripcion: string;
  icono: string;
  ruta: string;
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
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  searchTerm = signal('');
  mostrar = signal(true);
  selected = signal('');
  tema = signal<Tema>((localStorage.getItem('tema') as Tema) || 'light');

  themeMenuOpen = signal(false);
  notifMenuOpen = signal(false);
  userMenuOpen = signal(false);

  produccionActual = 842;
  metaProduccion = 1200;

  modulos: Modulo[] = [
    {
      nombre: 'Caja',
      descripcion: 'Gestión de ingresos y egresos de caja.',
      icono: '💼',
      ruta: '/caja',
    },
    {
      nombre: 'Almacén',
      descripcion: 'Control de inventario y productos.',
      icono: '📦',
      ruta: '/almacen',
    },
    {
      nombre: 'Cuentas Bancarias',
      descripcion: 'Administración de cuentas bancarias.',
      icono: '🏦',
      ruta: '/cuentas-bancarias',
    },
    {
      nombre: 'Guías de Almacén',
      descripcion: 'Registro de movimientos de inventario.',
      icono: '📋',
      ruta: '/guias-almacen',
    },
    {
      nombre: 'Reportes',
      descripcion: 'Generación de reportes empresariales.',
      icono: '📊',
      ruta: '/reportes',
    },
  ];

  notificaciones = signal<Notificacion[]>([
    {
      texto: 'Nuevo lote registrado en bodega N° 12',
      tiempo: 'Hace 5 minutos',
      leida: false,
    },
    {
      texto: 'Venta #0842 requiere aprobación de caja',
      tiempo: 'Hace 23 minutos',
      leida: false,
    },
    {
      texto: 'Stock bajo en insumos: Bentonita',
      tiempo: 'Hace 1 hora',
      leida: false,
    },
    {
      texto: 'Cierre de caja del 01/05/2026 completado',
      tiempo: 'Ayer',
      leida: true,
    },
  ]);

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.aplicarTema(this.tema());

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (this.tema() === 'system') {
          this.aplicarTema('system');
        }
      });
  }

  get porcentajeProduccion(): number {
    return Math.round((this.produccionActual / this.metaProduccion) * 100);
  }

  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value.trim().toLowerCase());
  }

  filteredModulos(): Modulo[] {
    const term = this.searchTerm();

    if (!term) {
      return this.modulos;
    }

    return this.modulos.filter((modulo) =>
      modulo.nombre.toLowerCase().includes(term) ||
      modulo.descripcion.toLowerCase().includes(term)
    );
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

  toggleThemeMenu(): void {
    this.themeMenuOpen.set(!this.themeMenuOpen());
    this.notifMenuOpen.set(false);
    this.userMenuOpen.set(false);
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

    if (tema === 'system') {
      const usarDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.body.classList.add(usarDark ? 'theme-dark' : 'theme-light');

      if (usarDark) {
        document.body.classList.add('dark');
      }

      return;
    }

    document.body.classList.add(tema === 'dark' ? 'theme-dark' : 'theme-light');

    if (tema === 'dark') {
      document.body.classList.add('dark');
    }
  }

  toggleNotifMenu(): void {
    this.notifMenuOpen.set(!this.notifMenuOpen());
    this.themeMenuOpen.set(false);
    this.userMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.userMenuOpen.set(!this.userMenuOpen());
    this.themeMenuOpen.set(false);
    this.notifMenuOpen.set(false);
  }

  notifNoLeidas(): number {
    return this.notificaciones().filter((n) => !n.leida).length;
  }

  marcarTodasLeidas(): void {
    this.notificaciones.update((notifs) =>
      notifs.map((n) => ({
        ...n,
        leida: true,
      }))
    );
  }

  irA(ruta: string): void {
    this.themeMenuOpen.set(false);
    this.notifMenuOpen.set(false);
    this.userMenuOpen.set(false);
    this.router.navigate([ruta]);
  }

  logout(): void {
    localStorage.removeItem('rol');
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
