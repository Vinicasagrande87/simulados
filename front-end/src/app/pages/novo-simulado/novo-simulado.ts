import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-novo-simulado',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './novo-simulado.html',
  styleUrls: ['./novo-simulado.css']
})
export class NovoSimuladoComponent {
  questao: { [key: string]: any } = {
    titulo_simulado: '',
    enunciado: '',
    alternativa_a: '',
    alternativa_b: '',
    alternativa_c: '',
    alternativa_d: '',
    alternativa_e: '',
    correta: 'a'
  };

  constructor(private apiService: ApiService, private router: Router) {}

  salvarQuestao() {
    console.log('Salvando questão para o banco:', this.questao);
    alert('Questão registrada!');
    this.router.navigate(['/home']);
  }
}