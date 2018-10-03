import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CreghipSharedModule} from 'app/shared';
import {
    ExchangeEntryComponent,
    ExchangeEntryDeleteDialogComponent,
    ExchangeEntryDeletePopupComponent,
    ExchangeEntryDetailComponent,
    exchangeEntryPopupRoute,
    exchangeEntryRoute,
    ExchangeEntryUpdateComponent
} from './';

const ENTITY_STATES = [...exchangeEntryRoute, ...exchangeEntryPopupRoute];

@NgModule({
    imports: [CreghipSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        ExchangeEntryComponent,
        ExchangeEntryDetailComponent,
        ExchangeEntryUpdateComponent,
        ExchangeEntryDeleteDialogComponent,
        ExchangeEntryDeletePopupComponent
    ],
    entryComponents: [
        ExchangeEntryComponent,
        ExchangeEntryUpdateComponent,
        ExchangeEntryDeleteDialogComponent,
        ExchangeEntryDeletePopupComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipExchangeEntryModule {}
