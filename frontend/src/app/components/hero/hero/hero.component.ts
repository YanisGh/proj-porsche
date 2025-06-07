import { Component, Input } from '@angular/core';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { HeaderComponent } from '../../header/header/header.component';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [PorscheDesignSystemModule, HeaderComponent],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() heroImage: string = 'assets/images/hero.png';
  @Input() heading: string = 'Experience the Future of Performance';
}
