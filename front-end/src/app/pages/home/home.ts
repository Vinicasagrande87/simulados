import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; // Adicionado Schema aqui
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';
import { IonicModule } from '@ionic/angular'; 
import { addIcons } from 'ionicons';
import { star, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Adicionado aqui para aceitar ion-icon
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  usuarioNome: string = '';
  isAdmin: boolean = false;
  isProfessor: boolean = false; 
  
  tooltipText: string = '';
  tooltipVisible: boolean = false;
  tooltipLeft: number = 0;
  tooltipTop: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {
    addIcons({ 
      'star': star, 
      'log-out-outline': logOutOutline 
    });
  }

  ngOnInit(): void {
    this.usuarioNome = localStorage.getItem('user_nome') || 'Usuário';
    
    const tipo = this.apiService.getTipoUsuario();
    this.isAdmin = tipo === 'admin';
    this.isProfessor = tipo === 'professor';
    
    if (!this.apiService.getToken()) {
      this.router.navigate(['/login']);
    }
  }

  navegar(modulo: string): void {
    console.log('Navegando para:', modulo);
    
    if (modulo === 'Professor' && this.isAdmin) {
      this.router.navigate(['/cadastro-professor']);
      return;
    }

    if (modulo === 'Simulados' && this.isProfessor) {
      this.router.navigate(['/gestao-simulados']);
      return;
    }

    if (modulo === 'Desafios' && this.isProfessor) {
      this.router.navigate(['/meus-alunos']);
      return;
    }

    const rota = modulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    this.router.navigate([`/${rota}`]);
  }

  showTooltip(event: MouseEvent): void {
    const elemento = event.target as SVGElement;
    let nome = elemento.getAttribute('data-name') || '';
    
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