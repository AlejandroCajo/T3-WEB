import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Room } from '../model/room';
import { GenericSignalService } from './generic-signal.service';

@Injectable({
  providedIn: 'root'
})
export class RoomService extends GenericSignalService<Room> {
  protected override url: string = `${environment.HOST}/v1/rooms`;
}
