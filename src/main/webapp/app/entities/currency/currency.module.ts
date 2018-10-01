import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CreghipSharedModule} from 'app/shared';
import {
    CurrencyComponent,
    CurrencyDeleteDialogComponent,
    CurrencyDeletePopupComponent,
    CurrencyDetailComponent,
    currencyPopupRoute,
    currencyRoute,
    CurrencyUpdateComponent
} from './';

const ENTITY_STATES = [...currencyRoute, ...currencyPopupRoute];

@NgModule({
    imports: [CreghipSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        CurrencyComponent,
        CurrencyDetailComponent,
        CurrencyUpdateComponent,
        CurrencyDeleteDialogComponent,
        CurrencyDeletePopupComponent
    ],
    entryComponents: [CurrencyComponent, CurrencyUpdateComponent, CurrencyDeleteDialogComponent, CurrencyDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipCurrencyModule {}
