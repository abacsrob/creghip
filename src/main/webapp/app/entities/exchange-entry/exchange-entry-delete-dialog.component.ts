import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';
import {ExchangeEntryService} from './exchange-entry.service';

@Component({
    selector: 'jhi-exchange-entry-delete-dialog',
    templateUrl: './exchange-entry-delete-dialog.component.html'
})
export class ExchangeEntryDeleteDialogComponent {
    rowIds: number[];

    constructor(
        private exchangeEntryService: ExchangeEntryService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        this.exchangeEntryService.deleteByIds(this.rowIds).subscribe(response => {
            this.eventManager.broadcast({
                name: 'exchangeEntryListModification',
                content: 'Deleted an exchangeEntry'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-exchange-entry-delete-popup',
    template: ''
})
export class ExchangeEntryDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rowIds }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(ExchangeEntryDeleteDialogComponent as Component, {
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
