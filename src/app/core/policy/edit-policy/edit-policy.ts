import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PolicyService } from '../policy.service';

@Component({
  selector: 'app-edit-policy',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './edit-policy.html',
  styleUrl: './edit-policy.scss',
})
export class EditPolicy implements OnInit {
  policyForm!: FormGroup;
  currentStep: number = 1;
  totalSteps: number = 4;
  isSubmitting: boolean = false;
  isLoading: boolean = true;
  submitMessage: string = '';
  submitSuccess: boolean = false;
  policyNumber: string = '';

  // Dropdown options
  policyTypes = ['TERM', 'ENDOWMENT', 'ULIP', 'MONEY_BACK', 'WHOLE_LIFE', 'PENSION'];
  premiumFrequencies = ['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY', 'SINGLE'];
  policyStatuses = ['ACTIVE', 'LAPSED', 'MATURED', 'SURRENDERED', 'PAID_UP'];
  genders = ['MALE', 'FEMALE', 'OTHER'];
  relationships = ['SPOUSE', 'SON', 'DAUGHTER', 'FATHER', 'MOTHER', 'BROTHER', 'SISTER', 'OTHER'];

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private route: ActivatedRoute,
    private policyService: PolicyService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.policyNumber = this.route.snapshot.paramMap.get('policyNumber') || '';
    if (this.policyNumber) {
      this.loadPolicyData();
    }
  }

  initializeForm(): void {
    this.policyForm = this.fb.group({
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

      nominee: this.fb.group({
        name: ['', Validators.required],
        relationship: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
        percentage: [100, [Validators.required, Validators.min(1), Validators.max(100)]]
      }),

      agentDetails: this.fb.group({
        agentCode: ['', Validators.required],
        agentName: ['', Validators.required],
        branchCode: ['', Validators.required]
      })
    });
  }

  loadPolicyData(): void {
    this.isLoading = true;
    
    this.policyService.getPolicyByNumber({
      data: {
        policyNumber: this.policyNumber
      },
      success: (response: any) => {
        console.log('Policy loaded for edit:', response);
        const policy = response.policy || response;
        this.populateForm(policy);
        this.isLoading = false;
      },
      failure: (error: any) => {
        console.error('Failed to load policy:', error);
        this.submitMessage = 'Failed to load policy data.';
        this.submitSuccess = false;
        this.isLoading = false;
      }
    });
  }

  populateForm(policy: any): void {
    // Format dates for input[type="date"]
    const formatDate = (dateStr: string) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      return date.toISOString().split('T')[0];
    };

    this.policyForm.patchValue({
      policyNumber: policy.policyNumber || '',
      policyType: policy.policyType || '',
      planCode: policy.planCode || '',
      policyTerm: policy.policyTerm || '',
      premiumTerm: policy.premiumTerm || '',
      sumAssured: policy.sumAssured || '',
      premiumAmount: policy.premiumAmount || '',
      premiumFrequency: policy.premiumFrequency || '',
      policyStartDate: formatDate(policy.policyStartDate),
      policyEndDate: formatDate(policy.policyEndDate),
      policyStatus: policy.policyStatus || 'ACTIVE',

      policyHolder: {
        fullName: policy.policyHolder?.fullName || '',
        dateOfBirth: formatDate(policy.policyHolder?.dateOfBirth),
        gender: policy.policyHolder?.gender || '',
        mobile: policy.policyHolder?.mobile || '',
        email: policy.policyHolder?.email || '',
        address: {
          addressLine1: policy.policyHolder?.address?.addressLine1 || '',
          village: policy.policyHolder?.address?.village || '',
          mandal: policy.policyHolder?.address?.mandal || '',
          district: policy.policyHolder?.address?.district || '',
          state: policy.policyHolder?.address?.state || '',
          pincode: policy.policyHolder?.address?.pincode || ''
        },
        kyc: {
          aadhaarNumber: policy.policyHolder?.kyc?.aadhaarNumber || '',
          panNumber: policy.policyHolder?.kyc?.panNumber || ''
        }
      },

      nominee: {
        name: policy.nominee?.name || '',
        relationship: policy.nominee?.relationship || '',
        dateOfBirth: formatDate(policy.nominee?.dateOfBirth),
        percentage: policy.nominee?.percentage || 100
      },

      agentDetails: {
        agentCode: policy.agentDetails?.agentCode || '',
        agentName: policy.agentDetails?.agentName || '',
        branchCode: policy.agentDetails?.branchCode || ''
      }
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
      
      const userId = localStorage.getItem('token');
      const requestData = {
        ...formData,
        user_id: userId
      };
      
      console.log('Update Policy Data:', requestData);
      
      this.policyService.updatePolicy({
        data: {
          policyNumber: this.policyNumber,
          body: requestData
        },
        success: (response: any) => {
          console.log('Policy Updated Successfully:', response);
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.submitMessage = response.message || 'Policy updated successfully!';
          
          setTimeout(() => {
            this.router.navigate(['/policy/list']);
          }, 2000);
        },
        failure: (error: any) => {
          console.error('Policy Update Failed:', error);
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage = error.error?.message || 'Failed to update policy. Please try again.';
        }
      });
    } else {
      this.policyForm.markAllAsTouched();
      this.submitMessage = 'Please fill all required fields correctly.';
      this.submitSuccess = false;
    }
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

  goBack(): void {
    this.router.navigate(['/policy/list']);
  }
}

