import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menus',
  imports: [CommonModule],
  templateUrl: './menus.html',
  styleUrl: './menus.scss',
})
export class Menus {
  public activeMenu: string = 'home';
  public isExpanded: boolean = false;

  public setActiveMenu(menu: string, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.activeMenu = menu;
  }

  public onMouseEnter() {
    this.isExpanded = true;
  }

  public onMouseLeave() {
    this.isExpanded = false;
  }
}
