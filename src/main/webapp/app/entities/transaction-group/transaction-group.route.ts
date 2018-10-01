import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {UserRouteAccessService} from 'app/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ITransactionGroup, TransactionGroup} from 'app/shared/model/transaction-group.model';
import {TransactionGroupService} from './transaction-group.service';
import {TransactionGroupComponent} from './transaction-group.component';
import {TransactionGroupDetailComponent} from './transaction-group-detail.component';
import {TransactionGroupUpdateComponent} from './transaction-group-update.component';
import {TransactionGroupDeletePopupComponent} from './transaction-group-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class TransactionGroupResolve implements Resolve<ITransactionGroup> {
    constructor(private service: TransactionGroupService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((transactionGroup: HttpResponse<TransactionGroup>) => transactionGroup.body));
        }
        return of(new TransactionGroup());
    }
}

@Injectable({ providedIn: 'root' })
export class TransactionGroupBatchResolve implements Resolve<number[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const ids: string = route.params['ids'] ? route.params['ids'] : null;
        return ids.split(',').map(v => +v);
    }
}

export const transactionGroupRoute: Routes = [
    {
        path: 'transaction-group',
        component: TransactionGroupComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'creghipApp.transactionGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction-group/:id/view',
        component: TransactionGroupDetailComponent,
        resolve: {
            transactionGroup: TransactionGroupResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transactionGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction-group/new',
        component: TransactionGroupUpdateComponent,
        resolve: {
            transactionGroup: TransactionGroupResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transactionGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'transaction-group/:id/edit',
        component: TransactionGroupUpdateComponent,
        resolve: {
            transactionGroup: TransactionGroupResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transactionGroup.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const transactionGroupPopupRoute: Routes = [
    {
        path: 'transaction-group/:ids/delete',
        component: TransactionGroupDeletePopupComponent,
        resolve: {
            rowIds: TransactionGroupBatchResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.transactionGroup.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
