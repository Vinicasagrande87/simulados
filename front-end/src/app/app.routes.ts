import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { CadastroProfessorComponent } from './pages/cadastro-professor/cadastro-professor'; // Import novo

export const routes: Routes = [
  // 1. Redirecionamento inicial: se acessar a raiz, vai para o login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Rota para a página de Login
  { path: 'login', component: LoginComponent },
  
  // 3. Rota para Cadastro de Alunos (Página pública)
  { path: 'cadastro', component: CadastroComponent },
  
  // 4. Rota para Cadastro de Professores (Página restrita ao Admin)
  { path: 'cadastro-professor', component: CadastroProfessorComponent },
  
  // 5. Home (Onde fica a Rosa Interativa)
  { path: 'home', component: HomeComponent },

  // 6. Rota curinga: qualquer URL desconhecida volta para o login
  { path: '**', redirectTo: 'login' }
];