import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from '@angular/common';
import {DISPLAY_DATE_FORMAT} from 'app/shared';

@Pipe({
    name: 'customDateFormat'
})
export class CustomDatePipe extends DatePipe implements PipeTransform {
    transform(value: any, args?: any): any {
        return super.transform(value, DISPLAY_DATE_FORMAT);
    }
}
