import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import {CreghipCurrencyModule} from './currency/currency.module';
import {CreghipUserAccountModule} from './user-account/user-account.module';
import {CreghipTransactionGroupModule} from './transaction-group/transaction-group.module';
import {CreghipTransactionModule} from './transaction/transaction.module';
import {CreghipExchangeEntryModule} from 'app/entities/exchange-entry/exchange-entry.module';
import {Observable} from 'rxjs';
import {HttpResponse} from '@angular/common/http';

/* jhipster-needle-add-entity-module-import - JHipster will add entity modules imports here */

@NgModule({
    // prettier-ignore
    imports: [
        CreghipCurrencyModule,
        CreghipUserAccountModule,
        CreghipExchangeEntryModule,
        CreghipTransactionGroupModule,
        CreghipTransactionModule
        /* jhipster-needle-add-entity-module - JHipster will add entity modules here */
    ],
    declarations: [],
    entryComponents: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipEntityModule {}

export interface IAutocompleteable {
    autocompletableItem: string;
}

export interface IAutocompleteService {
    getAutocompleteObservable(): Observable<HttpResponse<IAutocompleteable[]>>;
}
