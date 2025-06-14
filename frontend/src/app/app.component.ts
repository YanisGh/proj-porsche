import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PorscheDesignSystemModule, FooterComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proj-porsche';
}
