import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home'; // Removido o .component

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Define a Home como página inicial
];