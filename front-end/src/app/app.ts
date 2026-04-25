import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html', // Mudamos de app.component.html para app.html
  styleUrl: './app.css'      // Verifique se o seu arquivo de estilo é app.css ou app.component.css
})
export class AppComponent {
  title = 'front-end';
}