import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PorscheDesignSystemModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'proj-porsche';
}
