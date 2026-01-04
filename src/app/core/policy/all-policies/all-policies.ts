import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PolicyService } from '../policy.service';
import { PolicyDetail } from '../policy-detail/policy-detail';

@Component({
  selector: 'app-all-policies',
  imports: [CommonModule, RouterModule, PolicyDetail, FormsModule],
  templateUrl: './all-policies.html',
  styleUrl: './all-policies.scss',
})
export class AllPolicies implements OnInit {
  policies: any[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  
  // Search
  searchQuery: string = '';
  isSearching: boolean = false;
  isSearchActive: boolean = false;
  
  // Pagination
  currentPage: number = 1;
  pageSize: number = 5;
  totalPolicies: number = 0;
  totalPages: number = 0;

  // Overlay
  isOverlayOpen: boolean = false;
  selectedPolicyNumber: string = '';

  // Delete confirmation
  showDeleteModal: boolean = false;
  policyToDelete: any = null;
  isDeleting: boolean = false;

  // Renewal Types Filter
  isRenewalDropdownOpen: boolean = false;
  renewalTypes: { value: string; label: string; selected: boolean }[] = [
    { value: 'MONTHLY', label: 'Monthly', selected: false },
    { value: 'QUARTERLY', label: 'Quarterly', selected: false },
    { value: 'HALF_YEARLY', label: 'Half Yearly', selected: false },
    { value: 'YEARLY', label: 'Yearly', selected: false },
    { value: 'SINGLE', label: 'Single', selected: false }
  ];
  allPoliciesCache: any[] = []; // Cache for filtering

  constructor(
    private policyService: PolicyService, 
    private router: Router,
    private elementRef: ElementRef
  ) {}

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dropdown = this.elementRef.nativeElement.querySelector('.filter-dropdown');
    if (dropdown && !dropdown.contains(target)) {
      this.isRenewalDropdownOpen = false;
    }
  }

  ngOnInit(): void {
    this.loadPolicies();
  }

  loadPolicies(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const userId = localStorage.getItem('token') || '';

    this.policyService.getAllPolicies({
      data: {
        userId: userId,
        page: this.currentPage,
        limit: this.pageSize
      },
      success: (response: any) => {
        console.log('Policies loaded:', response);
        this.policies = response.policies || response.data || response || [];
        this.totalPolicies = response.total || response.totalCount || this.policies.length;
        this.totalPages = Math.ceil(this.totalPolicies / this.pageSize);
        this.isLoading = false;
        this.isSearchActive = false;
      },
      failure: (error: any) => {
        console.error('Failed to load policies:', error);
        this.errorMessage = 'Failed to load policies. Please try again.';
        this.isLoading = false;
      }
    });
  }

  // Search using API
  searchPolicies(): void {
    if (!this.searchQuery.trim()) {
      this.clearSearch();
      return;
    }

    this.isLoading = true;
    this.isSearching = true;
    this.errorMessage = '';

    const userId = localStorage.getItem('token') || '';

    this.policyService.searchPolicies({
      data: {
        userId: userId,
        query: this.searchQuery.trim(),
        page: this.currentPage,
        limit: this.pageSize
      },
      success: (response: any) => {
        console.log('Search results:', response);
        this.policies = response.policies || response.data || response || [];
        this.totalPolicies = response.total || response.totalCount || this.policies.length;
        this.totalPages = Math.ceil(this.totalPolicies / this.pageSize);
        this.isLoading = false;
        this.isSearching = false;
        this.isSearchActive = true;
      },
      failure: (error: any) => {
        console.error('Search failed:', error);
        this.errorMessage = 'Search failed. Please try again.';
        this.isLoading = false;
        this.isSearching = false;
      }
    });
  }

  // Search Methods
  onSearch(): void {
    this.currentPage = 1;
    this.searchPolicies();
  }

  onSearchKeyup(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.onSearch();
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.currentPage = 1;
    this.isSearchActive = false;
    this.loadPolicies();
  }

