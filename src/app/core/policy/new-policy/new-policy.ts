import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-new-policy',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './new-policy.html',
  styleUrl: './new-policy.scss',
})
export class NewPolicy implements OnInit {
  policyForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  isSubmitting: boolean = false;
  submitMessage: string = '';
  submitSuccess: boolean = false;

  // Dropdown options
  policyTypes = ['TERM', 'ENDOWMENT', 'ULIP', 'MONEY_BACK', 'WHOLE_LIFE', 'PENSION'];
  premiumFrequencies = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'SINGLE'];
  policyStatuses = ['ACTIVE', 'LAPSED', 'MATURED', 'SURRENDERED', 'PAID_UP'];
  genders = ['MALE', 'FEMALE', 'OTHER'];
  relationships = ['SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER'];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.policyForm = this.fb.group({
      // Policy Details
      policyNumber: ['', Validators.required],
      policyType: ['', Validators.required],
      planCode: ['', Validators.required],
      policyTerm: ['', [Validators.required, Validators.min(1)]],
      premiumTerm: ['', [Validators.required, Validators.min(1)]],
      sumAssured: ['', [Validators.required, Validators.min(10000)]],
      premiumAmount: ['', [Validators.required, Validators.min(100)]],
      premiumFrequency: ['', Validators.required],
      policyStartDate: ['', Validators.required],
      policyEndDate: ['', Validators.required],
      policyStatus: ['ACTIVE', Validators.required],

      // Policy Holder Details
      policyHolder: this.fb.group({
        fullName: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        gender: ['', Validators.required],
        mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
        email: ['', [Validators.required, Validators.email]],
        address: this.fb.group({
          addressLine1: ['', Validators.required],
          village: [''],
          mandal: [''],
          district: ['', Validators.required],
          state: ['', Validators.required],
          pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
        }),
        kyc: this.fb.group({
          aadhaarNumber: ['', Validators.pattern('^[0-9]{12}$')],
          panNumber: ['', Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]
        })
      }),

      // Nominee Details
      nominee: this.fb.group({
        name: ['', Validators.required],
        relationship: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        percentage: [100, [Validators.required, Validators.min(1), Validators.max(100)]]
      }),

      // Agent Details
      agentDetails: this.fb.group({
        agentCode: ['', Validators.required],
        agentName: ['', Validators.required],
        branchCode: ['', Validators.required]
      })
    });
  }

  get f() {
    return this.policyForm.controls;
  }

  get policyHolder() {
    return this.policyForm.get('policyHolder') as FormGroup;
  }

  get address() {
    return this.policyHolder.get('address') as FormGroup;
  }

  get kyc() {
    return this.policyHolder.get('kyc') as FormGroup;
  }

  get nominee() {
    return this.policyForm.get('nominee') as FormGroup;
  }

  get agentDetails() {
    return this.policyForm.get('agentDetails') as FormGroup;
  }

  nextStep(): void {
    if (this.validateCurrentStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.validateStepsUpTo(step - 1)) {
      this.currentStep = step;
    }
  }

  validateCurrentStep(): boolean {
    switch (this.currentStep) {
      case 1:
        return this.validatePolicyDetails();
      case 2:
        return this.validatePolicyHolderDetails();
      case 3:
        return this.validateNomineeDetails();
      case 4:
        return this.validateAgentDetails();
      default:
        return true;
    }
  }

  validateStepsUpTo(step: number): boolean {
    for (let i = 1; i <= step; i++) {
      this.currentStep = i;
      if (!this.validateCurrentStep()) {
        return false;
      }
    }
    return true;
  }

  validatePolicyDetails(): boolean {
    const controls = ['policyNumber', 'policyType', 'planCode', 'policyTerm', 'premiumTerm', 
                      'sumAssured', 'premiumAmount', 'premiumFrequency', 'policyStartDate', 'policyEndDate'];
    return this.markControlsAsTouched(controls, this.policyForm);
  }

  validatePolicyHolderDetails(): boolean {
    const holderControls = ['fullName', 'dateOfBirth', 'gender', 'mobile', 'email'];
    const addressControls = ['addressLine1', 'district', 'state', 'pincode'];
    
    return this.markControlsAsTouched(holderControls, this.policyHolder) &&
           this.markControlsAsTouched(addressControls, this.address);
  }

  validateNomineeDetails(): boolean {
    const controls = ['name', 'relationship', 'dateOfBirth', 'percentage'];
    return this.markControlsAsTouched(controls, this.nominee);
  }

  validateAgentDetails(): boolean {
    const controls = ['agentCode', 'agentName', 'branchCode'];
    return this.markControlsAsTouched(controls, this.agentDetails);
  }

  markControlsAsTouched(controlNames: string[], formGroup: FormGroup): boolean {
    let isValid = true;
    controlNames.forEach(name => {
      const control = formGroup.get(name);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          isValid = false;
        }
      }
    });
    return isValid;
  }

  onSubmit(): void {
    if (this.policyForm.valid) {
      this.isSubmitting = true;
      const formData = this.policyForm.value;
      
      // Add user_id from localStorage
      const userId = localStorage.getItem('token');
      const requestData = {
        ...formData,
        user_id: userId
      };
      
      console.log('Policy Form Data:', requestData);
      
      this.policyService.createPolicy({
        data: {
          body: requestData
        },
        success: (response: any) => {
          console.log('Policy Created Successfully:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.submitMessage = response.message || 'Policy created successfully!';
          
          // Navigate to home after 2 seconds
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 2000);
        },
        failure: (error: any) => {
          console.error('Policy Creation Failed:', error);
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = error.error?.message || 'Failed to create policy. Please try again.';
        }
      });
    } else {
      this.policyForm.markAllAsTouched();
      this.submitMessage = 'Please fill all required fields correctly.';
      this.submitSuccess = false;
    }
  }

  generatePolicyNumber(): void {
    const prefix = 'LIC';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.policyForm.patchValue({ policyNumber: `${prefix}${timestamp}${random}` });
  }

  calculateEndDate(): void {
    const startDate = this.policyForm.get('policyStartDate')?.value;
    const policyTerm = this.policyForm.get('policyTerm')?.value;
    
    if (startDate && policyTerm) {
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + parseInt(policyTerm));
      this.policyForm.patchValue({ 
        policyEndDate: endDate.toISOString().split('T')[0] 
      });
    }
  }
}

