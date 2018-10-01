import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {CreghipSharedModule} from 'app/shared';
import {
    UserAccountComponent,
    UserAccountDeleteDialogComponent,
    UserAccountDeletePopupComponent,
    UserAccountDetailComponent,
    userAccountPopupRoute,
    userAccountRoute,
    UserAccountUpdateComponent
} from './';

const ENTITY_STATES = [...userAccountRoute, ...userAccountPopupRoute];

@NgModule({
    imports: [CreghipSharedModule, RouterModule.forChild(ENTITY_STATES)],
    declarations: [
        UserAccountComponent,
        UserAccountDetailComponent,
        UserAccountUpdateComponent,
        UserAccountDeleteDialogComponent,
        UserAccountDeletePopupComponent,
    ],
    entryComponents: [UserAccountComponent, UserAccountUpdateComponent, UserAccountDeleteDialogComponent, UserAccountDeletePopupComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CreghipUserAccountModule {}
