import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { PorscheDesignSystemModule, ToastManager } from '@porsche-design-system/components-angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [HeroComponent, CommonModule, PorscheDesignSystemModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;
  error: string = '';
  userData: any = null;
  garageStats: any = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastManager: ToastManager
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  private loadUserData() {
    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser?.email) {
        this.error = 'Please log in to view your profile';
        this.loading = false;
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
        return;
      }

      this.authService.getUserComprehensiveData(currentUser.email).subscribe({
        next: (response) => {
          if (response.success) {
            this.userData = response.user;
            this.garageStats = response.garageStats;
          } else {
            this.error = response.message || 'Failed to load profile data';
          }
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading profile data:', error);
          this.error = 'Failed to load profile information';
          this.loading = false;
        }
      });
    } catch (error) {
      console.error('No user logged in:', error);
      this.error = 'Please log in to view your profile';
      this.loading = false;
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

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

  navigateToGarage() {
    this.router.navigate(['/garage']);
  }
  showToastMessage(message: string, type: 'success' | 'error' = 'success') {
    this.toastManager.addMessage({
      text: message,
      state: type === 'error' ? 'info' : 'success'
    });
  }

  // Helper method for template to access Object.keys
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }
}
