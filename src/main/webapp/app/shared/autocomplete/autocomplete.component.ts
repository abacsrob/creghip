import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {IAutocompleteable, IAutocompleteService} from 'app/entities/entity.module';
import {HttpResponse} from '@angular/common/http';

@Component({
    selector: 'jhi-autocomplete',
    host: {
        '(document:click)': 'handleClick($event)',
    },
    templateUrl: './autocomplete.component.html',
    styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {
    public query = '';
    items: IAutocompleteable[] = [];
    public filteredList: IAutocompleteable[] = [];
    @Input() elementRef: ElementRef;
    @Input() resultObservable;
    @Input() label?: string;
    @Input() targetFieldName;

    ngOnInit(): void {
        (<IAutocompleteService>this.resultObservable).getAutocompleteObservable().subscribe(
            (p: HttpResponse<IAutocompleteable[]>) => {
                p.body.map((v: IAutocompleteable) => {
                    v.autocompletableItem = v[this.targetFieldName];
                });
                this.items = p.body;
            });
    }

    filter() {
        if (this.query !== '') {
            this.filteredList = this.items.filter((item: IAutocompleteable) => {
                return item.autocompletableItem.toLowerCase().indexOf(this.query.toLowerCase()) > -1;
            });
        } else {
            this.filteredList = this.items;
        }
    }

    select(item) {
        this.query = item.autocompletableItem;
        this.filteredList = [];
    }

    handleClick(event) {
        console.log('In handleClick with elementRef ' + this.elementRef);
        let clickedComponent = event.target;
        let inside = false;
        do {
            if (clickedComponent === this.elementRef.nativeElement) {
                inside = true;
            }
            clickedComponent = clickedComponent.parentNode;
        } while (clickedComponent);
        if (!inside) {
            this.filteredList = [];
        }
    }
}
