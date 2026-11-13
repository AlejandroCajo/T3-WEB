import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Customer } from '../model/customer';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends GenericSignalService<Customer> {
  protected override url: string = `${environment.HOST}/v1/customers`;
}
