import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // Aqui você centraliza a URL do Render
  private readonly API_URL = 'https://simulados.onrender.com'; 

  constructor(private http: HttpClient) { }

  // Exemplo de método para buscar dados
  getUsuarios(): Observable<any> {
    return this.http.get(`${this.API_URL}/usuarios`);
  }

  // Exemplo de método para salvar dados
  cadastrarUsuario(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios`, dados);
  }
}