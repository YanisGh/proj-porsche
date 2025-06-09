import { Routes } from '@angular/router';
import { ModelsComponent } from './components/models/models.component';
import { GarageComponent } from './components/garage/garage.component';
import { HomeComponent } from './components/home/home.component';
import { SubmodelsComponent } from './components/submodels/submodels.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'models', component: ModelsComponent },
    { path: 'garage', component: GarageComponent },
    { path: 'submodels/:base', component: SubmodelsComponent },
    //{ path: 'garage', loadComponent: () => import('./components/garage/garage.component').then(m => m.GarageComponent) },
];
