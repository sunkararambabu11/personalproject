import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../header/header';

interface Hotel {
	id: string;
	name: string;
	location: string;
	rating: number;
	reviews: number;
	description: string;
	propertySummary: string;
	fullDescription: string;
	mainImage?: string;
	galleryImages?: string[];
	checkIn: string;
	checkOut: string;
	cancellationPolicy: string;
	paymentMethods: string;
	address: string;
	amenities: Array<{ name: string; icon: string }>;
	allAmenities: Array<{ name: string; icon: string }>;
	spa?: {
		description: string;
		image?: string;
	};
	accessibilityFeatures: string[];
	nearbyLandmarks: Array<{ name: string; distance: string; icon: string }>;
	isWishlisted?: boolean;
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
	selector: 'app-hotel-detail',
	imports: [CommonModule, FormsModule, Header],
	templateUrl: './hotel-detail.html',
	styleUrl: './hotel-detail.scss',
})
export class HotelDetail implements OnInit {
	public hotel: Hotel | null = null;
	public activeTab: string = 'overview';
	public searchParams: SearchParams = {
		location: '',
		checkIn: '',
		checkOut: '',
		adults: 2,
		children: 0,
		rooms: 1
	};
	public showTravellersPopup: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router
	) {}

	ngOnInit() {
		const hotelId = this.route.snapshot.paramMap.get('id');
		this.route.queryParams.subscribe(params => {
			this.searchParams = {
				location: params['location'] || 'Hyderabad',
				checkIn: params['checkIn'] || '',
				checkOut: params['checkOut'] || '',
				adults: +params['adults'] || 2,
				children: +params['children'] || 0,
				rooms: +params['rooms'] || 1
			};
		});
		this.loadHotel(hotelId || '1');
	}

	public loadHotel(hotelId: string) {
		// Sample hotel data - replace with API call
		this.hotel = {
			id: hotelId,
			name: 'ITC Kakatiya, a Luxury Collection Hotel, Hyderabad',
			location: 'Begumpet',
			rating: 8.6,
			reviews: 260,
			description: 'Tranquil elegance in Hyderabad\'s heart. This luxury hotel features contemporary design, spacious rooms, serene atmosphere, and three excellent restaurants.',
			propertySummary: 'Luxury hotel with 2 restaurants and full-service spa',
			fullDescription: 'Experience unparalleled luxury at ITC Kakatiya, a Luxury Collection Hotel. Nestled in the heart of Hyderabad, this elegant property offers world-class amenities, exceptional dining, and impeccable service. The hotel features beautifully designed rooms and suites, a full-service spa, multiple dining options, and state-of-the-art facilities for business and leisure travelers.',
			mainImage: 'assets/images/hotel-main.jpg',
			galleryImages: [
				'assets/images/hotel-1.jpg',
				'assets/images/hotel-2.jpg',
				'assets/images/hotel-3.jpg',
				'assets/images/hotel-4.jpg',
				'assets/images/hotel-5.jpg'
			],
			checkIn: '2:00 PM',
			checkOut: '11:00 AM',
			cancellationPolicy: 'Fully refundable before check-in date. Cancellations made after the deadline are subject to a property fee equal to the first night\'s rate plus taxes and fees.',
			paymentMethods: 'Credit cards, Debit cards, Cash, UPI',
			address: '6-3-1187, Begumpet, Hyderabad, Telangana, 500016',
			amenities: [
				{ name: 'Outdoor pool', icon: 'fas fa-swimming-pool' },
				{ name: 'Vegetarian breakfast available', icon: 'fas fa-coffee' },
				{ name: 'Limo or town car service available', icon: 'fas fa-car' },
				{ name: 'Hot tub', icon: 'fas fa-hot-tub' },
				{ name: 'Self-parking included', icon: 'fas fa-parking' },
				{ name: 'International cuisine restaurant', icon: 'fas fa-utensils' }
			],
			allAmenities: [
				{ name: 'Free WiFi', icon: 'fas fa-wifi' },
				{ name: 'Swimming Pool', icon: 'fas fa-swimming-pool' },
				{ name: 'Spa & Wellness', icon: 'fas fa-spa' },
				{ name: 'Fitness Center', icon: 'fas fa-dumbbell' },
				{ name: 'Restaurant', icon: 'fas fa-utensils' },
				{ name: 'Room Service', icon: 'fas fa-concierge-bell' },
				{ name: 'Business Center', icon: 'fas fa-briefcase' },
				{ name: 'Parking', icon: 'fas fa-parking' },
				{ name: 'Airport Shuttle', icon: 'fas fa-shuttle-van' },
				{ name: 'Laundry Service', icon: 'fas fa-tshirt' }
			],
			spa: {
				description: 'Kaya Kalp has 4 treatment rooms. The hotel\'s spa offers massages and wellness treatments such as Ayurvedic treatments. Other on-site facilities include a steam room and a sauna.',
				image: 'assets/images/spa.jpg'
			},
			accessibilityFeatures: [
				'Wheelchair accessible',
				'Accessible parking',
				'Elevator access',
				'Accessible rooms available',
				'Assistance for disabled guests'
			],
			nearbyLandmarks: [
				{ name: 'Hussain Sagar Lake', distance: '9 min walk', icon: 'fas fa-map-marker-alt' },
				{ name: 'Hyderabad Central Mall', distance: '10 min walk', icon: 'fas fa-map-marker-alt' },
				{ name: 'Birla Mandir Temple', distance: '10 min drive', icon: 'fas fa-map-marker-alt' },
				{ name: 'Hyderabad (HYD-Rajiv Gandhi Intl.)', distance: '29 min drive', icon: 'fas fa-plane' }
			],
			isWishlisted: false
		};
	}

	public setActiveTab(tab: string) {
		this.activeTab = tab;
	}

	public goToRooms() {
		if (this.hotel) {
			this.router.navigate(['/hotels/rooms', this.hotel.id], {
				queryParams: this.searchParams
			});
		}
	}

	public toggleWishlist() {
		if (this.hotel) {
			this.hotel.isWishlisted = !this.hotel.isWishlisted;
		}
	}

	public goBack() {
		this.router.navigate(['/hotels/results'], {
			queryParams: this.searchParams
		});
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

	public searchHotels() {
		// Navigate to results page with search params
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
}

