import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-gestao-simulados',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gestao-simulados.html',
  styleUrls: ['./gestao-simulados.css']
})
export class GestaoSimuladosComponent implements OnInit {
  // Lista fake para testar o layout
  simulados: any[] = [
    { id: 1, titulo: 'Simulado Anatomia I', questoes_count: 10, data_criacao: new Date() },
    { id: 2, titulo: 'Simulado Bioética', questoes_count: 5, data_criacao: new Date() }
  ];

  constructor(private router: Router, private apiService: ApiService) {}

  ngOnInit(): void {
    // Futuramente chamaremos: this.apiService.getSimulados().subscribe(...)
  }

  editar(id: number) {
    console.log('Editar simulado:', id);
    // this.router.navigate(['/editar-simulado', id]);
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este simulado?')) {
      console.log('Excluir simulado:', id);
    }
  }

  voltar() {
    this.router.navigate(['/home']);
  }
}