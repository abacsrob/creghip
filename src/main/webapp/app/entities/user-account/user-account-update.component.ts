import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JhiAlertService} from 'ng-jhipster';

import {IUserAccount} from 'app/shared/model/user-account.model';
import {UserAccountService} from './user-account.service';
import {ICurrency} from 'app/shared/model/currency.model';
import {CurrencyService} from 'app/entities/currency';
import {IAutocompleteService} from "app/entities/entity.module";

@Component({
    selector: 'jhi-user-account-update',
    templateUrl: './user-account-update.component.html'
})
export class UserAccountUpdateComponent implements OnInit {
    private _userAccount: IUserAccount;
    isSaving: boolean;

    currencies: ICurrency[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private userAccountService: UserAccountService,
        private currencyService: CurrencyService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ userAccount }) => {
            this.userAccount = userAccount;
        });
        this.currencyService.query({ filter: 'useraccount-is-null' }).subscribe(
            (res: HttpResponse<ICurrency[]>) => {
                if (!this.userAccount.currency || !this.userAccount.currency.id) {
                    this.currencies = res.body;
                } else {
                    this.currencyService.find(this.userAccount.currency.id).subscribe(
                        (subRes: HttpResponse<ICurrency>) => {
                            this.currencies = [subRes.body].concat(res.body);
                        },
                        (subRes: HttpErrorResponse) => this.onError(subRes.message)
                    );
                }
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    getUserAccountService(): IAutocompleteService {
        return this.userAccountService;
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.userAccount.id !== undefined) {
            this.subscribeToSaveResponse(this.userAccountService.update(this.userAccount));
        } else {
            this.subscribeToSaveResponse(this.userAccountService.create(this.userAccount));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<IUserAccount>>) {
        result.subscribe((res: HttpResponse<IUserAccount>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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

    trackCurrencyById(index: number, item: ICurrency) {
        return item.id;
    }
    get userAccount() {
        return this._userAccount;
    }

    set userAccount(userAccount: IUserAccount) {
        this._userAccount = userAccount;
    }
}
