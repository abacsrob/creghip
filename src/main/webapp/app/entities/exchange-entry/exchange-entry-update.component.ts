import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';

import {IExchangeEntry} from 'app/shared/model/exchange-entry.model';
import {ExchangeEntryService} from './exchange-entry.service';

@Component({
    selector: 'jhi-exchange-entry-update',
    templateUrl: './exchange-entry-update.component.html'
})
export class ExchangeEntryUpdateComponent implements OnInit {
    private _exchangeEntry: IExchangeEntry;
    isSaving: boolean;

    constructor(private exchangeEntryService: ExchangeEntryService, private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ exchangeEntry }) => {
            this.exchangeEntry = exchangeEntry;
        });
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.exchangeEntry.id !== undefined) {
            this.subscribeToSaveResponse(this.exchangeEntryService.update(this.exchangeEntry));
        } else {
            this.subscribeToSaveResponse(this.exchangeEntryService.create(this.exchangeEntry));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IExchangeEntry>>) {
        result.subscribe((res: HttpResponse<IExchangeEntry>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }
    get exchangeEntry() {
        return this._exchangeEntry;
    }

    set exchangeEntry(exchangeEntry: IExchangeEntry) {
        this._exchangeEntry = exchangeEntry;
    }
}
