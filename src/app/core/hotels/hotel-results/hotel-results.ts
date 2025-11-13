import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../header/header';

interface Hotel {
	id: string;
	name: string;
	location: string;
	price: number;
	totalPrice: number;
	rating: number;
	image?: string;
	features: string[];
	freeCancellation: boolean;
	reviews?: number;
	isWishlisted?: boolean;
	isAd?: boolean;
	availability?: number;
}

interface SearchParams {
	location: string;
	checkIn: string;
	checkOut: string;
	adults: number;
	children: number;
	rooms: number;
}

@Component({
	selector: 'app-hotel-results',
	imports: [CommonModule, FormsModule, Header],
	templateUrl: './hotel-results.html',
	styleUrl: './hotel-results.scss',
})
export class HotelResults implements OnInit {
	public searchParams: SearchParams = {
		location: '',
		checkIn: '',
		checkOut: '',
		adults: 2,
		children: 0,
		rooms: 1
	};

	public activeTab: string = 'hotels';
	public sortBy: string = 'recommended';
	public compareMode: boolean = false;

	public filters = {
		hitecCity: false,
		breakfast: false,
		freeCancellation: false,
		pool: false,
		wifi: false
	};

	public hotels: Hotel[] = [];
	public filteredHotels: Hotel[] = [];
	public showTravellersPopup: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		this.route.queryParams.subscribe(params => {
			this.searchParams = {
				location: params['location'] || 'Hyderabad',
				checkIn: params['checkIn'] || '',
				checkOut: params['checkOut'] || '',
				adults: +params['adults'] || 2,
				children: +params['children'] || 0,
				rooms: +params['rooms'] || 1
			};
			this.loadHotels();
		});
	}

	public loadHotels() {
		// Sample hotel data
		this.hotels = [
			{
				id: '1',
				name: 'Hilton Hyderabad Genome Valley Resort & Spa',
				location: 'Shamirpet',
				price: 18500,
				totalPrice: 43660,
				rating: 8.6,
				features: ['Pool', 'Spa', 'Restaurant', 'Free WiFi'],
				freeCancellation: true,
				reviews: 245,
				isWishlisted: false,
				isAd: true,
				availability: 5
			},
			{
				id: '2',
				name: 'ITC Kakatiya, a Luxury Collection Hotel, Hyderabad',
				location: 'Begumpet',
				price: 17850,
				totalPrice: 42126,
				rating: 8.4,
				features: ['Pool', 'Spa', 'Fine Dining', 'Free WiFi'],
				freeCancellation: true,
				reviews: 260,
				isWishlisted: false,
				availability: 5
			},
			{
				id: '3',
				name: 'Park Hyatt Hyderabad',
				location: 'Banjara Hills',
				price: 22000,
				totalPrice: 52000,
				rating: 9.2,
				features: ['Pool', 'Gym', 'Restaurant', 'Free WiFi'],
				freeCancellation: true,
				reviews: 189,
				isWishlisted: false
			},
			{
				id: '4',
				name: 'Novotel Hyderabad Convention Centre',
				location: 'HITEC City',
				price: 15000,
				totalPrice: 35400,
				rating: 7.8,
				features: ['Pool', 'Business Center', 'Restaurant', 'Free WiFi'],
				freeCancellation: false,
				reviews: 312,
				isWishlisted: false
			},
			{
				id: '5',
				name: 'Taj Krishna Hyderabad',
				location: 'Banjara Hills',
				price: 25000,
				totalPrice: 59000,
				rating: 9.0,
				features: ['Pool', 'Spa', 'Fine Dining', 'Free WiFi'],
				freeCancellation: true,
				reviews: 421,
				isWishlisted: false
			}
		];
		this.applyFilters();
	}

	public setActiveTab(tab: string) {
		this.activeTab = tab;
		this.applyFilters();
	}

	public applyFilters() {
		let filtered = [...this.hotels];

		// Filter by tab
		if (this.activeTab === 'hotels') {
			// Only hotels (no homes)
		} else if (this.activeTab === 'homes') {
			// Only homes (for now, return empty or filter differently)
			filtered = [];
		}

		// Apply other filters
		if (this.filters.hitecCity) {
			filtered = filtered.filter(h => h.location.includes('HITEC City'));
		}
		if (this.filters.breakfast) {
			filtered = filtered.filter(h => h.features.includes('Breakfast'));
		}
		if (this.filters.freeCancellation) {
			filtered = filtered.filter(h => h.freeCancellation);
		}
		if (this.filters.pool) {
			filtered = filtered.filter(h => h.features.includes('Pool'));
		}
		if (this.filters.wifi) {
			filtered = filtered.filter(h => h.features.includes('Free WiFi'));
		}

		// Sort
		if (this.sortBy === 'price-low') {
			filtered.sort((a, b) => a.price - b.price);
		} else if (this.sortBy === 'price-high') {
			filtered.sort((a, b) => b.price - a.price);
		} else if (this.sortBy === 'rating') {
			filtered.sort((a, b) => b.rating - a.rating);
		}

		this.filteredHotels = filtered;
	}

	public viewHotelDetails(hotel: Hotel) {
		this.router.navigate(['/hotels/detail', hotel.id], {
			queryParams: {
				checkIn: this.searchParams.checkIn,
				checkOut: this.searchParams.checkOut,
				adults: this.searchParams.adults,
				children: this.searchParams.children,
				rooms: this.searchParams.rooms
			}
		});
	}

	public toggleWishlist(hotelId: string, event: Event) {
		event.stopPropagation();
		const hotel = this.hotels.find(h => h.id === hotelId);
		if (hotel) {
			hotel.isWishlisted = !hotel.isWishlisted;
		}
	}

	public editSearch() {
		this.router.navigate(['/hotels']);
	}

	public searchHotels() {
		// Re-search with updated params
		this.router.navigate(['/hotels/results'], {
			queryParams: {
				location: this.searchParams.location,
				checkIn: this.searchParams.checkIn,
				checkOut: this.searchParams.checkOut,
				adults: this.searchParams.adults,
				children: this.searchParams.children,
				rooms: this.searchParams.rooms
			}
		});
	}

	public toggleTravellersPopup() {
		this.showTravellersPopup = !this.showTravellersPopup;
	}

	public closeTravellersPopup() {
		this.showTravellersPopup = false;
	}

	public increaseAdults() {
		this.searchParams.adults++;
	}

	public decreaseAdults() {
		if (this.searchParams.adults > 1) {
			this.searchParams.adults--;
		}
	}

	public increaseChildren() {
		this.searchParams.children++;
	}

	public decreaseChildren() {
		if (this.searchParams.children > 0) {
			this.searchParams.children--;
		}
	}

	public formatDate(dateString: string): string {
		if (!dateString) return '';
		const date = new Date(dateString);
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${date.getDate()} ${months[date.getMonth()]}`;
	}

	public getTravellersText(): string {
		const total = this.searchParams.adults + this.searchParams.children;
		return `${total} traveller${total > 1 ? 's' : ''}, ${this.searchParams.rooms} room${this.searchParams.rooms > 1 ? 's' : ''}`;
	}
}

