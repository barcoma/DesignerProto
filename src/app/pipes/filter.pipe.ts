import { Pipe, Injectable, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: any): any[] {
        if (!items) {
            return [];
        }
        if (value === undefined) {
            return items;
        }
        return items.filter(it => it[field] === value);
    }
}
