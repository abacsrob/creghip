/* tslint:disable max-line-length */
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {HttpResponse} from '@angular/common/http';
import {of} from 'rxjs';

import {CreghipTestModule} from '../../../test.module';
import {CurrencyUpdateComponent} from 'app/entities/currency/currency-update.component';
import {CurrencyService} from 'app/entities/currency/currency.service';
import {Currency} from 'app/shared/model/currency.model';

describe('Component Tests', () => {
    describe('Currency Management Update Component', () => {
        let comp: CurrencyUpdateComponent;
        let fixture: ComponentFixture<CurrencyUpdateComponent>;
        let service: CurrencyService;

        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [CreghipTestModule],
                declarations: [CurrencyUpdateComponent]
            })
                .overrideTemplate(CurrencyUpdateComponent, '')
                .compileComponents();

            fixture = TestBed.createComponent(CurrencyUpdateComponent);
            comp = fixture.componentInstance;
            service = fixture.debugElement.injector.get(CurrencyService);
        });

        describe('save', () => {
            it(
                'Should call update service on save for existing entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Currency(123);
                    spyOn(service, 'update').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.currency = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.update).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );

            it(
                'Should call create service on save for new entity',
                fakeAsync(() => {
                    // GIVEN
                    const entity = new Currency();
                    spyOn(service, 'create').and.returnValue(of(new HttpResponse({ body: entity })));
                    comp.currency = entity;
                    // WHEN
                    comp.save();
                    tick(); // simulate async

                    // THEN
                    expect(service.create).toHaveBeenCalledWith(entity);
                    expect(comp.isSaving).toEqual(false);
                })
            );
        });
    });
});
