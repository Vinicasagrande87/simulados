import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  usuarioNome: string = '';
  isAdmin: boolean = false;
  isProfessor: boolean = false; // Identifica o nível de acesso do professor
  
  tooltipText: string = '';
  tooltipVisible: boolean = false;
  tooltipLeft: number = 0;
  tooltipTop: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.usuarioNome = localStorage.getItem('user_nome') || 'Usuário';
    
    // Pega o tipo de usuário do serviço para definir as permissões na tela
    const tipo = this.apiService.getTipoUsuario();
    this.isAdmin = tipo === 'admin';
    this.isProfessor = tipo === 'professor';
    
    if (!this.apiService.getToken()) {
      this.router.navigate(['/login']);
    }
  }

  navegar(modulo: string): void {
    console.log('Navegando para:', modulo);
    
    // REGRA PARA ADMIN: Cadastrar Professores
    if (modulo === 'Professor' && this.isAdmin) {
      this.router.navigate(['/cadastro-professor']);
      return;
    }

    // REGRAS PARA PROFESSOR:
    // Se clicar em Simulados, vai para a área de gestão (novo/editar/excluir)
    if (modulo === 'Simulados' && this.isProfessor) {
      this.router.navigate(['/gestao-simulados']);
      return;
    }

    // Se clicar em Desafios (ou Alunos), vai para a lista de histórico
    if (modulo === 'Desafios' && this.isProfessor) {
      this.router.navigate(['/meus-alunos']);
      return;
    }

    // Navegação padrão para Alunos ou outras pétalas
    const rota = modulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    this.router.navigate([`/${rota}`]);
  }

  showTooltip(event: MouseEvent): void {
    const elemento = event.target as SVGElement;
    let nome = elemento.getAttribute('data-name') || '';
    
    // Personaliza o texto do balão dependendo de quem está logado
    if (nome === 'Professor' && this.isAdmin) {
      nome = 'Cadastrar Professor';
    } else if (nome === 'Simulados' && this.isProfessor) {
      nome = 'Gerenciar Simulados';
    } else if (nome === 'Desafios' && this.isProfessor) {
      nome = 'Histórico de Alunos';
    }

    this.tooltipText = nome;
    this.tooltipVisible = true;
    this.tooltipLeft = event.clientX + 10;
    this.tooltipTop = event.clientY + 10;
  }

  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipText = '';
  }

  logout(): void {
    this.apiService.limparSessao();
    this.router.navigate(['/login']);
  }
}