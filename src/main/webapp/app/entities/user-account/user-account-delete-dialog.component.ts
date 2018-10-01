import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import {NgbActiveModal, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';

import {UserAccountService} from './user-account.service';

@Component({
    selector: 'jhi-user-account-delete-dialog',
    templateUrl: './user-account-delete-dialog.component.html'
})
export class UserAccountDeleteDialogComponent {
    rowIds: number[];

    constructor(
        private userAccountService: UserAccountService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {}

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete() {
        console.log('In UserAccountDeleteDialogComponent, deletion confirmed with ' + this.rowIds);
        this.userAccountService.deleteByIds(this.rowIds).subscribe(response => {
            this.eventManager.broadcast({
                name: 'userAccountListModification',
                content: 'Deleted an userAccount'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-user-account-delete-popup',
    template: ''
})
export class UserAccountDeletePopupComponent implements OnInit, OnDestroy {
    private ngbModalRef: NgbModalRef;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private modalService: NgbModal) {}

    ngOnInit() {
        this.activatedRoute.data.subscribe(({ rowIds }) => {
            setTimeout(() => {
                this.ngbModalRef = this.modalService.open(UserAccountDeleteDialogComponent as Component, {
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
