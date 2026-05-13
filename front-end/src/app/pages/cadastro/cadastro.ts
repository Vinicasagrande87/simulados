import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro.html',
  styleUrls: ['./cadastro.css']
})
export class CadastroComponent {
  // Objeto unificado para facilitar o formulário
  usuario = { 
    nome: '', 
    email: '', 
    senha: '', 
    tipo: 'aluno', // Fixo como aluno nesta tela
    curso: 'Medicina', // Valor padrão conforme seu projeto
    semestre: null 
  };

  constructor(private router: Router, private apiService: ApiService) {}

  fazerCadastro() {
    if (!this.usuario.semestre) {
      alert('Por favor, selecione seu semestre.');
      return;
    }

    this.apiService.cadastrarUsuario(this.usuario).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao cadastrar. Verifique se o e-mail já existe.');
      }
    });
  }
}