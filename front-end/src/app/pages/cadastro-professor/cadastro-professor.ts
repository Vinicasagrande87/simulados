import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro-professor',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cadastro-professor.html',
  styleUrls: ['./cadastro-professor.css']
})
export class CadastroProfessorComponent {
  // Objeto montado conforme suas migrations
  professor = {
    nome: '',
    email: '',
    senha: '',
    tipo: 'professor',
    especialidade: ''
  };

  constructor(private router: Router, private apiService: ApiService) {
    // Validação para garantir que apenas Admin acesse
    if (this.apiService.getTipoUsuario() !== 'admin') {
      this.router.navigate(['/home']);
    }
  }

  salvarProfessor() {
    this.apiService.cadastrarProfessor(this.professor).subscribe({
      next: () => {
        alert('Professor cadastrado com sucesso!');
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao realizar cadastro do professor.');
      }
    });
  }
}