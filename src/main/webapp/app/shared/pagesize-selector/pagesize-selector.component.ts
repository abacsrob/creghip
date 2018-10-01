import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'jhi-pagesize-selector',
    templateUrl: './pagesize-selector.component.html',
})
export class PagesizeSelectorComponent {
    @Input() itemsPerPage: number;
    @Output() pageSizeChanged: EventEmitter<number> = new EventEmitter<number>();

    pageSizes = [2, 5, 10, 20];
}
