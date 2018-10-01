import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {CurrencyService} from './currency.service';

@Component({
    selector: 'jhi-currency-delete-dialog',
    templateUrl: './currency-delete-dialog.component.html'
})
export class CurrencyDeleteDialogComponent {
    rowIds: number[];

    constructor(private currencyService: CurrencyService, public activeModal: NgbActiveModal, private eventManager: JhiEventManager) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        console.log('In CurrencyDeleteDialogComponent, deletion confirmed with ' + this.rowIds);
        this.currencyService.deleteByIds(this.rowIds).subscribe(response => {
            this.eventManager.broadcast({
                name: 'currencyListModification',
                content: 'Deleted a currency'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-currency-delete-popup',
    template: ''
})
export class CurrencyDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rowIds }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(CurrencyDeleteDialogComponent as Component, { size: 'lg', backdrop: 'static' });
                this.ngbModalRef.componentInstance.rowIds = rowIds;
                this.ngbModalRef.result.then(
                    result => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    },
                    reason => {
                        this.router.navigate([{ outlets: { popup: null } }], { replaceUrl: true, queryParamsHandling: 'merge' });
                        this.ngbModalRef = null;
                    }
                );
            }, 0);
        });
    }

    ngOnDestroy() {
        this.ngbModalRef = null;
    }
}
