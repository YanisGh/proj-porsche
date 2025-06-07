import { Component } from '@angular/core';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [PorscheDesignSystemModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  open = false;
  loginModalOpen = false;

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
  }

  onLoginSubmit() {
    // Handle login submission
    console.log('Login submitted');
  }
}
