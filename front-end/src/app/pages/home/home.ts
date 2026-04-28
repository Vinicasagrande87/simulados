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
    this.usuarioNome = localStorage.getItem('usuarioNome') || 'Usuário';
    
    // Proteção básica: se não tiver token, volta pro login
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  // Função para navegar (as pétalas chamam esta função)
  navegar(modulo: string): void {
    console.log('Navegando para:', modulo);
    // Exemplo: se modulo for 'Simulados', ele vai para /simulados
    const rota = modulo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    this.router.navigate([`/${rota}`]);
  }

  // Mostra o nome da pétala quando o mouse passa por cima
  showTooltip(event: MouseEvent): void {
    const elemento = event.target as SVGElement;
    this.tooltipText = elemento.getAttribute('data-name') || '';
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
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}