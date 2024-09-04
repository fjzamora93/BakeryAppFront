import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-privacy-politic',
  standalone: true,
  imports: [MatButton],
  templateUrl: './privacy-politic.component.html',
  styleUrl: './privacy-politic.component.css'
})
export class PrivacyPoliticComponent {
    @Input({required:true}) reading!: boolean;
    @Output() readingChange = new EventEmitter<boolean>();
    constructor() { }

    onAccept() {
        this.reading = false;
        this.readingChange.emit(false);
    }

}
