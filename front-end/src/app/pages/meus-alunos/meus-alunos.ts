import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meus-alunos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-alunos.html',
  styleUrls: ['./meus-alunos.css']
})
export class MeusAlunosComponent {
  constructor(private router: Router) {}

  voltar() {
    this.router.navigate(['/home']);
  }
}