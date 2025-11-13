import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../header/header';

interface GuestData {
	firstName: string;
	lastName: string;
	email: string;
	countryCode: string;
	phone: string;
	marketingEmails: boolean;
	textAlerts: boolean;
}

interface PaymentData {
	cardName: string;
	cardNumber: string;
	expiryMonth: string;
	expiryYear: string;
	securityCode: string;
}

interface SearchParams {
	checkIn: string;
	checkOut: string;
	adults: number;
	children: number;
	rooms: number;
}

interface BookingData {
	price: number;
	taxes: number;
	totalPrice: number;
}

interface Hotel {
	id: string;
	name: string;
	rating: number;
	reviews: number;
	image?: string;
}

interface Room {
	id: string;
	name: string;
}

@Component({
	selector: 'app-checkout',
	imports: [CommonModule, FormsModule, Header],
	templateUrl: './checkout.html',
	styleUrl: './checkout.scss',
})
export class Checkout implements OnInit {
	public hotel: Hotel | null = null;
	public room: Room | null = null;
	public searchParams: SearchParams = {
		checkIn: '',
		checkOut: '',
		adults: 2,
		children: 0,
		rooms: 1
	};
	public bookingData: BookingData = {
		price: 0,
		taxes: 0,
		totalPrice: 0
	};
	public guestData: GuestData = {
		firstName: '',
		lastName: '',
		email: '',
		countryCode: '+91',
		phone: '',
		marketingEmails: true,
		textAlerts: true
	};
	public paymentData: PaymentData = {
		cardName: '',
		cardNumber: '',
		expiryMonth: '',
		expiryYear: '',
		securityCode: ''
	};
	public months: string[] = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
	public years: number[] = [];

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) {
		// Generate years (current year to 10 years ahead)
		const currentYear = new Date().getFullYear();
		for (let i = 0; i < 10; i++) {
			this.years.push(currentYear + i);
		}
	}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.searchParams = {
				checkIn: params['checkIn'] || '',
				checkOut: params['checkOut'] || '',
				adults: +params['adults'] || 2,
				children: +params['children'] || 0,
				rooms: +params['rooms'] || 1
			};

			const price = +params['price'] || 17850;
			const totalPrice = +params['totalPrice'] || 42126;
			const nights = this.calculateNights();
			
			this.bookingData = {
				price: price * nights,
				taxes: totalPrice - (price * nights),
				totalPrice: totalPrice
			};

			this.loadHotel(params['hotelId'] || '1');
			this.loadRoom(params['roomId'] || '1');
		});
	}

	public loadHotel(hotelId: string) {
		this.hotel = {
			id: hotelId,
			name: 'ITC Kakatiya, a Luxury Collection Hotel, Hyderabad',
			rating: 8.4,
			reviews: 260,
			image: 'assets/images/hotel-placeholder.jpg'
		};
	}

	public loadRoom(roomId: string) {
		this.room = {
			id: roomId,
			name: 'Club Room, Non Smoking, Tower'
		};
	}

	public calculateNights(): number {
		if (!this.searchParams.checkIn || !this.searchParams.checkOut) {
			return 1;
		}
		const start = new Date(this.searchParams.checkIn);
		const end = new Date(this.searchParams.checkOut);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays || 1;
	}

	public calculateRewards(): number {
		return Math.round(this.bookingData.totalPrice * 0.01);
	}

	public formatDate(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
	}

	public formatRefundDate(): string {
		if (!this.searchParams.checkIn) return 'check-in date';
		const date = new Date(this.searchParams.checkIn);
		date.setDate(date.getDate() - 1);
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
	}

	public submitBooking() {
		// TODO: Integrate with API
		console.log('Booking submitted:', {
			hotel: this.hotel,
			room: this.room,
			searchParams: this.searchParams,
			bookingData: this.bookingData,
			guestData: this.guestData,
			paymentData: this.paymentData
		});
		alert('Booking confirmed successfully! (API integration pending)');
		// Navigate to confirmation page
		// this.router.navigate(['/hotels/confirmation']);
	}
}

