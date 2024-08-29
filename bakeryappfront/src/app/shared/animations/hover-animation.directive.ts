import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverAnimation]',
  standalone: true,
})
export class HoverAnimationDirective {
    constructor(private el: ElementRef) {}
  
    @HostListener('mouseenter') onMouseEnter() {
      this.animate('enter');
    }
  
    @HostListener('mouseleave') onMouseLeave() {
      this.animate('leave');
    }
  
    private animate(action: 'enter' | 'leave') {
      // Aplicar una animación diferente en el evento 'mouseenter' y 'mouseleave'
      if (action === 'enter') {
        // Aquí añadimos una combinación de transformaciones para hacer el efecto más dinámico
        this.el.nativeElement.style.transition = 'transform 0.5s, rotate 0.5s';
        this.el.nativeElement.style.transform = 'scale(1.1) rotate(10deg)';
      } else {
        // Volvemos al estado inicial
        this.el.nativeElement.style.transition = 'transform 0.5s, rotate 0.5s';
        this.el.nativeElement.style.transform = 'scale(1) rotate(0deg)';
      }
  
      // Efecto de vibración adicional al entrar
      if (action === 'enter') {
        this.el.nativeElement.style.animation = 'shake 0.5s';
        setTimeout(() => {
          this.el.nativeElement.style.animation = ''; // Eliminar la animación para evitar que se repita
        }, 500);
      }
    }
  }