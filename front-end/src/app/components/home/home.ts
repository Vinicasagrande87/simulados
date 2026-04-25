import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {

  constructor(private router: Router) {}

  navegar(destino: string) {
    console.log('Navegando para:', destino);
    
    // Como você está no projeto Simulado Medicina, pode direcionar as rotas aqui
    if (destino === 'petala1') {
      // this.router.navigate(['/outra-rota']); 
      alert('Você clicou na Pétala 1!');
    } else {
      alert('Navegando para: ' + destino);
    }
  }
}