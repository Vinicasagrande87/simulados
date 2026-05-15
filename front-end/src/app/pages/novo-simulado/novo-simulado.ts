import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

interface Alternativa {
  texto: string;
}

interface Questao {
  texto: string;
  correta_index: number | null;
}

@Component({
  selector: 'app-novo-simulado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './novo-simulado.html',
  styleUrls: ['./novo-simulado.css']
})
export class NovoSimuladoComponent {
  
  simulado = { titulo: '' };
  questao: Questao = { texto: '', correta_index: null };
  
  // Agora apenas 4 alternativas (A, B, C, D)
  alternativas: Alternativa[] = [
    { texto: '' }, 
    { texto: '' }, 
    { texto: '' }, 
    { texto: '' }
  ];

  constructor(private apiService: ApiService, private router: Router) {}

  salvarSimulado(): void {
    if (this.questao.correta_index === null) {
      alert('Por favor, selecione a alternativa correta.');
      return;
    }
    console.log('Salvando Simulado...');
    alert('Questão registrada com sucesso!');
    this.router.navigate(['/gestao-simulados']);
  }

  voltar(): void {
    this.router.navigate(['/gestao-simulados']);
  }
}