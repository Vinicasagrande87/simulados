import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router'; // Importante para o routerLink funcionar
import { ApiService } from '../../services/api';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  modo: 'login' | 'recuperar' = 'login';
  usuario = { email: '', senha: '' };

  constructor(private router: Router, private apiService: ApiService) {}

  fazerLogin() {
    this.apiService.login({ email: this.usuario.email, senha: this.usuario.senha }).subscribe({
      next: (res: any) => {
        this.apiService.setUsuarioLogado(res);
        this.router.navigate(['/home']); // Navega para a Rosa Interativa
      },
      error: () => alert('E-mail ou senha incorretos.')
    });
  }

  recuperarSenha() {
    alert('Instruções enviadas para: ' + this.usuario.email);
    this.modo = 'login';
  }
}