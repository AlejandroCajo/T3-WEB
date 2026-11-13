import { CustomerComponent } from './customer/customer.component';
import { CustomerEditComponent } from './customer/customer-edit/customer-edit.component';
import { CategoryComponent } from './category/category.component';
import { CategoryEditComponent } from './category/category-edit/category-edit.component';
import { RoomComponent } from './room/room.component';
import { RoomEditComponent } from './room/room-edit/room-edit.component';
import { BookingComponent } from './booking/booking.component';
import { BookingEditComponent } from './booking/booking-edit/booking-edit.component';

export const pagesRoutes = [
  {
    path: 'category',
    component: CategoryComponent,
    children: [
      { path: 'new', component: CategoryEditComponent },
      { path: 'edit/:id', component: CategoryEditComponent },
    ],
  },
  {
    path: 'room',
    component: RoomComponent,
    children: [
      { path: 'new', component: RoomEditComponent },
      { path: 'edit/:id', component: RoomEditComponent },
    ],
  },
  {
    path: 'customer',
    component: CustomerComponent,
    children: [
      { path: 'new', component: CustomerEditComponent },
      { path: 'edit/:id', component: CustomerEditComponent },
    ],
  },
  {
    path: 'booking',
    component: BookingComponent,
    children: [
      { path: 'new', component: BookingEditComponent },
      { path: 'edit/:id', component: BookingEditComponent },
    ],
  },
];
