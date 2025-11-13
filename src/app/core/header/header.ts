import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public profileOpen: boolean = false;
  public username: string | null = null; // replace with real user when available
  public selectedCurrency: string = 'USD';
  public currencySymbol: string = '$';

  constructor() {}

  public toggleProfileMenu() {
    this.profileOpen = !this.profileOpen;
  }

  onSearch(event: Event, query: string) {
    event.preventDefault();
    const q = (query || '').trim();
    // placeholder: wire to real search logic
    console.log('Header search:', q);
  }

 clearSearch(input: HTMLInputElement) {
    if (input) {
      input.value = '';
      // hide clear button will be handled by component logic or CSS if desired
    }
  }

 onCurrencyChange(value: string) {
    this.selectedCurrency = value;
    switch (value) {
      case 'EUR':
        this.currencySymbol = '€';
        break;
      case 'GBP':
        this.currencySymbol = '£';
        break;
      case 'INR':
        this.currencySymbol = '₹';
        break;
      default:
        this.currencySymbol = '$';
    }
    console.log('Currency changed to', this.selectedCurrency, this.currencySymbol);
  }
}
