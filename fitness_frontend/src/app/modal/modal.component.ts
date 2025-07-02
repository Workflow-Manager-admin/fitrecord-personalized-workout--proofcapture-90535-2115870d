import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="modal-backdrop" (click)="backdropClose ? close() : null">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close-btn" (click)="close()" aria-label="Close">&times;</button>
        <h3 *ngIf="title">{{title}}</h3>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class ModalComponent {
  @Input() title = '';
  @Input() backdropClose = true;
  @Output() closed = new EventEmitter<void>();
  close() { this.closed.emit(); }
}
