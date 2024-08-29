import { Component } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../shared/material/material.module'; // Ruta al módulo de Material
import { RouterLink } from "@angular/router";
import { HoverAnimationDirective } from "../../shared/animations/hover-animation.directive";



@Component({
  selector: 'app-header',
  standalone: true,
  
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
    imports: [CommonModule, MaterialModule, RouterLink, HoverAnimationDirective]
})
export class HeaderComponent {}
