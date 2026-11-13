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
import { CustomerService } from '../../../services/customer.service';
import { Customer } from '../../../model/customer';
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
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrl: './customer-edit.component.css',
})
export class CustomerEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly customerService = inject(CustomerService);

  // Formulario reactivo con validaciones frontend completas
  protected form = new FormGroup({
    idCustomer: new FormControl<number | null>(null),
    documentType: new FormControl<string>('DNI', [Validators.required]),
    documentNumber: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(15),
      Validators.pattern('^[0-9A-Za-z]+$')
    ]),
    firstName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    lastName: new FormControl<string>('', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50)
    ]),
    email: new FormControl<string>('', [
      Validators.required,
      Validators.email,
      Validators.maxLength(70)
    ]),
    address: new FormControl<string>('', [Validators.maxLength(150)]),
    phoneNumber: new FormControl<string>('', [
      Validators.pattern('^[0-9+ -]{6,20}$')
    ])
  });

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.customerService.findById(Number(id)).subscribe({
          next: (data) => this.form.patchValue(data),
          error: () => this.router.navigate(['/pages/customer'])
        });
      }
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const customer = this.form.value as Customer;
    const isEdit = this.$isEdit();
    const id = this.$id();

    const operation$ = isEdit
      ? this.customerService.update(Number(id), customer)
      : this.customerService.save(customer);

    operation$
      .pipe(
        switchMap(() => this.customerService.findAll()),
        tap((data) => this.customerService.setListChange(data)),
        tap(() =>
          this.customerService.setMessageChange(
            isEdit ? 'Cliente actualizado exitosamente' : 'Cliente registrado exitosamente'
          )
        )
      )
      .subscribe({
        next: () => this.router.navigate(['/pages/customer']),
        error: (err) => console.error('Error al guardar cliente', err)
      });
  }
}
