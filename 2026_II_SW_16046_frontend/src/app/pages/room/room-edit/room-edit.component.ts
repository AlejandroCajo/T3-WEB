import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../services/room.service';
import { CategoryService } from '../../../services/category.service';
import { Room } from '../../../model/room';
import { Category } from '../../../model/category';
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
    MatSlideToggleModule,
    RouterLink
  ],
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrl: './room-edit.component.css',
})
export class RoomEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roomService = inject(RoomService);
  private readonly categoryService = inject(CategoryService);

  // Lista de categorías disponibles para el selector
  protected categories = signal<Category[]>([]);

  // Formulario reactivo con validaciones frontend
  protected form = new FormGroup({
    idRoom: new FormControl<number | null>(null),
    numeroHabitacion: new FormControl<string>('', [
      Validators.required,
      Validators.maxLength(10)
    ]),
    precio: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(0.01)
    ]),
    idCategory: new FormControl<number | null>(null, [
      Validators.required
    ]),
    disponibilidad: new FormControl<boolean>(true, [
      Validators.required
    ])
  });

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    // Carga de categorías para el dropdown
    this.categoryService.findAll().subscribe((data) => this.categories.set(data));

    // Si es modo edición, carga la información de la habitación
    effect(() => {
      const id = this.$id();
      if (id) {
        this.roomService.findById(Number(id)).subscribe({
          next: (data) => this.form.patchValue(data),
          error: () => this.router.navigate(['/pages/room'])
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const room = this.form.value as Room;
    const isEdit = this.$isEdit();
    const id = this.$id();

    const operation$ = isEdit
      ? this.roomService.update(Number(id), room)
      : this.roomService.save(room);

    operation$
      .pipe(
        switchMap(() => this.roomService.findAll()),
        tap((data) => this.roomService.setListChange(data)),
        tap(() =>
          this.roomService.setMessageChange(
            isEdit ? 'Habitación actualizada exitosamente' : 'Habitación registrada exitosamente'
          )
        )
      )
      .subscribe({
        next: () => this.router.navigate(['/pages/room']),
        error: (err) => console.error('Error al guardar habitación', err)
      });
  }
}
