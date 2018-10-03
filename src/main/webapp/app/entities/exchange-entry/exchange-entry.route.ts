import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {UserRouteAccessService} from 'app/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {ExchangeEntry, IExchangeEntry} from 'app/shared/model/exchange-entry.model';
import {ExchangeEntryService} from './exchange-entry.service';
import {ExchangeEntryComponent} from './exchange-entry.component';
import {ExchangeEntryDetailComponent} from './exchange-entry-detail.component';
import {ExchangeEntryUpdateComponent} from './exchange-entry-update.component';
import {ExchangeEntryDeletePopupComponent} from './exchange-entry-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class ExchangeEntryResolve implements Resolve<IExchangeEntry> {
    constructor(private service: ExchangeEntryService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((exchangeEntry: HttpResponse<ExchangeEntry>) => exchangeEntry.body));
        }
        return of(new ExchangeEntry());
    }
}

@Injectable({ providedIn: 'root' })
export class ExchangeEntryBatchResolve implements Resolve<number[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const ids: string = route.params['ids'] ? route.params['ids'] : null;
        return ids.split(',').map(v => +v);
    }
}

export const exchangeEntryRoute: Routes = [
    {
        path: 'exchange-entry',
        component: ExchangeEntryComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'creghipApp.exchangeEntry.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'exchange-entry/:id/view',
        component: ExchangeEntryDetailComponent,
        resolve: {
            exchangeEntry: ExchangeEntryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.exchangeEntry.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'exchange-entry/new',
        component: ExchangeEntryUpdateComponent,
        resolve: {
            exchangeEntry: ExchangeEntryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.exchangeEntry.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'exchange-entry/:id/edit',
        component: ExchangeEntryUpdateComponent,
        resolve: {
            exchangeEntry: ExchangeEntryResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.exchangeEntry.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const exchangeEntryPopupRoute: Routes = [
    {
        path: 'exchange-entry/:ids/delete',
        component: ExchangeEntryDeletePopupComponent,
        resolve: {
            rowIds: ExchangeEntryBatchResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.exchangeEntry.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
