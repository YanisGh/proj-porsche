import { Component, OnInit } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { CommonModule } from '@angular/common';
import { ModelsService } from '../../services/models.service';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';
import { Router } from '@angular/router';

// Define the strict type accepted by <p-model-signature>
export type PorscheModel =
  | '718'
  | '911'
  | 'boxster'
  | 'cayenne'
  | 'cayman'
  | 'macan'
  | 'panamera'
  | 'taycan'
  | 'turbo-s'
  | 'turbo';

@Component({
  selector: 'app-models',
  imports: [CommonModule, HeroComponent, PorscheDesignSystemModule],
  templateUrl: './models.component.html',
  styleUrl: './models.component.scss'
})
export class ModelsComponent implements OnInit {
  baseModels: string[] = [];
  loading = true;
  error = '';
  errorBannerOpen = true;

  // Limit list to known valid model keys
  validModels: PorscheModel[] = [
    '718', '911', 'boxster', 'cayenne',
    'cayman', 'macan', 'panamera',
    'taycan', 'turbo-s', 'turbo'
  ];

  excludedModels: string[] = [
    "Turbo 2 911 Gt2", "Turbo", "Carrera 2 911 GT3", "Turbo GT2", "Turbo 2 911 GT2",
    "Turbo 4 911 S", "Turbo Kit", "Carrera 2 Coupe Kit", "Turbo 4 911 Kit",
    "New 911 Carrera", "Turbo 4 911 Turbo Cab S", "Carrera 4 S Targa",
    "Carrera 4 Targa", "Turbo 4 911", "Turbo 4 911 Cab", "Carrera 4",
    "Carrera 2 Cabriolet Kit", "Carrera 4 Cabriolet Kit", "Carrera 4 S Cabriolet Kit",
    "Turbo 4 911 Cab Kit", "Carrera 4 S Kit", "Turbo 4 911 Turbo",
    "Carrera 4 S Coupe", "Carrera 2 S Coupe", "Carrera 4 S Cabriolet",
    "Carrera 4 Coupe", "Carrera 4 S", "Carrera 2 Coupe", "Targa", "Boxster", "Cayman",
    "Carrera 2 S Cabriolet", "Carrera 4 Cabriolet", "Carrera 2 Cabriolet", "Carrera",
  ];

  constructor(private modelsService: ModelsService, private router: Router) {}

  private fetchBaseModels() {
    this.modelsService.getBaseModels().subscribe({
      next: (res) => {
        this.baseModels = res.values.filter(base => !this.excludedModels.includes(base));
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Sorry, we could not load the car models.';
        this.errorBannerOpen = true;
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.fetchBaseModels();
  }

  isValidModel(model: string): model is PorscheModel {
    return this.validModels.includes(model as PorscheModel);
  }

  getValidModelOrFallback(model: string): PorscheModel {
  const lower = model.toLowerCase();
  return this.isValidModel(lower) ? lower : '911';
}

  getModelImage(base: string): string {
    console.log(`Getting image for model: ${base}`);
    const normalized = base.toLowerCase().replace(/\s+/g, '');
    // 911 -> 911.jpg, cayenne -> cayenne.jpg
    const available = [
      '924.jpg' ,'928.jpg', '911.jpg', '718.jpg', '968.jpg',
      'panamera.jpg', 'taycan.jpg', 'turbo-s.jpg',
      'cayenne.jpg', 'macan.jpg', '944.jpg', '918spyder.jpg', 'carreragt.jpg',
    ];
    // If you add model images like 911.jpg, cayenne.jpg, etc., add them to available
    if (available.includes(`${normalized}.jpg`)) {
      console.log(`Image found for model: ${normalized}`);
      return `assets/images/cars/${normalized}.jpg`;
    }
    // pr le fallback
    return 'assets/images/hero-models.jpg';
  }

  onBaseModelClick(base: string) {
    this.router.navigate(['/submodels', base]);
  }

  reloadBaseModels() {
    this.loading = true;
    this.error = '';
    this.errorBannerOpen = false;
    this.fetchBaseModels();
  }

}
