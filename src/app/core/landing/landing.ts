import { Component } from '@angular/core';
import { Auth } from '../auth/auth';
import { Header } from "../header/header";
import { Hotels } from '../hotels/hotels';

@Component({
  selector: 'app-landing',
  imports: [Header,Hotels],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})

export class Landing {
}