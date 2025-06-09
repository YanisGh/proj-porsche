import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [PorscheDesignSystemModule, NgClass],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent {
  @Input() heroImage: string = 'assets/images/hero.png';
  @Input() heading: string = 'Experience the Future of Performance.';
  @Input() mainPage: boolean = true;
}
