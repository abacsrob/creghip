import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JhiAlertService} from 'ng-jhipster';

import {ICurrency} from 'app/shared/model/currency.model';
import {CurrencyService} from './currency.service';
import {IUserAccount} from 'app/shared/model/user-account.model';
import {UserAccountService} from 'app/entities/user-account';
import {IAutocompleteService} from 'app/entities/entity.module';

@Component({
    selector: 'jhi-currency-update',
    templateUrl: './currency-update.component.html'
})
export class CurrencyUpdateComponent implements OnInit {
    private _currency: ICurrency;
    isSaving: boolean;

    useraccounts: IUserAccount[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private currencyService: CurrencyService,
        private userAccountService: UserAccountService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ currency }) => {
            this.currency = currency;
        });
        this.userAccountService.query().subscribe(
            (res: HttpResponse<IUserAccount[]>) => {
                this.useraccounts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    getCurrencyService(): IAutocompleteService {
        return this.currencyService;
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.currency.id !== undefined) {
            this.subscribeToSaveResponse(this.currencyService.update(this.currency));
        } else {
            this.subscribeToSaveResponse(this.currencyService.create(this.currency));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ICurrency>>) {
        result.subscribe((res: HttpResponse<ICurrency>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackUserAccountById(index: number, item: IUserAccount) {
        return item.id;
    }
    get currency() {
        return this._currency;
    }

    set currency(currency: ICurrency) {
        this._currency = currency;
    }
}
