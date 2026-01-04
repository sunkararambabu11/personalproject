import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menus',
  imports: [CommonModule, RouterModule],
  templateUrl: './menus.html',
  styleUrl: './menus.scss',
})
export class Menus {
  public activeMenu: string = 'home';
  public isExpanded: boolean = false;

  constructor(private router: Router) {}

  public setActiveMenu(menu: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeMenu = menu;
  }

  public navigateTo(route: string, menu: string) {
    this.activeMenu = menu;
    this.router.navigate([route]);
  }

  public onMouseEnter() {
    this.isExpanded = true;
  }

  public onMouseLeave() {
    this.isExpanded = false;
  }

  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
