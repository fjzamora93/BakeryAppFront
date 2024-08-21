import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material/material.module'; // Ruta al módulo de Material



@Component({
  selector: 'app-header',
  standalone: true,
  
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
    imports: [CommonModule, MaterialModule]
})
export class HeaderComponent {}
