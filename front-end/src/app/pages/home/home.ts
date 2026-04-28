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
  isAdmin: boolean = false; // Variável para controlar o que o Admin vê
  
  // Variáveis para o Tooltip da Rosa
  tooltipText: string = '';
  tooltipVisible: boolean = false;
  tooltipLeft: number = 0;
  tooltipTop: number = 0;

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Pegamos os dados usando o nosso serviço
    this.usuarioNome = localStorage.getItem('user_nome') || 'Usuário';
    this.isAdmin = this.apiService.getTipoUsuario() === 'admin';
    
    // Proteção básica: se não tiver token, volta pro login
    if (!this.apiService.getToken()) {
      this.router.navigate(['/login']);
    }
  }

  // Função para navegar (as pétalas chamam esta função)
  navegar(modulo: string): void {
    console.log('Navegando para:', modulo);
    
    // Lógica especial: Se o Admin clicar em "Professor", ele vai para o cadastro
    if (modulo === 'Professor' && this.isAdmin) {
      this.router.navigate(['/cadastro-professor']);
      return;
    }

    const rota = modulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    this.router.navigate([`/${rota}`]);
  }

  // Mostra o nome da pétala quando o mouse passa por cima
  showTooltip(event: MouseEvent): void {
    const elemento = event.target as SVGElement;
    let nome = elemento.getAttribute('data-name') || '';
    
    // Troca o texto do tooltip se for Admin passando o mouse na pétala de Professor
    if (nome === 'Professor' && this.isAdmin) {
      nome = 'Cadastrar Professor';
    }

    this.tooltipText = nome;
    this.tooltipVisible = true;
    this.tooltipLeft = event.clientX + 10;
    this.tooltipTop = event.clientY + 10;
  }

  // Esconde o nome da pétala quando o mouse sai
  hideTooltip(): void {
    this.tooltipVisible = false;
    this.tooltipText = '';
  }

  logout(): void {
    this.apiService.limparSessao();
    this.router.navigate(['/login']);
  }
}