import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { switchMap, tap } from 'rxjs';
import { BookingService } from '../../services/booking.service';
import { Booking } from '../../model/booking';

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
    RouterOutlet,
    RouterLink
  ],
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
})
export class BookingComponent {
  protected readonly bookingService = inject(BookingService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Booking>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $bookings = this.bookingService.$listChange;

  protected displayedColumns: string[] = [
    'customerName',
    'roomNumber',
    'fromDate',
    'toDate',
    'details',
    'actions'
  ];

  constructor() {
    this.bookingService.findAll().subscribe((data) => this.bookingService.setListChange(data));

    effect(() => {
      const data = this.$bookings();
      const ds = this.$dataSource();
      const p = this.$paginator();
      const s = this.$sort();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.bookingService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.bookingService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: Event): void {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(id: number): void {
    const ok = window.confirm('¿Está seguro de anular esta reserva?');
    if (ok) {
      this.bookingService
        .delete(id)
        .pipe(
          switchMap(() => this.bookingService.findAll()),
          tap((data) => this.bookingService.setListChange(data)),
          tap(() => this.bookingService.setMessageChange('Reserva eliminada con éxito'))
        )
        .subscribe();
    }
  }
}
