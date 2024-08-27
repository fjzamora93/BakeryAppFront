import { EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module'; // Ruta al módulo de Material

import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';



import { Component } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-formlist',
  standalone: true,
  imports: [ FormsModule, MaterialModule, MatDialogModule, CdkDropList, CdkDrag],
  templateUrl: './formlist.component.html',
  styleUrl: './formlist.component.css'
})
export class FormlistComponent {
    @Input() items: string[] = [];
    @Output() itemsChange = new EventEmitter<string[]>();
    @Input() formTitle: string = "";

    newItem: string = "";


    addItem() {
        if (this.newItem) {
            this.items.push(this.newItem);
            console.log('Items:', this.items);
            this.newItem = '';
            this.itemsChange.emit(this.items);
        }
    }

    editItem(index: number) {
        this.newItem = this.items[index];
        this.items.splice(index, 1);
        this.itemsChange.emit(this.items);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.items, event.previousIndex, event.currentIndex);
      }
}
