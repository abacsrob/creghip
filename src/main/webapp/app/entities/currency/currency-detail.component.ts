import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {ICurrency} from 'app/shared/model/currency.model';

@Component({
    selector: 'jhi-currency-detail',
    templateUrl: './currency-detail.component.html'
})
export class CurrencyDetailComponent implements OnInit {
    currency: ICurrency;

    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ currency }) => {
            this.currency = currency;
        });
    }

    previousState() {
        window.history.back();
    }
}
