import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent {
  showTooltip(event: MouseEvent) {
    const tooltip = document.getElementById('tooltip');
    const target = event.target as SVGPathElement;
    const name = target.getAttribute('data-name');
    if (tooltip && name) {
      tooltip.innerText = name;
      tooltip.style.display = 'block';
      tooltip.style.left = (event.clientX + 15) + 'px';
      tooltip.style.top = (event.clientY + 15) + 'px';
    }
  }

  hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) tooltip.style.display = 'none';
  }

  navegar(destino: string) {
    console.log('Navegando para:', destino);
  }
}