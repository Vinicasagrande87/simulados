import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Controle de estado da tela
  modo: 'login' | 'cadastro' | 'recuperar' = 'login';

  usuario = { nome: '', email: '', senha: '' };

  constructor(private router: Router, private apiService: ApiService) {}

  fazerLogin() {
    this.apiService.login({ email: this.usuario.email, senha: this.usuario.senha }).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuarioNome', res.usuario?.nome || 'Doutor(a)');
          this.router.navigate(['/home']);
        }
      },
      error: () => alert('E-mail ou senha incorretos.')
    });
  }

  fazerCadastro() {
    this.apiService.cadastrarUsuario(this.usuario).subscribe({
      next: () => {
        alert('Cadastro realizado com sucesso! Agora faça login.');
        this.modo = 'login';
      },
      error: () => alert('Erro ao cadastrar. Tente outro e-mail.')
    });
  }

  recuperarSenha() {
    alert('Funcionalidade em desenvolvimento: Um e-mail será enviado para ' + this.usuario.email);
    this.modo = 'login';
  }
}