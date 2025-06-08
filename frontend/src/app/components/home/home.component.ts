import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@Component({
  selector: 'app-home',
  imports: [HeroComponent, PorscheDesignSystemModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
