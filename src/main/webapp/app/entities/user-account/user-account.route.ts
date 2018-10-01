import {Injectable} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot, Routes} from '@angular/router';
import {JhiResolvePagingParams} from 'ng-jhipster';
import {UserRouteAccessService} from 'app/core';
import {of} from 'rxjs';
import {map} from 'rxjs/operators';
import {IUserAccount, UserAccount} from 'app/shared/model/user-account.model';
import {UserAccountService} from './user-account.service';
import {UserAccountComponent} from './user-account.component';
import {UserAccountDetailComponent} from './user-account-detail.component';
import {UserAccountUpdateComponent} from './user-account-update.component';
import {UserAccountDeletePopupComponent} from './user-account-delete-dialog.component';

@Injectable({ providedIn: 'root' })
export class UserAccountResolve implements Resolve<IUserAccount> {
    constructor(private service: UserAccountService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const id = route.params['id'] ? route.params['id'] : null;
        if (id) {
            return this.service.find(id).pipe(map((userAccount: HttpResponse<UserAccount>) => userAccount.body));
        }
        return of(new UserAccount());
    }
}

@Injectable({ providedIn: 'root' })
export class UserAccountBatchResolve implements Resolve<number[]> {
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const ids: string = route.params['ids'] ? route.params['ids'] : null;
        return ids.split(',').map(v => +v);
    }
}

export const userAccountRoute: Routes = [
    {
        path: 'user-account',
        component: UserAccountComponent,
        resolve: {
            pagingParams: JhiResolvePagingParams
        },
        data: {
            authorities: ['ROLE_USER'],
            defaultSort: 'id,asc',
            pageTitle: 'creghipApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        runGuardsAndResolvers: 'always'
    },
    {
        path: 'user-account/:id/view',
        component: UserAccountDetailComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-account/new',
        component: UserAccountUpdateComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    },
    {
        path: 'user-account/:id/edit',
        component: UserAccountUpdateComponent,
        resolve: {
            userAccount: UserAccountResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService]
    }
];

export const userAccountPopupRoute: Routes = [
    {
        path: 'user-account/:ids/delete',
        component: UserAccountDeletePopupComponent,
        resolve: {
            rowIds: UserAccountBatchResolve
        },
        data: {
            authorities: ['ROLE_USER'],
            pageTitle: 'creghipApp.userAccount.home.title'
        },
        canActivate: [UserRouteAccessService],
        outlet: 'popup'
    }
];
