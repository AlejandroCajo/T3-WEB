import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Booking } from '../model/booking';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends GenericSignalService<Booking> {
  protected override url: string = `${environment.HOST}/v1/bookings`;
}
