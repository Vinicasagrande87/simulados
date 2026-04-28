import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home'; // Caminho atualizado para pages
import { LoginComponent } from './pages/login/login'; 

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: '**', redirectTo: 'login' }
];  