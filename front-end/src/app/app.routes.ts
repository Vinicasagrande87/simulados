import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';

export const routes: Routes = [
  // 1. Se o link for vazio (ex: www.seusite.com), manda para /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Rota da página de login e cadastro
  { path: 'login', component: LoginComponent },
  
  // 3. Rota da Home (Rosa Interativa)
  { path: 'home', component: HomeComponent },

  // 4. Se o usuário digitar qualquer besteira na URL, volta pro login
  { path: '**', redirectTo: 'login' }
];