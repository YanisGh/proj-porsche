import { Component, OnDestroy } from '@angular/core';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginSuccess } from '../../store/auth.actions';
import { selectUserConnected } from '../../store/auth.selectors';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PorscheDesignSystemModule, FormsModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy {
  open = false;
  loginModalOpen = false;
  email: string = '';
  password: string = '';
  loginSuccess: boolean = false;
  bannerOpen = false;
  userConnected: boolean = false;
  private userConnectedSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private store: Store
  ) {
    this.userConnectedSub = this.store.select(selectUserConnected).subscribe((connected) => {
      this.userConnected = connected;
      console.log('User connected:', connected);
    });
  }

  ngOnDestroy() {
    this.userConnectedSub.unsubscribe();
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

  onLoginModalDismiss() {
    this.loginModalOpen = false;
    this.bannerOpen = false;
  }

  onBannerDismiss() {
    this.bannerOpen = false;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.open = false; // Close the flyout after navigation
  }

  onLoginSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
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
}
