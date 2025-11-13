import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Header } from '../header/header';

interface SearchData {
	location: string;
	checkIn: string;
	checkOut: string;
	adults: number;
	children: number;
	rooms: number;
	addFlight: boolean;
}

@Component({
	selector: 'app-hotels',
	imports: [CommonModule, FormsModule, Header],
	templateUrl: './hotels.html',
	styleUrl: './hotels.scss',
})
export class Hotels {
	public searchData: SearchData = {
		location: 'Hyderabad (and vicinity), Telangana, India',
		checkIn: '',
		checkOut: '',
		adults: 2,
		children: 0,
		rooms: 1,
		addFlight: false
	};

	public showTravellersPopup: boolean = false;

	constructor(private router: Router) {
		// Set default dates (today and 2 days later)
		const today = new Date();
		const checkOut = new Date(today);
		checkOut.setDate(checkOut.getDate() + 2);
		this.searchData.checkIn = today.toISOString().split('T')[0];
		this.searchData.checkOut = checkOut.toISOString().split('T')[0];
	}

	public getTravellersText(): string {
		const total = this.searchData.adults + this.searchData.children;
		const roomText = this.searchData.rooms === 1 ? 'room' : 'rooms';
		return `${total} traveller${total > 1 ? 's' : ''}, ${this.searchData.rooms} ${roomText}`;
	}

	public toggleTravellersPopup() {
		this.showTravellersPopup = !this.showTravellersPopup;
	}

	public closeTravellersPopup() {
		this.showTravellersPopup = false;
	}

	public increaseAdults() {
		this.searchData.adults++;
	}

	public decreaseAdults() {
		if (this.searchData.adults > 1) {
			this.searchData.adults--;
		}
	}

	public increaseChildren() {
		this.searchData.children++;
	}

	public decreaseChildren() {
		if (this.searchData.children > 0) {
			this.searchData.children--;
		}
	}

	public searchHotels() {
		// Validate search data
		if (!this.searchData.location || !this.searchData.checkIn || !this.searchData.checkOut) {
			alert('Please fill in all required fields (Location, Check-in, and Check-out dates)');
			return;
		}

		// Validate dates
		const checkIn = new Date(this.searchData.checkIn);
		const checkOut = new Date(this.searchData.checkOut);
		const today = new Date();
		today.setHours(0, 0, 0, 0);

		if (checkIn < today) {
			alert('Check-in date cannot be in the past');
			return;
		}

		if (checkOut <= checkIn) {
			alert('Check-out date must be after check-in date');
			return;
		}

		// Navigate to results page with search params
		this.router.navigate(['/hotels/results'], {
			queryParams: {
				location: this.searchData.location,
				checkIn: this.searchData.checkIn,
				checkOut: this.searchData.checkOut,
				adults: this.searchData.adults,
				children: this.searchData.children,
				rooms: this.searchData.rooms
			}
		}).catch(error => {
			console.error('Navigation error:', error);
			alert('Error navigating to results page. Please try again.');
		});
	}
}
