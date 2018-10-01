import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {JhiAlertService, JhiEventManager, JhiParseLinks} from 'ng-jhipster';

import {ITransactionGroup} from 'app/shared/model/transaction-group.model';
import {Principal} from 'app/core';

import {ITEMS_PER_PAGE} from 'app/shared';
import {TransactionGroupService} from './transaction-group.service';

@Component({
    selector: 'jhi-transaction-group',
    templateUrl: './transaction-group.component.html',
    styleUrls: ['../entity.module.css']
})
export class TransactionGroupComponent implements OnInit, OnDestroy {
    currentAccount: any;
    transactionGroups: ITransactionGroup[];
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
        private transactionGroupService: TransactionGroupService,
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
        this.transactionGroupService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            })
            .subscribe(
                (res: HttpResponse<ITransactionGroup[]>) => this.paginateTransactionGroups(res.body, res.headers),
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
        this.router.navigate(['/transaction-group'], {
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
            '/transaction-group',
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
        this.registerChangeInTransactionGroups();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: ITransactionGroup) {
        return item.id;
    }

    registerChangeInTransactionGroups() {
        this.eventSubscriber = this.eventManager.subscribe('transactionGroupListModification', response => this.loadAll());
    }

    sort() {
        const result = [this.predicate + ',' + (this.reverse ? 'asc' : 'desc')];
        if (this.predicate !== 'id') {
            result.push('id');
        }
        return result;
    }

    private paginateTransactionGroups(data: ITransactionGroup[], headers: HttpHeaders) {
        this.links = this.parseLinks.parse(headers.get('link'));
        this.totalItems = parseInt(headers.get('X-Total-Count'), 10);
        this.queryCount = this.totalItems;
        this.transactionGroups = data;
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
                if ((this.itemsPerPage > this.transactionGroups.length && i >= (this.transactionGroups.length % this.itemsPerPage))
                    || (this.itemsPerPage <= this.transactionGroups.length && i >= this.itemsPerPage)) {
                    break;
                }
                this.selectedRowIds.push(this.transactionGroups[i].id);
            }
        }
        console.log('Selection updated: ' + this.selectedRowIds);
    }
}
