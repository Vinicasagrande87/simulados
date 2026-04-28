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

  // Objeto de usuário para o formulário
  usuario = { nome: '', email: '', senha: '', tipo: 'aluno' };

  constructor(private router: Router, private apiService: ApiService) {}

  fazerLogin() {
    this.apiService.login({ email: this.usuario.email, senha: this.usuario.senha }).subscribe({
      next: (res: any) => {
        // Usamos o método que criamos no ApiService para salvar TUDO (Token, Tipo e Nome)
        this.apiService.setUsuarioLogado(res);

        // --- LÓGICA DE REDIRECIONAMENTO INTELIGENTE ---
        const tipo = this.apiService.getTipoUsuario();

        if (tipo === 'admin') {
          // Se for admin, você pode mandar para uma Home especial ou para a mesma, 
          // mas o sistema já saberá quem você é.
          console.log('Bem-vindo, Administrador!');
          this.router.navigate(['/home']); 
        } else {
          // Se for aluno, segue para a home normal
          this.router.navigate(['/home']);
        }
      },
      error: () => alert('E-mail ou senha incorretos.')
    });
  }

  fazerCadastro() {
    // Garante que todo cadastro feito por essa tela pública seja 'aluno'
    const dadosCadastro = { ...this.usuario, tipo: 'aluno' };

    this.apiService.cadastrarUsuario(dadosCadastro).subscribe({
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