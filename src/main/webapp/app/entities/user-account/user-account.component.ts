import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {IUserAccount} from 'app/shared/model/user-account.model';
import {Principal} from 'app/core';

import {ITEMS_PER_PAGE} from 'app/shared';
import {UserAccountService} from './user-account.service';
import {IAutocompleteService} from "app/entities/entity.module";

@Component({
    selector: 'jhi-user-account',
    templateUrl: './user-account.component.html',
    styleUrls: ['../entity.module.css']
})
export class UserAccountComponent implements OnInit, OnDestroy {
    currentAccount: any;
    userAccounts: IUserAccount[];
    error: any;
    success: any;
    eventSubscriber: Subscription;
    routeData: any;
    links: any;
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any;
    predicate: any;
    previousPage: any;
    reverse: any;
    selectedRowIds: number[] = [];

    constructor(
        private userAccountService: UserAccountService,
        private parseLinks: JhiParseLinks,
        private jhiAlertService: JhiAlertService,
        private principal: Principal,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventManager: JhiEventManager
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.routeData = this.activatedRoute.data.subscribe(data => {
            this.page = data.pagingParams.page;
            this.previousPage = data.pagingParams.page;
            this.reverse = data.pagingParams.ascending;
            this.predicate = data.pagingParams.predicate;
        });
    }

    loadAll() {
        this.userAccountService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<IUserAccount[]>) => this.paginateUserAccounts(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    getService(): IAutocompleteService {
        return this.userAccountService;
    }

    transition() {
        this.router.navigate(['/user-account'], {
            queryParams: {
                page: this.page,
                size: this.itemsPerPage,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        });
        this.loadAll();
    }

    clear() {
        this.page = 0;
        this.router.navigate([
            '/user-account',
            {
                page: this.page,
                sort: this.predicate + ',' + (this.reverse ? 'asc' : 'desc')
            }
        ]);
        this.loadAll();
    }

    ngOnInit() {
        this.loadAll();
        this.principal.identity().then(account => {
            this.currentAccount = account;
        });
        this.registerChangeInUserAccounts();
        // to forcibly reload when staying at the same route
        // this.router.routeReuseStrategy.shouldReuseRoute = function () {
        //     return false;
        // }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: IUserAccount) {
        return item.id;
    }

    registerChangeInUserAccounts() {
        this.eventSubscriber = this.eventManager.subscribe('userAccountListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateUserAccounts(data: IUserAccount[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.userAccounts = data;
    }

    private onError(errorMessage: string) {
        this.jhiAlertService.error(errorMessage, null, null);
    }

    selectRow(event) {
        const idValue: number = +event.value;
        if (event.checked) {
            this.selectedRowIds.push(idValue);
        } else {
            this.selectedRowIds = this.selectedRowIds.filter(
                (n: number) => {
                    return n !== idValue;
                }
            );
        }
        this.selectedRowIds = this.selectedRowIds.sort(
            (a: number, b: number) => {
                return a - b;
            }
        );
        console.log(this.selectedRowIds);
    }

    selectAllRows(event) {
        this.selectedRowIds = [];
        if (event.checked) {
            for (let i = 0; i < this.itemsPerPage; i++) {
                if ((this.itemsPerPage > this.userAccounts.length && i >= (this.userAccounts.length % this.itemsPerPage))
                    || (this.itemsPerPage <= this.userAccounts.length && i >= this.itemsPerPage)) {
                    break;
                }
                this.selectedRowIds.push(this.userAccounts[i].id);
            }
        }
        console.log('Selection updated: ' + this.selectedRowIds);
    }
}
