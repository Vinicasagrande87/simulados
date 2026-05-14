import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL ATUALIZADA: Apontando para o back-end correto no Render
  private readonly API_URL = 'https://simulado-medicina-back.onrender.com'; 

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE AUTENTICAÇÃO ---

  login(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, dados);
  }

  setUsuarioLogado(dados: any) {
    localStorage.setItem('token', dados.token);
    localStorage.setItem('user_tipo', dados.usuario.tipo);
    localStorage.setItem('user_nome', dados.usuario.nome);
  }

  getTipoUsuario(): string | null {
    return localStorage.getItem('user_tipo');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  // --- MÉTODOS DE USUÁRIO ---

  cadastrarUsuario(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios`, dados);
  }

  cadastrarProfessor(dados: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.post(`${this.API_URL}/admin/cadastrar-professor`, dados, { headers });
  }

  getUsuarios(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.API_URL}/usuarios`, { headers });
  }

  limparSessao() {
    localStorage.clear();
  }
}