import { Routes } from '@angular/router';
import { Login } from './core/auth/components/login/login';
import { Signup } from './core/auth/components/signup/signup';
import { Landing } from './core/landing/landing';
import { Hotels } from './core/hotels/hotels';
import { HotelResults } from './core/hotels/hotel-results/hotel-results';
import { HotelDetail } from './core/hotels/hotel-detail/hotel-detail';
import { RoomSelection } from './core/hotels/room-selection/room-selection';
import { Checkout } from './core/hotels/checkout/checkout';
import { AuthGuard } from './core/auth/data-access/auth.gaurd';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'hotels', component: Hotels, canActivate: [AuthGuard] },
  { path: 'hotels/results', component: HotelResults, canActivate: [AuthGuard] },
  { path: 'hotels/detail/:id', component: HotelDetail, canActivate: [AuthGuard] },
  { path: 'hotels/rooms/:id', component: RoomSelection, canActivate: [AuthGuard] },
  { path: 'hotels/checkout', component: Checkout, canActivate: [AuthGuard] }
];

