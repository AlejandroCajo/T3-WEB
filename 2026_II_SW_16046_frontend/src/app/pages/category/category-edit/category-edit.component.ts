import { Component, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../model/category';
import { C } from '@angular/cdk/keycodes';
import { switchMap, tap } from 'rxjs';

@Component({
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
],
  selector: 'app-category-edit',
  styleUrl: './category-edit.component.css',
  templateUrl: './category-edit.component.html',
})
export class CategoryEditComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly categoryService = inject(CategoryService);

  protected $form = signal(new FormGroup({
    idCategory: new FormControl<number|null>(null),
    name: new FormControl<string>(''),
    description: new FormControl<string>(''),
    status: new FormControl<boolean>(true)
  }));

  private readonly $params = toSignal(this.route.params,{ initialValue: {}});
  protected $id = computed(()=> this.$params()['id']);
  protected $isEdit = computed(() =>  !!this.$id()); // en JS !! es como decirle ¿Existe realmente el dato?

  constructor(){
    effect(() => {
      const id = this.$id();
      if(id){
        this.categoryService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  save(){
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const category: Category = form.value as Category;
    /*const category: Category = new Category()
    category.idCategory = form.value.idCategory;
    category.name = form.value.name; 
    category.description = form.value.description; 
    category.status = form.value.status;*/ 
    
    const operation$ = isEdit ? this.categoryService.update(id, category): this.categoryService.save(category); 

    operation$.pipe(
      switchMap(()=> this.categoryService.findAll()),
      tap(data => this.categoryService.setCategoryChange(data)),
      tap(() => this.categoryService.setMessageChange(isEdit?'UPDATED!':'CREATED!',))

    ).subscribe(() => {
      this.router.navigate(['/pages/category']);
    });
  }
}
