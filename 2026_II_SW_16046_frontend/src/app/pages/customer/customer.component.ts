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
import { CustomerService } from '../../services/customer.service';
import { Customer } from '../../model/customer';

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
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.css',
})
export class CustomerComponent {
  protected readonly customerService = inject(CustomerService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Customer>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $customers = this.customerService.$listChange;

  protected displayedColumns: string[] = [
    'documentType',
    'documentNumber',
    'name',
    'email',
    'phoneNumber',
    'actions'
  ];

  constructor() {
    // Carga inicial de clientes desde la API REST
    this.customerService.findAll().subscribe((data) => this.customerService.setListChange(data));

    // Reacción declarativa con Signals para actualizar la fuente de datos
    effect(() => {
      const data = this.$customers();
      const ds = this.$dataSource();
      const p = this.$paginator();
      const s = this.$sort();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    // Notificaciones reactivas mediante SnackBar
    effect(() => {
      const message = this.customerService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        untracked(() => this.customerService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: Event): void {
    const filterValue = (e.target as HTMLInputElement).value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(id: number): void {
    const ok = window.confirm('¿Está seguro de eliminar este cliente?');
    if (ok) {
      this.customerService
        .delete(id)
        .pipe(
          switchMap(() => this.customerService.findAll()),
          tap((data) => this.customerService.setListChange(data)),
          tap(() => this.customerService.setMessageChange('Cliente eliminado con éxito'))
        )
        .subscribe();
    }
  }

  // =========================================================================
  // DEMOSTRACIÓN PEDAGÓGICA: MUTACIÓN SILENCIOSA vs ENFOQUE INMUTABLE REACTIVO
  // =========================================================================

  /**
   * ESCENARIO 1: Con mutación silenciosa (Problemático)
   * En este escenario se muta directamente la propiedad del objeto dentro del arreglo
   * sin generar una nueva referencia en memoria. Como el puntero del arreglo permanece idéntico,
   * el sistema de detección de cambios de Angular (Signals / OnPush) NO detecta el cambio,
   * provocando una mutación "silenciosa" donde los datos cambian pero la interfaz no se actualiza.
   */
  /*
  updateCustomerSilentMutation(updatedCustomer: Customer): void {
    const currentList = this.$dataSource().data;
    const item = currentList.find(c => c.idCustomer === updatedCustomer.idCustomer);
    if (item) {
      // Mutación directa en memoria del mismo objeto referenciado
      item.firstName = updatedCustomer.firstName;
      item.lastName = updatedCustomer.lastName;
      item.email = updatedCustomer.email;
      item.phoneNumber = updatedCustomer.phoneNumber;
      item.address = updatedCustomer.address;
    }
    // La referencia de currentList no cambió, por lo que Signals no emite notificación.
  }
  */

  /**
   * ESCENARIO 2: Mutación silenciosa abordada (Enfoque Inmutable Reactivo)
   * En este escenario se aborda el problema generando una referencia inmutable completamente nueva
   * mediante programación funcional (.map() y spread operator ...).
   * Al emitir un nuevo arreglo con la entidad clonada a través del Signal, Angular detecta
   * la mutación de estado de inmediato y actualiza la vista de forma reactiva y predecible.
   */
  updateCustomerImmutable(updatedCustomer: Customer): void {
    const currentList = this.customerService.$listChange();
    const updatedList = currentList.map((c) =>
      c.idCustomer === updatedCustomer.idCustomer ? { ...c, ...updatedCustomer } : c
    );
    this.customerService.setListChange(updatedList);
  }
}
