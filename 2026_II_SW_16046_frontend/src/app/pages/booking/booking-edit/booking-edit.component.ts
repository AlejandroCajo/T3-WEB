import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../services/booking.service';
import { CustomerService } from '../../../services/customer.service';
import { RoomService } from '../../../services/room.service';
import { Booking } from '../../../model/booking';
import { Customer } from '../../../model/customer';
import { Room } from '../../../model/room';
import { switchMap, tap } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink
  ],
  selector: 'app-booking-edit',
  templateUrl: './booking-edit.component.html',
  styleUrl: './booking-edit.component.css',
})
export class BookingEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookingService = inject(BookingService);
  private readonly customerService = inject(CustomerService);
  private readonly roomService = inject(RoomService);

  protected customers = signal<Customer[]>([]);
  protected rooms = signal<Room[]>([]);

  protected form = new FormGroup({
    idBooking: new FormControl<number | null>(null),
    idCustomer: new FormControl<number | null>(null, [Validators.required]),
    idRoom: new FormControl<number | null>(null, [Validators.required]),
    fromDate: new FormControl<string>('', [Validators.required]),
    toDate: new FormControl<string>('', [Validators.required]),
    details: new FormControl<string>('')
  });

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.customerService.findAll().subscribe((data) => this.customers.set(data));
    this.roomService.findAll().subscribe((data) => this.rooms.set(data));

    effect(() => {
      const id = this.$id();
      if (id) {
        this.bookingService.findById(Number(id)).subscribe({
          next: (data) => this.form.patchValue(data),
          error: () => this.router.navigate(['/pages/booking'])
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const booking = this.form.value as Booking;
    const isEdit = this.$isEdit();
    const id = this.$id();

    const operation$ = isEdit
      ? this.bookingService.update(Number(id), booking)
      : this.bookingService.save(booking);

    operation$
      .pipe(
        switchMap(() => this.bookingService.findAll()),
        tap((data) => this.bookingService.setListChange(data)),
        tap(() =>
          this.bookingService.setMessageChange(
            isEdit ? 'Reserva actualizada exitosamente' : 'Reserva creada exitosamente'
          )
        )
      )
      .subscribe({
        next: () => this.router.navigate(['/pages/booking']),
        error: (err) => console.error('Error al guardar reserva', err)
      });
  }
}
