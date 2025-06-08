import { Component } from '@angular/core';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PorscheDesignSystemModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  open = false;
  loginModalOpen = false;
  email: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  bannerOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onMenuClick() {
    this.open = true;
  }

  onDismiss() {
    this.open = false;
  }

  onLoginClick() {
    this.loginModalOpen = true;
  }

  onLoginModalDismiss() {
    this.loginModalOpen = false;
    this.bannerOpen = false;
  }

  onBannerDismiss() {
    this.bannerOpen = false;
  }

  onModelsClick() {
    this.router.navigate(['/models']);
    this.open = false; // Close the flyout after navigation
  }
    returnHome() {
    this.router.navigate(['/']);
    this.open = false; // Close the flyout after navigation
  }

  onLoginSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
        this.loginSuccess = true;
        this.bannerOpen = true;
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
}
