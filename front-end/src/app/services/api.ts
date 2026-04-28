import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Sua URL do Render
  private readonly API_URL = 'https://simulados.onrender.com'; 

  constructor(private http: HttpClient) { }

  // --- MÉTODOS DE AUTENTICAÇÃO ---

  login(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, dados);
  }

  // Função para salvar os dados do usuário e o token após o login
  setUsuarioLogado(dados: any) {
    localStorage.setItem('token', dados.token);
    localStorage.setItem('user_tipo', dados.usuario.tipo);
    localStorage.setItem('user_nome', dados.usuario.nome);
  }

  // Função para saber qual o tipo do usuário logado (admin, professor ou aluno)
  getTipoUsuario(): string | null {
    return localStorage.getItem('user_tipo');
  }

  // Função para pegar o token e mandar nas requisições protegidas
  getToken() {
    return localStorage.getItem('token');
  }

  // --- MÉTODOS DE USUÁRIO ---

  // Cadastro público (Sempre cria Aluno no Back-end por segurança)
  cadastrarUsuario(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios`, dados);
  }

  // ROTA EXCLUSIVA DO ADMIN: Para cadastrar novos professores
  cadastrarProfessor(dados: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    // Chamando a rota VIP que criamos no back-end
    return this.http.post(`${this.API_URL}/admin/cadastrar-professor`, dados, { headers });
  }

  // Listar usuários (Apenas para Admin ou Professor)
  getUsuarios(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
    return this.http.get(`${this.API_URL}/usuarios`, { headers });
  }

  // Logout
  limparSessao() {
    localStorage.clear();
  }
}