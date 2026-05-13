import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { HomeComponent } from './pages/home/home';
import { CadastroComponent } from './pages/cadastro/cadastro';
import { CadastroProfessorComponent } from './pages/cadastro-professor/cadastro-professor';
// NOVOS IMPORTS DAS PÁGINAS QUE VOCÊ CRIOU
import { GestaoSimuladosComponent } from './pages/gestao-simulados/gestao-simulados';
import { NovoSimuladoComponent } from './pages/novo-simulado/novo-simulado';
import { MeusAlunosComponent } from './pages/meus-alunos/meus-alunos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: CadastroComponent },
  { path: 'cadastro-professor', component: CadastroProfessorComponent },
  { path: 'home', component: HomeComponent },
  
  // ROTAS NOVAS PARA O PROFESSOR
  { path: 'gestao-simulados', component: GestaoSimuladosComponent },
  { path: 'novo-simulado', component: NovoSimuladoComponent },
  { path: 'meus-alunos', component: MeusAlunosComponent },

  { path: '**', redirectTo: 'login' }
];