import { Routes } from '@angular/router';
import { ModelsComponent } from './components/models/models.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'models', component: ModelsComponent },
];
