import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelsService, PorscheModel } from '../../services/models.service';
import { PorscheDesignSystemModule, type AccordionUpdateEventDetail } from '@porsche-design-system/components-angular';
import { HeroComponent } from '../hero/hero.component';

@Component({
  selector: 'app-submodels',
  imports: [PorscheDesignSystemModule, HeroComponent],
  templateUrl: './submodels.component.html',
  styleUrl: './submodels.component.scss'
})
export class SubmodelsComponent implements OnInit {
  submodels: PorscheModel[] = [];
  loading = true;
  error = '';
  baseModel = '';
  selectedVariant: PorscheModel | null = null;
  accordionOpen = false;
  openAccordions: { [variantId: string]: boolean } = {};
  openSubmodelAccordions: { [subName: string]: boolean } = {};

  constructor(private route: ActivatedRoute, private router: Router, private modelsService: ModelsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const base = params.get('base');
      console.log('Base model from route:', base);
      if (base) {
        this.baseModel = base;
        this.modelsService.findModelsByModelName(base).subscribe({
          next: (res) => {
            this.submodels = res.results;
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load submodels';
            this.loading = false;
          }
        });
      } else {
        this.error = 'No base model specified';
        this.loading = false;
      }
    });
  }

  getModelImage(sub: PorscheModel): string {
    // Example: use base_model or model to determine image
    const normalized = sub.model.toLowerCase().replace(/\s+/g, '');
    const available = [
      '911.jpg', '718.jpg', 'cayenne.jpg', 'macan.jpg', 'panamera.jpg', 'taycan.jpg',
      '918spyder.jpg', '924.jpg', '928.jpg', '944.jpg', '968.jpg', 'carreragt.jpg'
    ];
    if (available.includes(`${normalized}.jpg`)) {
      return `assets/images/cars/${normalized}.jpg`;
    }
    return 'assets/images/hero-models.jpg';
  }

  getRange(arr: (string | number)[]): string {
    // Remove duplicates, sort, and return as range if possible
    const unique = Array.from(new Set(arr)).sort();
    if (unique.length === 1) return unique[0].toString();
    if (unique.length > 1 && typeof unique[0] === 'number') {
      return `${unique[0]}-${unique[unique.length - 1]}`;
    }
    return unique.join(', ');
  }

  getAllUnique(arr: any[], key: string): string {
    return Array.from(new Set(arr.map(item => item[key]))).join(', ');
  }

  get submodelYears(): number[] {
    return this.submodels.map(s => Number(s.year));
  }

  getUniqueSubmodelNames(submodels: PorscheModel[]): string[] {
    return Array.from(new Set(submodels.map(s => s.model)));
  }

  getYearsForSubmodel(subName: string): number[] {
    return this.submodels
      .filter(s => s.model === subName)
      .map(s => Number(s.year));
  }

  getAllUniqueForSubmodel(subName: string, key: keyof PorscheModel): string {
    return Array.from(new Set(
      this.submodels.filter(s => s.model === subName).map(s => s[key])
    )).join(', ');
  }

  getVariantsForSubmodel(subName: string): PorscheModel[] {
    return this.submodels.filter(s => s.model === subName);
  }
  
  getCylindersWithDisplacement(arrOrSubName: any[] | string): string {
    let variants: any[];
    
    if (typeof arrOrSubName === 'string') {
      // If string is passed, filter submodels for that submodel name
      variants = this.submodels.filter(s => s.model === arrOrSubName);
    } else {
      // If array is passed, use it directly
      variants = arrOrSubName;
    }
    
    const combinations = variants.map(item => `${item.cylinders} cyl / ${item.displ}L`);
    return Array.from(new Set(combinations)).join(', ');
  }

  // Helper method to get MPG range
  getMPGRange(arr: any[], mpgKey: string): string {
    const mpgValues = arr.map(item => Number(item[mpgKey])).filter(val => !isNaN(val) && val > 0);
    if (mpgValues.length === 0) return 'N/A';
    
    const min = Math.min(...mpgValues);
    const max = Math.max(...mpgValues);
    
    if (min === max) return min.toString();
    return `${min} to ${max}`;
  }

  onClickAccordion(variantId: string, open: boolean) {
    // Close all, then open only the selected one if open=true
    this.openAccordions = {};
    if (open) {
      this.openAccordions[variantId] = true;
    }
  }

  onClickSubmodelAccordion(subName: string, open: boolean) {
    // Close all, then open only the selected one if open=true
    this.openSubmodelAccordions = {};
    if (open) {
      this.openSubmodelAccordions[subName] = true;
    }
  }

  goBackToModels() {
    this.router.navigate(['/models']);
  }

}
