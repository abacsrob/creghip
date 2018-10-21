import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {NgbDateAdapter, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

import {NgbDateMomentAdapter} from './util/datepicker-adapter';
import {CreghipSharedCommonModule, CreghipSharedLibsModule, HasAnyAuthorityDirective, JhiLoginModalComponent} from './';
import {NgbDateParserFormatterCustom} from 'app/shared/util/ngb-date-parser-formatter-custom';
import {CustomDatePipe} from 'app/shared/util/custom-date-pipe';
import {PagesizeSelectorComponent} from 'app/shared/pagesize-selector/pagesize-selector.component';
import {BatchedDeleteButtonComponent} from 'app/shared/batched-delete-components/batched-delete-button.component';
import {AutocompleteComponent} from 'app/shared/autocomplete/autocomplete.component';

@NgModule({
    imports: [CreghipSharedLibsModule, CreghipSharedCommonModule],
    declarations: [
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        CustomDatePipe,
        PagesizeSelectorComponent,
        BatchedDeleteButtonComponent,
        AutocompleteComponent
    ],
    providers: [
        {provide: NgbDateAdapter, useClass: NgbDateMomentAdapter},
        {provide: NgbDateParserFormatter, useClass: NgbDateParserFormatterCustom}
        ],
    entryComponents: [JhiLoginModalComponent],
    exports: [
        CreghipSharedCommonModule,
        JhiLoginModalComponent,
        HasAnyAuthorityDirective,
        CustomDatePipe,
        PagesizeSelectorComponent,
        BatchedDeleteButtonComponent,
        AutocompleteComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipSharedModule {}
