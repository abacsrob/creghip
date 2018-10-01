import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {ICurrency} from 'app/shared/model/currency.model';
import {Principal} from 'app/core';

import {ITEMS_PER_PAGE} from 'app/shared';
import {CurrencyService} from './currency.service';

@Component({
    selector: 'jhi-currency',
    templateUrl: './currency.component.html',
    styleUrls: ['../entity.module.css']
})
export class CurrencyComponent implements OnInit, OnDestroy {
    currentAccount: any;
    currencies: ICurrency[];
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
        private currencyService: CurrencyService,
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
        this.currencyService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ICurrency[]>) => this.paginateCurrencies(res.body, res.headers),
                (res: HttpErrorResponse) => this.onError(res.message)
            );
    }

    loadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.transition();
        }
    }

    transition() {
        this.router.navigate(['/currency'], {
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
            '/currency',
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
        this.registerChangeInCurrencies();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ICurrency) {
        return item.id;
    }

    registerChangeInCurrencies() {
        this.eventSubscriber = this.eventManager.subscribe('currencyListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateCurrencies(data: ICurrency[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.currencies = data;
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

    deleteSelectedRows() {
        console.log('In deleteSelectedRows() with ' + this.selectedRowIds.join(','));
        // this.userAccountService.deleteByIds(this.selectedRowIds);
        this.selectedRowIds = [];
        this.loadAll();
    }

    selectAllRows(event) {
        this.selectedRowIds = [];
        if (event.checked) {
            // const offset: number = (this.page - 1) * this.itemsPerPage;
            for (let i = 0; i < this.itemsPerPage; i++) {
                if ((this.itemsPerPage > this.currencies.length && i >= (this.currencies.length % this.itemsPerPage))
                    || (this.itemsPerPage <= this.currencies.length && i >= this.itemsPerPage)) {
                    break;
                }
                this.selectedRowIds.push(this.currencies[i].id);
            }
        }
        console.log('Selection updated: ' + this.selectedRowIds);
    }
}