import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JhiAlertService} from 'ng-jhipster';

import {ITransactionGroup} from 'app/shared/model/transaction-group.model';
import {TransactionGroupService} from './transaction-group.service';
import {IUserAccount} from 'app/shared/model/user-account.model';
import {UserAccountService} from 'app/entities/user-account';

@Component({
    selector: 'jhi-transaction-group-update',
    templateUrl: './transaction-group-update.component.html'
})
export class TransactionGroupUpdateComponent implements OnInit {
    private _transactionGroup: ITransactionGroup;
    isSaving: boolean;

    useraccounts: IUserAccount[];

    constructor(
        private jhiAlertService: JhiAlertService,
        private transactionGroupService: TransactionGroupService,
        private userAccountService: UserAccountService,
        private activatedRoute: ActivatedRoute
    ) {}

    ngOnInit() {
        this.isSaving = false;
        this.activatedRoute.data.subscribe(({ transactionGroup }) => {
            this.transactionGroup = transactionGroup;
        });
        this.userAccountService.query().subscribe(
            (res: HttpResponse<IUserAccount[]>) => {
                this.useraccounts = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }

    previousState() {
        window.history.back();
    }

    save() {
        this.isSaving = true;
        if (this.transactionGroup.id !== undefined) {
            this.subscribeToSaveResponse(this.transactionGroupService.update(this.transactionGroup));
        } else {
            this.subscribeToSaveResponse(this.transactionGroupService.create(this.transactionGroup));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ITransactionGroup>>) {
        result.subscribe((res: HttpResponse<ITransactionGroup>) => this.onSaveSuccess(), (res: HttpErrorResponse) => this.onSaveError());
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
    get transactionGroup() {
        return this._transactionGroup;
    }

    set transactionGroup(transactionGroup: ITransactionGroup) {
        this._transactionGroup = transactionGroup;
    }
}
