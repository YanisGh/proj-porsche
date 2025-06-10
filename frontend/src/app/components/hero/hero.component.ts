import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { PorscheModel as PorscheModelSignature } from '../models/models.component';

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
  @Input() subModelPage: boolean = false;
  @Input() model: string = '911';

  // Valid models for p-model-signature
  validModels: PorscheModelSignature[] = [
    '718', '911', 'boxster', 'cayenne',
    'cayman', 'macan', 'panamera',
    'taycan', 'turbo-s', 'turbo'
  ];

  isValidModel(model: string): model is PorscheModelSignature {
    return this.validModels.includes(model as PorscheModelSignature);
  }

  getValidModelOrFallback(model: string): PorscheModelSignature {
    const lower = model.toLowerCase();
    return this.isValidModel(lower) ? lower : '911';
  }

}