  refreshPolicies(): void {
    this.currentPage = 1;
    this.searchQuery = '';
    this.isSearchActive = false;
    this.loadPolicies();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      if (this.isSearchActive && this.searchQuery.trim()) {
        this.searchPolicies();
      } else {
        this.loadPolicies();
      }
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      if (this.isSearchActive && this.searchQuery.trim()) {
        this.searchPolicies();
      } else {
        this.loadPolicies();
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.isSearchActive && this.searchQuery.trim()) {
        this.searchPolicies();
      } else {
        this.loadPolicies();
      }
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  // Overlay Methods
  openPolicyDetail(policyNumber: string): void {
    this.selectedPolicyNumber = policyNumber;
    this.isOverlayOpen = true;
  }

  closeOverlay(): void {
    this.isOverlayOpen = false;
    this.selectedPolicyNumber = '';
  }

  onEditPolicy(policy: any): void {
    console.log('Edit policy:', policy);
    this.closeOverlay();
    this.router.navigate(['/policy/edit', policy.policyNumber]);
  }

  // Direct edit from table
  editPolicy(policyNumber: string): void {
    this.router.navigate(['/policy/edit', policyNumber]);
  }

  // Delete Methods
  confirmDelete(policy: any): void {
    this.policyToDelete = policy;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.policyToDelete = null;
  }

  deletePolicy(): void {
    if (!this.policyToDelete) return;

    this.isDeleting = true;

    this.policyService.deletePolicy({
      data: {
        policyNumber: this.policyToDelete.policyNumber
      },
      success: (response: any) => {
        console.log('Policy deleted:', response);
        this.isDeleting = false;
        this.showDeleteModal = false;
        this.policyToDelete = null;
        // Reload policies
        if (this.isSearchActive && this.searchQuery.trim()) {
          this.searchPolicies();
        } else {
          this.loadPolicies();
        }
      },
      failure: (error: any) => {
        console.error('Failed to delete policy:', error);
        this.isDeleting = false;
        alert('Failed to delete policy. Please try again.');
      }
    });
  }

  // Get status class for styling
  getStatusClass(status: string): string {
    if (!status) return '';
    
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'active':
        return 'status-active';
      case 'lapsed':
        return 'status-lapsed';
      case 'matured':
        return 'status-matured';
      case 'surrendered':
        return 'status-surrendered';
      case 'paid_up':
      case 'paid-up':
      case 'paidup':
        return 'status-paid-up';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  }

  // Get mode class for styling
  getModeClass(mode: string): string {
    if (!mode) return '';
    
    const modeLower = mode.toLowerCase();
    switch (modeLower) {
      case 'monthly':
        return 'mode-monthly';
      case 'quarterly':
        return 'mode-quarterly';
      case 'half_yearly':
      case 'half-yearly':
      case 'halfyearly':
        return 'mode-half-yearly';
      case 'yearly':
        return 'mode-yearly';
      case 'single':
        return 'mode-single';
      default:
        return 'mode-default';
    }
  }

  // Get payment months based on frequency and start date
  getPaymentMonths(frequency: string, startDate: string): string {
    if (!startDate) return '-';
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const date = new Date(startDate);
    const startMonth = date.getMonth(); // 0-11
    
    const freq = (frequency || '').toUpperCase();
    
    switch (freq) {
      case 'YEARLY':
        return months[startMonth];
      
      case 'HALF_YEARLY':
      case 'HALF-YEARLY':
      case 'HALFYEARLY':
        const halfYearlyMonths = [];
        for (let i = 0; i < 2; i++) {
          halfYearlyMonths.push(months[(startMonth + (i * 6)) % 12]);
        }
        return halfYearlyMonths.join(', ');
      
      case 'QUARTERLY':
        const quarterlyMonths = [];
        for (let i = 0; i < 4; i++) {
          quarterlyMonths.push(months[(startMonth + (i * 3)) % 12]);
        }
        return quarterlyMonths.join(', ');
      
      case 'MONTHLY':
        return 'Every Month';
      
      case 'SINGLE':
        return months[startMonth] + ' (One-time)';
      
      default:
        return '-';
    }
  }

  // Renewal Types Filter Methods
  toggleRenewalDropdown(): void {
    this.isRenewalDropdownOpen = !this.isRenewalDropdownOpen;
  }

  closeRenewalDropdown(): void {
    this.isRenewalDropdownOpen = false;
  }

  toggleRenewalType(type: { value: string; label: string; selected: boolean }): void {
    type.selected = !type.selected;
  }

  getSelectedRenewalCount(): number {
    return this.renewalTypes.filter(t => t.selected).length;
  }

  getSelectedRenewalTypes(): string[] {
    return this.renewalTypes.filter(t => t.selected).map(t => t.value);
  }

  clearRenewalFilters(): void {
    this.renewalTypes.forEach(t => t.selected = false);
  }

  applyRenewalFilter(): void {
    this.isRenewalDropdownOpen = false;
    this.currentPage = 1;
    
    const selectedTypes = this.getSelectedRenewalTypes();
    
    if (selectedTypes.length === 0) {
      // No filter selected, load all policies
      if (this.isSearchActive && this.searchQuery.trim()) {
        this.searchPolicies();
      } else {
        this.loadPolicies();
      }
      return;
    }

    // Apply filter client-side
    this.isLoading = true;
    const userId = localStorage.getItem('token') || '';

    this.policyService.getAllPolicies({
      data: {
        userId: userId,
        page: 1,
        limit: 1000 // Get all for filtering
      },
      success: (response: any) => {
        const allData = response.policies || response.data || response || [];
        
        // Filter by selected renewal types
        const filtered = allData.filter((policy: any) => {
          const frequency = (policy.premiumFrequency || '').toUpperCase();
          return selectedTypes.some(type => {
            if (type === 'HALF_YEARLY') {
              return frequency === 'HALF_YEARLY' || frequency === 'HALF-YEARLY' || frequency === 'HALFYEARLY';
            }
            return frequency === type;
          });
        });

        // Apply search filter if active
        let finalFiltered = filtered;
        if (this.isSearchActive && this.searchQuery.trim()) {
          const query = this.searchQuery.trim().toLowerCase();
          finalFiltered = filtered.filter((policy: any) => {
            const policyNumber = (policy.policyNumber || '').toLowerCase();
            const fullName = (policy.policyHolder?.fullName || policy.fullName || '').toLowerCase();
            return policyNumber.includes(query) || fullName.includes(query);
          });
        }

        this.totalPolicies = finalFiltered.length;
        this.totalPages = Math.ceil(this.totalPolicies / this.pageSize);
        
        // Apply pagination
        const startIndex = (this.currentPage - 1) * this.pageSize;
        this.policies = finalFiltered.slice(startIndex, startIndex + this.pageSize);
        
        this.allPoliciesCache = finalFiltered;
        this.isLoading = false;
      },
      failure: (error: any) => {
        console.error('Failed to load policies:', error);
        this.errorMessage = 'Failed to load policies.';
        this.isLoading = false;
      }
    });
  }
}
