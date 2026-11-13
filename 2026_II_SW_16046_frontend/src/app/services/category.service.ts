import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Category } from '../model/category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  protected url: string = `${environment.HOST}/v1/categories`;

  private readonly http = inject(HttpClient);
  private readonly _categories = signal<Category[]>([]);
  private readonly _message = signal<string>('');

  readonly $categoriesChange = this._categories.asReadonly();
  readonly $messageChange = this._message.asReadonly();

  findAll() {
    return this.http.get<Category[]>(this.url);
  }

  findById(id: number) {
    return this.http.get<Category>(`${this.url}/${id}`);
  }

  save(category: Category) {
    return this.http.post(this.url, category);
  }

  update(id: number, category: Category) {
    return this.http.put(`${this.url}/${id}`, category);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  setCategoryChange(data: Category[]) {
    this._categories.set(data);
  }

  setMessageChange(msg: string) {
    this._message.set(msg);
  }
}
