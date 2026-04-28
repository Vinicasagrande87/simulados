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
  usuario = { email: '', senha: '' };

  constructor(
    private router: Router, 
    private apiService: ApiService
  ) {}

  fazerLogin() {
    console.log('Tentando logar...', this.usuario.email);

    this.apiService.login(this.usuario).subscribe({
      next: (res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('usuarioNome', res.usuario?.nome || '');
          this.router.navigate(['/home']);
        }
      },
      error: (err: any) => {
        console.error('Erro no login:', err);
        alert('Falha na autenticação: Verifique e-mail e senha.');
      }
    });
  }
}