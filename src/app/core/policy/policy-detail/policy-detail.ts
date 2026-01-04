import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-policy-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './policy-detail.html',
  styleUrl: './policy-detail.scss',
})
export class PolicyDetail implements OnChanges {
  @Input() policyNumber: string = '';
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<any>();

  policy: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private policyService: PolicyService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['policyNumber'] && this.policyNumber && this.isOpen) {
      this.loadPolicyDetails();
    }
    if (changes['isOpen'] && this.isOpen && this.policyNumber) {
      this.loadPolicyDetails();
    }
  }

  loadPolicyDetails(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.policyService.getPolicyByNumber({
      data: {
        policyNumber: this.policyNumber
      },
      success: (response: any) => {
        console.log('Policy details loaded:', response);
        this.policy = response.policy || response;
        this.isLoading = false;
      },
      failure: (error: any) => {
        console.error('Failed to load policy details:', error);
        this.errorMessage = 'Failed to load policy details.';
        this.isLoading = false;
      }
    });
  }

  closeOverlay(): void {
    this.close.emit();
  }

  onEdit(): void {
    this.edit.emit(this.policy);
  }

  onOverlayClick(event: Event): void {
    // Close when clicking on overlay background
    if ((event.target as HTMLElement).classList.contains('overlay-backdrop')) {
      this.closeOverlay();
    }
  }
}

