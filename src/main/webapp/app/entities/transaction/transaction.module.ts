import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CreghipSharedModule} from 'app/shared';
import {
    TransactionComponent,
    TransactionDeleteDialogComponent,
    TransactionDeletePopupComponent,
    TransactionDetailComponent,
    transactionPopupRoute,
    transactionRoute,
    TransactionUpdateComponent
} from './';

const ENTITY_STATES = [...transactionRoute, ...transactionPopupRoute];

@NgModule({
    imports: [CreghipSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TransactionComponent,
        TransactionDetailComponent,
        TransactionUpdateComponent,
        TransactionDeleteDialogComponent,
        TransactionDeletePopupComponent,
    ],
    entryComponents: [TransactionComponent, TransactionUpdateComponent, TransactionDeleteDialogComponent, TransactionDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipTransactionModule {}
