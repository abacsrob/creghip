/**
 * Angular bootstrap Date adapter
 */
import {Injectable} from '@angular/core';
import {NgbDateAdapter, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import {Moment} from 'moment';

import {DATE_FORMAT} from 'app/shared';

@Injectable()
export class NgbDateMomentAdapter extends NgbDateAdapter<Moment> {
    fromModel(date: Moment): NgbDateStruct {
        if (date != null && date.isValid()) {
            return { year: date.year(), month: date.month() + 1, day: date.date() };
        }
        return null;
    }

    toModel(date: NgbDateStruct): Moment {
        if (date) {
            let fmt = DATE_FORMAT;
            fmt = fmt.replace('YYYY', date.year.toString());
            fmt = fmt.replace('MM', date.month.toString());
            fmt = fmt.replace('DD', date.day.toString());
            return moment(fmt, DATE_FORMAT);
        }
        return null;
    }
}
