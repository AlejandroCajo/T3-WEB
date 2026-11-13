import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { CategoryService } from '../../services/category.service';
import { Room } from '../../model/room';
import { Category } from '../../model/category';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSortModule,
    MatChipsModule,
    RouterOutlet,
    RouterLink
  ],
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent {
  protected readonly roomService = inject(RoomService);
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Room>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected categories = signal<Map<number, string>>(new Map());
  protected $rooms = this.roomService.$listChange;

  protected displayedColumns: string[] = [
    'numeroHabitacion',
    'idCategory',
    'precio',
    'disponibilidad',
    'actions'
  ];

  constructor() {
    // Carga de categorías para mostrar sus nombres en la tabla
    this.categoryService.findAll().subscribe((cats) => {
      const map = new Map<number, string>();
      cats.forEach((c) => map.set(c.idCategory, c.name));
      this.categories.set(map);
    });

    // Carga de habitaciones desde la API REST
    this.roomService.findAll().subscribe((data) => this.roomService.setListChange(data));

    // Reacción declarativa con Signals
    effect(() => {
      const data = this.$rooms();
      const ds = this.$dataSource();
      const p = this.$paginator();
      const s = this.$sort();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    // Notificaciones reactivas
    effect(() => {
      const message = this.roomService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.roomService.setMessageChange(''));
      }
    });
  }

  getCategoryName(idCategory: number): string {
    return this.categories().get(idCategory) || `Cat #${idCategory}`;
  }

  applyFilter(e: Event): void {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(id: number): void {
    const ok = window.confirm('¿Está seguro de eliminar esta habitación?');
    if (ok) {
      this.roomService
        .delete(id)
        .pipe(
          switchMap(() => this.roomService.findAll()),
          tap((data) => this.roomService.setListChange(data)),
          tap(() => this.roomService.setMessageChange('Habitación eliminada con éxito'))
        )
        .subscribe();
    }
  }
}
