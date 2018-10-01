import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {TransactionService} from './transaction.service';

@Component({
    selector: 'jhi-transaction-delete-dialog',
    templateUrl: './transaction-delete-dialog.component.html'
})
export class TransactionDeleteDialogComponent {
    rowIds: number[];

    constructor(
        private transactionService: TransactionService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        console.log('In TransactionDeleteDialogComponent, deletion confirmed with ' + this.rowIds);
        this.transactionService.deleteByIds(this.rowIds).subscribe(response => {
            this.eventManager.broadcast({
                name: 'transactionListModification',
                content: 'Deleted a transaction'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-transaction-delete-popup',
    template: ''
})
export class TransactionDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rowIds }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TransactionDeleteDialogComponent as Component, {
                    size: 'lg',
                    backdrop: 'static'
                });
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
