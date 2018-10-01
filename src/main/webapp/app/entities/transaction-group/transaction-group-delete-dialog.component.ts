import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {TransactionGroupService} from './transaction-group.service';

@Component({
    selector: 'jhi-transaction-group-delete-dialog',
    templateUrl: './transaction-group-delete-dialog.component.html'
})
export class TransactionGroupDeleteDialogComponent {
    rowIds: number[];

    constructor(
        private transactionGroupService: TransactionGroupService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        console.log('In TransactionGroupDeleteDialogComponent, deletion confirmed with ' + this.rowIds);
        this.transactionGroupService.deleteByIds(this.rowIds).subscribe(response => {
            this.eventManager.broadcast({
                name: 'transactionGroupListModification',
                content: 'Deleted an transactionGroup'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-transaction-group-delete-popup',
    template: ''
})
export class TransactionGroupDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rowIds }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(TransactionGroupDeleteDialogComponent as Component, {
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
