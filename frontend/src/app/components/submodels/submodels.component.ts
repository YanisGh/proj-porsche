import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModelsService, PorscheModel } from '../../services/models.service';
import { PorscheDesignSystemModule } from '@porsche-design-system/components-angular';

@Component({
  selector: 'app-submodels',
  imports: [PorscheDesignSystemModule],
  templateUrl: './submodels.component.html',
  styleUrl: './submodels.component.scss'
})
export class SubmodelsComponent implements OnInit {
  submodels: PorscheModel[] = [];
  loading = true;
  error = '';
  baseModel = '';

  constructor(private route: ActivatedRoute, private modelsService: ModelsService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const base = params.get('base');
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
}
