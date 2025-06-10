import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { AuthService } from '../../services/auth.service';
import { GarageService } from '../../services/garage.service';
import { ModelsService } from '../../services/models.service';
import { CommonModule } from '@angular/common';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-garage',
  imports: [
    HeroComponent,
    CommonModule,
    PorscheDesignSystemModule,
    ReactiveFormsModule,
  ],
  templateUrl: './garage.component.html',
  styleUrl: './garage.component.scss',
})
export class GarageComponent implements OnInit {
  garageCount: number = 0;
  cars: any[] = [];
  loading: boolean = true;
  error: string = '';
  addCarModalOpen: boolean = false;
  carDetailFlyoutOpen: boolean = false;
  selectedCar: any = null;
  currentStep: number = 1; // Current year for validation
  currentYear: number = new Date().getFullYear();

  // Base models from API
  baseModels: string[] = [];

  // Forms
  step1Form: FormGroup;
  step2Form: FormGroup;

  constructor(
    private authService: AuthService,
    private modelsService: ModelsService,
    private garageService: GarageService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize Step 1
    this.step1Form = this.fb.group({
      baseModel: ['', [Validators.required]],
      model: ['', [Validators.required]],
      year: [
        '',
        [
          Validators.required,
          Validators.min(1948),
          Validators.max(this.currentYear),
        ],
      ],
    });

    // Initialize Step 2
    this.step2Form = this.fb.group({
      mileage: ['', [Validators.required, Validators.min(0)]],
      acquisitionYear: [
        '',
        [
          Validators.required,
          Validators.min(1948),
          Validators.max(this.currentYear),
        ],
      ],
      condition: ['', [Validators.required]],
      color: ['', [Validators.required]],
      vin: [''],
      notes: [''],
    });
  }
  ngOnInit() {
    this.loadGarage();
    this.loadBaseModels();
  }

  private loadBaseModels() {
    this.modelsService.getBaseModels().subscribe({
      next: (response) => {
        if (response.success) {
          this.baseModels = response.values;
        }
      },
      error: (error) => {
        console.error('Error loading base models:', error);
      },
    });
  }
  addCarModal() {
    this.addCarModalOpen = true;
    this.currentStep = 1; // Reset to step 1 when opening modal
  }

  onAddCarModalDismiss() {
    this.addCarModalOpen = false;
    this.currentStep = 1; // Reset du stepper vu que la modal a été fermée
    this.step1Form.reset();
    this.step2Form.reset();
  }
  nextStep() {
    if (this.currentStep === 1 && this.step1Form.valid) {
      this.currentStep = 2;
    } else if (this.currentStep === 2 && this.step2Form.valid) {
      this.currentStep = 3;
    } else if (this.currentStep === 1) {
      this.step1Form.markAllAsTouched();
    } else if (this.currentStep === 2) {
      this.step2Form.markAllAsTouched();
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  getStepState(
    stepNumber: number
  ): 'complete' | 'current' | 'warning' | undefined {
    if (stepNumber < this.currentStep) {
      return 'complete';
    } else if (stepNumber === this.currentStep) {
      return 'current';
    }
    return undefined;
  }

  // Form validation helpers
  hasFieldError(form: FormGroup, fieldName: string): boolean {
    const field = form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(form: FormGroup, fieldName: string): string {
    const field = form.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (field.errors?.['min']) {
        return `${this.capitalizeFirst(fieldName)} must be at least ${
          field.errors['min'].min
        }`;
      }
      if (field.errors?.['max']) {
        return `${this.capitalizeFirst(fieldName)} cannot exceed ${
          field.errors['max'].max
        }`;
      }
    }
    return '';
  }
  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Get combined form data for review
  getReviewData() {
    return {
      ...this.step1Form.value,
      ...this.step2Form.value,
    };
  }

  // Get formatted condition display
  getFormattedCondition(condition: string): string {
    switch (condition) {
      case 'excellent':
        return 'Excellent';
      case 'very-good':
        return 'Very Good';
      case 'good':
        return 'Good';
      case 'fair':
        return 'Fair';
      case 'needs-work':
        return 'Needs Work';
      default:
        return condition;
    }
  }

  getCarImage(baseModel: string): string {
    const imageMap: { [key: string]: string } = {
      '911': 'assets/images/cars/911.jpg',
      '718': 'assets/images/cars/718.jpg',
      Cayenne: 'assets/images/cars/cayenne.jpg',
      Macan: 'assets/images/cars/macan.jpg',
      Panamera: 'assets/images/cars/panamera.jpg',
      Taycan: 'assets/images/cars/taycan.jpg',
      '918': 'assets/images/cars/918spyder.jpg',
      '924': 'assets/images/cars/924.jpg',
      '928': 'assets/images/cars/928.jpg',
      '944': 'assets/images/cars/944.jpg',
      '968': 'assets/images/cars/968.jpg',
      'Carrera GT': 'assets/images/cars/carreragt.jpg',
    };

    return imageMap[baseModel] || 'assets/images/cars/911.jpg'; // Default to 911 image
  }

  // Car detail flyout methods
  onCarDetailClick(car: any) {
    this.selectedCar = car;
    this.carDetailFlyoutOpen = true;
  }

  onCarDetailDismiss() {
    this.carDetailFlyoutOpen = false;
    this.selectedCar = null;
  }

  // Format date for display
  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  // Submit the complete form
  onSubmitCar() {
    if (this.step1Form.valid && this.step2Form.valid) {
      const carData = {
        ...this.step1Form.value,
        ...this.step2Form.value,
      };

      console.log('Car data to save:', carData); // Call backend API to save car to user's garage
      this.garageService.addCarToGarage(carData).subscribe({
        next: (response) => {
          console.log('Car added successfully:', response);
          // Refresh the garage data to get updated cars list
          this.loadGarage();
          this.onAddCarModalDismiss();
          // TODO: Show success message or banner
        },
        error: (error) => {
          console.error('Failed to add car:', error);
          // TODO: Show error message
        },
      });
    } else {
      this.step2Form.markAllAsTouched();
    }
  }
  private loadGarage() {
    try {
      this.garageService.getGarageCars().subscribe({
        next: (response) => {
          this.garageCount = response.count;
          this.cars = response.cars || [];
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading garage count:', error);
          this.error = 'Failed to load garage information';
          this.loading = false;
        },
      });
    } catch (error) {
      console.error('No user logged in:', error);
      this.error = 'Please log in to view your garage';
      this.loading = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 5000);
    }
  }
}
