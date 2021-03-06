import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {ITransaction} from 'app/shared/model/transaction.model';
import {Principal} from 'app/core';

import {ITEMS_PER_PAGE} from 'app/shared';
import {TransactionService} from './transaction.service';

@Component({
    selector: 'jhi-transaction',
    templateUrl: './transaction.component.html',
    styleUrls: ['../entity.module.css']
})
export class TransactionComponent implements OnInit, OnDestroy {
    currentAccount: any;
    transactions: ITransaction[];
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
        private transactionService: TransactionService,
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
        this.transactionService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ITransaction[]>) => this.paginateTransactions(res.body, res.headers),
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
        this.router.navigate(['/transaction'], {
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
            '/transaction',
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
        this.registerChangeInTransactions();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITransaction) {
        return item.id;
    }

    registerChangeInTransactions() {
        this.eventSubscriber = this.eventManager.subscribe('transactionListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateTransactions(data: ITransaction[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.transactions = data;
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
                if ((this.itemsPerPage > this.transactions.length && i >= (this.transactions.length % this.itemsPerPage))
                    || (this.itemsPerPage <= this.transactions.length && i >= this.itemsPerPage)) {
                    break;
                }
                this.selectedRowIds.push(this.transactions[i].id);
            }
        }
        console.log('Selection updated: ' + this.selectedRowIds);
    }
}
