import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular'; // Importação necessária
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule], // Adicionado IonicModule aqui
  templateUrl: './app.html', 
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'front-end';
}