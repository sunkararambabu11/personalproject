import { Component } from '@angular/core';
import { Login } from '../auth/components/login/login';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [Login, RouterModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
}