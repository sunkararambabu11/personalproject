import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Header } from '../../header/header';

interface Room {
	id: string;
	name: string;
	price: number;
	totalPrice: number;
	rating: number;
	reviews: number;
	image?: string;
	imageCount?: number;
	features: Array<{ name: string; icon: string }>;
	bedType?: string;
	view?: string;
	refundable: boolean;
	reserveNow: boolean;
	availability?: number;
	badge?: string;
	isFeatured?: boolean;
	extras?: Array<{ id: string; name: string; price?: number }>;
}

interface SearchParams {
	location: string;
	checkIn: string;
	checkOut: string;
	adults: number;
	children: number;
	rooms: number;
}

interface Hotel {
	id: string;
	name: string;
	typicalPrice: number;
}

@Component({
	selector: 'app-room-selection',
	imports: [CommonModule, FormsModule, Header],
	templateUrl: './room-selection.html',
	styleUrl: './room-selection.scss',
})
export class RoomSelection implements OnInit {
	public hotel: Hotel | null = null;
	public rooms: Room[] = [];
	public filteredRooms: Room[] = [];
	public roomFilter: string = 'all';
	public searchParams: SearchParams = {
		location: '',
		checkIn: '',
		checkOut: '',
		adults: 2,
		children: 0,
		rooms: 1
	};
	public selectedExtras: { [key: string]: string } = {};
	public showPaymentModal: boolean = false;
	public selectedRoom: Room | null = null;
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
		this.loadRooms();
	}

	public loadHotel(hotelId: string) {
		this.hotel = {
			id: hotelId,
			name: 'ITC Kakatiya, a Luxury Collection Hotel, Hyderabad',
			typicalPrice: 17850
		};
	}

	public loadRooms() {
		this.rooms = [
			{
				id: '1',
				name: 'Club Room, Non Smoking, Tower',
				price: 17850,
				totalPrice: 42126,
				rating: 7.6,
				reviews: 5,
				imageCount: 6,
				features: [
					{ name: 'Free self parking', icon: 'fas fa-parking' },
					{ name: '334 sq ft', icon: 'fas fa-square' },
					{ name: 'Sleeps 3', icon: 'fas fa-user' }
				],
				bedType: '1 King Bed OR 2 Single Beds',
				view: 'City view',
				refundable: true,
				reserveNow: true,
				availability: 5,
				badge: 'Our lowest price',
				extras: [
					{ id: 'breakfast', name: 'Breakfast + 20% off food and alcoholic beverages (once per stay)', price: 0 },
					{ id: 'halfboard', name: 'Half board' }
				]
			},
			{
				id: '2',
				name: 'Executive Room, Non Smoking, City View',
				price: 19500,
				totalPrice: 46000,
				rating: 9.6,
				reviews: 9,
				imageCount: 6,
				features: [
					{ name: 'Free self parking', icon: 'fas fa-parking' },
					{ name: '334 sq ft', icon: 'fas fa-square' },
					{ name: 'Sleeps 3', icon: 'fas fa-user' }
				],
				bedType: '1 King Bed',
				view: 'City view',
				refundable: true,
				reserveNow: true,
				badge: 'Frequently booked',
				isFeatured: true
			},
			{
				id: '3',
				name: 'Deluxe Suite, Non Smoking',
				price: 22000,
				totalPrice: 52000,
				rating: 10.0,
				reviews: 1,
				imageCount: 5,
				features: [
					{ name: 'Breakfast buffet', icon: 'fas fa-coffee' },
					{ name: 'Free self parking', icon: 'fas fa-parking' },
					{ name: 'Sleeps 3', icon: 'fas fa-user' }
				],
				bedType: '1 King Bed',
				refundable: true,
				reserveNow: true,
				badge: 'Upgrade your stay'
			},
			{
				id: '4',
				name: 'Standard Room, Non Smoking',
				price: 16500,
				totalPrice: 39000,
				rating: 8.2,
				reviews: 12,
				imageCount: 4,
				features: [
					{ name: 'Free WiFi', icon: 'fas fa-wifi' },
					{ name: '280 sq ft', icon: 'fas fa-square' },
					{ name: 'Sleeps 2', icon: 'fas fa-user' }
				],
				bedType: '1 King Bed',
				refundable: false,
				reserveNow: true
			}
		];
		this.applyFilter();
	}

	public setRoomFilter(filter: string) {
		this.roomFilter = filter;
		this.applyFilter();
	}

	public applyFilter() {
		if (this.roomFilter === 'all') {
			this.filteredRooms = [...this.rooms];
		} else if (this.roomFilter === '1bed') {
			this.filteredRooms = this.rooms.filter(r => r.bedType?.includes('1'));
		} else if (this.roomFilter === '2beds') {
			this.filteredRooms = this.rooms.filter(r => r.bedType?.includes('2'));
		}
	}

	public openPaymentModal(room: Room) {
		this.selectedRoom = room;
		this.showPaymentModal = true;
	}

	public closePaymentModal() {
		this.showPaymentModal = false;
		setTimeout(() => {
			this.selectedRoom = null;
		}, 300);
	}

	public proceedToCheckout(paymentType: string) {
		if (this.selectedRoom && this.hotel) {
			this.router.navigate(['/hotels/checkout'], {
				queryParams: {
					hotelId: this.hotel.id,
					roomId: this.selectedRoom.id,
					checkIn: this.searchParams.checkIn,
					checkOut: this.searchParams.checkOut,
					adults: this.searchParams.adults,
					children: this.searchParams.children,
					rooms: this.searchParams.rooms,
					paymentType: paymentType,
					price: this.selectedRoom.price,
					totalPrice: this.selectedRoom.totalPrice
				}
			});
		}
	}

	public getTravellersText(): string {
		const total = this.searchParams.adults + this.searchParams.children;
		return `${total} traveller${total > 1 ? 's' : ''}, ${this.searchParams.rooms} room${this.searchParams.rooms > 1 ? 's' : ''}`;
	}

	public getPricePercentage(): number {
		if (!this.hotel) return 50;
		const min = 17000;
		const max = 22000;
		const price = this.hotel.typicalPrice;
		return ((price - min) / (max - min)) * 100;
	}

	public formatRefundDate(): string {
		if (!this.searchParams.checkIn) return 'check-in date';
		const date = new Date(this.searchParams.checkIn);
		date.setDate(date.getDate() - 1);
		const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
		const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
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

