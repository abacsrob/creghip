import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JhiAlertService} from 'ng-jhipster';

import {ITransaction} from 'app/shared/model/transaction.model';
import {TransactionService} from './transaction.service';
import {ITransactionGroup} from 'app/shared/model/transaction-group.model';
import {TransactionGroupService} from 'app/entities/transaction-group';
import {IExchangeEntry} from "app/shared/model/exchange-entry.model";
import {ExchangeEntryService} from "app/entities/exchange-entry";

@Component({
    selector: 'jhi-transaction-update',
    templateUrl: './transaction-update.component.html'
})
export class TransactionUpdateComponent implements OnInit {
    private _transaction: ITransaction;
    isSaving: boolean;

    transactiongroups: ITransactionGroup[];
    exchangeEntries: IExchangeEntry[];
    transactionDateDp: any;

    constructor(
        private jhiAlertService: JhiAlertService,
        private transactionService: TransactionService,
        private transactionGroupService: TransactionGroupService,
        private exchangeEntryService: ExchangeEntryService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ transaction }) => {
            this.transaction = transaction;
        });
        this.transactionGroupService.query().subscribe(
            (res: HttpResponse<ITransactionGroup[]>) => {
                this.transactiongroups = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
        this.exchangeEntryService.query().subscribe(
            (res: HttpResponse<IExchangeEntry[]>) => {
                this.exchangeEntries = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.transaction.id !== undefined) {
            this.subscribeToSaveResponse(this.transactionService.update(this.transaction));
        } else {
            this.subscribeToSaveResponse(this.transactionService.create(this.transaction));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITransaction>>) {
        result.subscribe((res: HttpResponse<ITransaction>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError() {
        this.isSaving = false;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    trackExchangeEntryById(index: number, item: IExchangeEntry) {
        return item.id;
    }

    trackTransactionGroupById(index: number, item: ITransactionGroup) {
        return item.id;
    }

    get transaction() {
        return this._transaction;
    }

    set transaction(transaction: ITransaction) {
        this._transaction = transaction;
    }
}
