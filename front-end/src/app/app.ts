import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './app.html', 
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'front-end';
}