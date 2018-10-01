import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {UserRouteAccessService} from 'app/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Currency, ICurrency} from 'app/shared/model/currency.model';
import {CurrencyService} from './currency.service';
import {CurrencyComponent} from './currency.component';
import {CurrencyDetailComponent} from './currency-detail.component';
import {CurrencyUpdateComponent} from './currency-update.component';
import {CurrencyDeletePopupComponent} from './currency-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class CurrencyResolve implements Resolve<ICurrency> {
    constructor(private service: CurrencyService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((currency: HttpResponse<Currency>) => currency.body));
        }
        return of(new Currency());
    }
}

@Injectable({ providedIn: 'root' })
export class CurrencyBatchResolve implements Resolve<number[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const ids: string = route.params['ids'] ? route.params['ids'] : null;
        return ids.split(',').map(v => +v);
    }
}

export const currencyRoute: Routes = [
    {
        path: 'currency',
        component: CurrencyComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'creghipApp.currency.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'currency/:id/view',
        component: CurrencyDetailComponent,
        resolve: {
            currency: CurrencyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.currency.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'currency/new',
        component: CurrencyUpdateComponent,
        resolve: {
            currency: CurrencyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.currency.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'currency/:id/edit',
        component: CurrencyUpdateComponent,
        resolve: {
            currency: CurrencyResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.currency.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const currencyPopupRoute: Routes = [
    {
        path: 'currency/:ids/delete',
        component: CurrencyDeletePopupComponent,
        resolve: {
            rowIds: CurrencyBatchResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.currency.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
