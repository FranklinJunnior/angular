import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  constructor(private router: Router) {}

  seleccionarSede(sede: string) {
    this.router.navigate(['/cotizar'], { queryParams: { sede: sede } });
  }

}
