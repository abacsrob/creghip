import {Component, Input} from '@angular/core';

@Component({
    selector: 'jhi-batched-delete-button',
    templateUrl: './batched-delete-button.component.html',
    styleUrls: ['./batched-delete.shared.css']
})
export class BatchedDeleteButtonComponent {
    @Input() disabled: boolean;
    @Input() messageCode = 'global.menu.entities.deleteSelected';
}
