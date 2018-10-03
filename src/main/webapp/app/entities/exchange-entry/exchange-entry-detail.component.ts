import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {IExchangeEntry} from 'app/shared/model/exchange-entry.model';

@Component({
    selector: 'jhi-exchange-entry-detail',
    templateUrl: './exchange-entry-detail.component.html'
})
export class ExchangeEntryDetailComponent implements OnInit {
    exchangeEntry: IExchangeEntry;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ exchangeEntry }) => {
            this.exchangeEntry = exchangeEntry;
        });
    }

    previousState() {
        window.history.back();
    }
}
