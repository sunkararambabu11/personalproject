import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  userName: string = '';

  ngOnInit() {
    // Get user info from localStorage if available
    const token = localStorage.getItem('token');
    if (token) {
      this.userName = 'User';
    }
  }
}

