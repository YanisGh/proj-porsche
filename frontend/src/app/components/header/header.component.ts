import { Component, OnDestroy } from '@angular/core';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, SignupData } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess, logout } from '../../store/auth.actions';
import { selectUserConnected } from '../../store/auth.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PorscheDesignSystemModule, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  open = false;
  loginModalOpen = false;
  logoutModalOpen = false;
  isSignupMode = false;
  email: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  bannerOpen = false;
  userConnected: boolean = false;
  userFirstName: string | null = null;
  private userConnectedSub: Subscription;

  // Form groups for validation
  loginForm: FormGroup;
  signupForm: FormGroup;
  
  // Validation error messages
  validationErrors: { [key: string]: string } = {};

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store,
    private fb: FormBuilder
  ) {
    this.userConnectedSub = this.store.select(selectUserConnected).subscribe((connected) => {
      this.userConnected = connected;
      console.log('User connected:', connected);
    });

    // Initialize login form with validation
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize signup form with validation
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnDestroy() {
    this.userConnectedSub.unsubscribe();
  }

  // Custom validator for password confirmation
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      if (Object.keys(confirmPassword.errors || {}).length === 0) {
        confirmPassword.setErrors(null);
      }
    }
    
    return null;
  }

  // Get validation error message for a field
  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (field && field.invalid && (field.dirty || field.touched)) {
      if (field.errors?.['required']) {
        return `${this.capitalizeFirst(fieldName)} is required`;
      }
      if (field.errors?.['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors?.['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.capitalizeFirst(fieldName)} must be at least ${minLength} characters`;
      }
      if (field.errors?.['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return '';
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Check if form field has errors
  hasFieldError(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onMenuClick() {
    this.open = true;
  }

  onDismiss() {
    this.open = false;
  }

  onLoginClick() {
      this.loginModalOpen = true;
  }

  onLogout() {
    this.logoutModalOpen = true;
  }

  confirmLogout() {
    this.authService.logout();
    this.store.dispatch(logout());
    this.logoutModalOpen = false;
    this.router.navigate(['/']);
  }

  onLogoutModalDismiss() {
    this.logoutModalOpen = false;
  }

  onLoginModalDismiss() {
    this.loginModalOpen = false;
    this.bannerOpen = false;
    this.isSignupMode = false;
    this.resetForms();
  }

  private resetForms() {
    this.loginForm.reset();
    this.signupForm.reset();
    this.validationErrors = {};
  }

  switchToSignup() {
    this.isSignupMode = true;
    this.bannerOpen = false;
  }

  switchToLogin() {
    this.isSignupMode = false;
    this.bannerOpen = false;
  }

  onBannerDismiss() {
    this.bannerOpen = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.open = false;
  }

  onLoginSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        // Retrieve user basic data for greeting
        this.authService.getUserBasicData(email).subscribe({
          next: (userResp) => {
            if (userResp.success && userResp.user && userResp.user.firstName) {
              this.userFirstName = userResp.user.firstName;
            }
            this.authService.setCurrentUser({ ...response.user, ...userResp.user });
          },
          error: () => {
            this.userFirstName = null;
            this.authService.setCurrentUser(response.user);
          }
        });
        this.loginSuccess = true;
        this.bannerOpen = true;
        this.store.dispatch(loginSuccess());
        setTimeout(() => {
          this.onLoginModalDismiss()
        }, 2000);
      },
      error: (error) => {
        console.error('Login failed:', error);
        this.loginSuccess = false;
        this.bannerOpen = true;
      }
    });
  }

  onSignupSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, password } = this.signupForm.value;
    const signupData: SignupData = {
      firstName,
      lastName,
      email,
      password
    };

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        this.loginSuccess = true;
        this.bannerOpen = true;
        setTimeout(() => {
          this.onLoginModalDismiss()
        }, 2000);
      },
      error: (error) => {
        console.error('Signup failed:', error);
        this.loginSuccess = false;
        this.bannerOpen = true;
      }
    });
  }
}
