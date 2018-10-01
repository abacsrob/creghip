import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {UserRouteAccessService} from 'app/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ITransaction, Transaction} from 'app/shared/model/transaction.model';
import {TransactionService} from './transaction.service';
import {TransactionComponent} from './transaction.component';
import {TransactionDetailComponent} from './transaction-detail.component';
import {TransactionUpdateComponent} from './transaction-update.component';
import {TransactionDeletePopupComponent} from './transaction-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class TransactionResolve implements Resolve<ITransaction> {
    constructor(private service: TransactionService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((transaction: HttpResponse<Transaction>) => transaction.body));
        }
        return of(new Transaction());
    }
}

@Injectable({ providedIn: 'root' })
export class TransactionBatchResolve implements Resolve<number[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const ids: string = route.params['ids'] ? route.params['ids'] : null;
        return ids.split(',').map(v => +v);
    }
}

export const transactionRoute: Routes = [
    {
        path: 'transaction',
        component: TransactionComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'creghipApp.transaction.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction/:id/view',
        component: TransactionDetailComponent,
        resolve: {
            transaction: TransactionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transaction.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction/new',
        component: TransactionUpdateComponent,
        resolve: {
            transaction: TransactionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transaction.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction/:id/edit',
        component: TransactionUpdateComponent,
        resolve: {
            transaction: TransactionResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transaction.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const transactionPopupRoute: Routes = [
    {
        path: 'transaction/:ids/delete',
        component: TransactionDeletePopupComponent,
        resolve: {
            rowIds: TransactionBatchResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transaction.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
