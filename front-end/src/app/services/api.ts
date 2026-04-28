import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'https://simulados.onrender.com'; 

  constructor(private http: HttpClient) { }

  login(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/login`, dados);
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.API_URL}/usuarios`);
  }

  cadastrarUsuario(dados: any): Observable<any> {
    return this.http.post(`${this.API_URL}/usuarios`, dados);
  }
}