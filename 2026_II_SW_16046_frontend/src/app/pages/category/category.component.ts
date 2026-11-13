import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CategoryService } from '../../services/category.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Category } from '../../model/category';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';

@Component({
  imports: [
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
  selector: 'app-category',
  styleUrl: './category.component.css',
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly snackBar = inject(MatSnackBar);

  //protected $categories = toSignal<Category[]>(this.categoryService.findAll());
  protected $dataSource = signal(new MatTableDataSource<Category>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected $categories = this.categoryService.$categoriesChange;

  protected displayedColumns: string[] = ["name", "description", "status", "actions"];
  
  constructor(){
    this.categoryService.findAll().subscribe(data => this.categoryService.setCategoryChange(data));
    effect(() => {
      const data = this.$categories();
      const ds = this.$dataSource();
      const p = this.$paginator();
      const s = this.$sort();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(()=> {
      const message= this.categoryService.$messageChange();
      if(message){
        this.snackBar.open(message, 'INFO', {
          duration: 2000, horizontalPosition: 'right',verticalPosition:'top'
        });
        untracked(() => this.categoryService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any){
    const filerValue =e.target.value;
    this.$dataSource().filter = filerValue.trim().toLowerCase();
  }

  delete(id: number){
    const ok= window.confirm('¿Estás seguro?');
    if (ok){
      this.categoryService.delete(id)
      .pipe(
            switchMap(()=> this.categoryService.findAll()),
            tap(data => this.categoryService.setCategoryChange(data)),
            tap(() => this.categoryService.setMessageChange('DELETED!'))
      ).subscribe()      
    }
  }
  /*
  protected readonly categoryService = inject(CategoryService);
  protected categories: Category[] = [];

  ngOnInit():void{
    this.categoryService.findAll().subscribe(data=>console.log(data));
    // this.categoryService.findAll().subscribe( data => this.categories=data);
  }
    */
}
