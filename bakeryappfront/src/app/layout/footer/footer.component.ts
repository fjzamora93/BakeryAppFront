import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PrivacyPoliticComponent } from '../privacy-politic/privacy-politic.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
    

    constructor(
        public dialog: MatDialog
    ) {}

    onOpeningPolicy() {
        this.dialog.open(PrivacyPoliticComponent, {
            width: '600px', 
            height: '90vh',
            backdropClass: 'custom-backdrop', 
            data: {
                
            }
        });
    }

}
