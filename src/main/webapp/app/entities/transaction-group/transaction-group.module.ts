import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CreghipSharedModule} from 'app/shared';
import {
    TransactionGroupComponent,
    TransactionGroupDeleteDialogComponent,
    TransactionGroupDeletePopupComponent,
    TransactionGroupDetailComponent,
    transactionGroupPopupRoute,
    transactionGroupRoute,
    TransactionGroupUpdateComponent
} from './';

const ENTITY_STATES = [...transactionGroupRoute, ...transactionGroupPopupRoute];

@NgModule({
    imports: [CreghipSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        TransactionGroupComponent,
        TransactionGroupDetailComponent,
        TransactionGroupUpdateComponent,
        TransactionGroupDeleteDialogComponent,
        TransactionGroupDeletePopupComponent,
    ],
    entryComponents: [
        TransactionGroupComponent,
        TransactionGroupUpdateComponent,
        TransactionGroupDeleteDialogComponent,
        TransactionGroupDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipTransactionGroupModule {}
